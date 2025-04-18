chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.startsWith("http")) {
      chrome.storage.local.get(["authToken"], async (result) => {
        const token = result.authToken;
        if (!token) return;
  
        try {
          const response = await fetch("https://phishing-api-750285941825.asia-southeast1.run.app/analyze_url", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ url: tab.url })
          });
  
          if (response.ok) {
            const data = await response.json();
            const confidence = data.phishing_check.phishing_confidence;
            console.log("Confidence score:", confidence);
  
            if (confidence > 30) {
              chrome.scripting.executeScript({
                target: { tabId },
                files: ["content.js"]
              }, () => {
                chrome.tabs.sendMessage(tabId, {
                  type: "SHOW_PHISHING_WARNING",
                  label: confidence <= 50 ? "HIGH RISK" : "DANGEROUS"
                });
              });
            }
          } else {
            console.warn("API returned non-200:", response.status);
          }
        } catch (err) {
          console.error("Phishing API error:", err);
        }
      });
    }
  });
  