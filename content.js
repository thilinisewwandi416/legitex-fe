chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyze_url") {
    analyzeUrl(window.location.href).then((result) => {
      if (result.isPhishing) {
        alert("⚠️ Warning: This site might be a phishing attempt!");
      }
    });
  }
});