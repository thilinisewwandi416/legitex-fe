chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && /^https?:/.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"]
    })
    .then(() => {
      chrome.tabs.sendMessage(tabId, { action: "analyze_url" });
    })
    .catch((error) => {
      // Improved error logging
      console.error("Error injecting content script:", error.message);
      console.error("Tab ID:", tabId, "Tab URL:", tab.url);
    });
  }
});
