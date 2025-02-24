chrome.runtime.onInstalled.addListener(() => {
    console.log("Legitex Extension Installed and Running");
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['scripts/url_detection.js']
      });
    }
  });
  