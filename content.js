console.log("Legitex content script injected");

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SHOW_PHISHING_WARNING") {
    showPhishingOverlay(message.label);
  }
});

function showPhishingOverlay(label) {
  if (document.getElementById("phishing-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "phishing-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "#f2f2f2";
  overlay.style.zIndex = "999999";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.fontFamily = "Segoe UI, Roboto, Arial, sans-serif";

  overlay.innerHTML = `
    <div style="
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      padding: 40px 30px;
      max-width: 600px;
      text-align: center;
    ">
      <div style="font-size: 2rem; color: #d32f2f; margin-bottom: 10px;">⚠️ Warning</div>
      <h2 style="margin: 0; font-size: 1.8rem;">Suspected Phishing</h2>
      <p style="margin-top: 10px; font-size: 1rem; color: #333;">
        <strong>This website has been flagged as <span style="color: #d32f2f;">${label}</span>.</strong><br>
        Phishing is when a site attempts to steal sensitive information by falsely presenting as a safe source.
      </p>
      <div style="margin-top: 25px;">
        <button id="learnMoreBtn" style="
          background-color: #1976d2;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 1rem;
          border-radius: 6px;
          margin-right: 15px;
          cursor: pointer;
        ">Learn More</button>
        <button id="closeOverlayBtn" style="
          background: none;
          color: #d32f2f;
          border: none;
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
        ">Ignore & Proceed</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("closeOverlayBtn").addEventListener("click", () => {
    overlay.remove();
  });

  document.getElementById("learnMoreBtn").addEventListener("click", () => {
    window.open("https://www.ibm.com/think/topics/phishing", "_blank");
  });
}
