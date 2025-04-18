function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return expiry < now;
  } catch (e) {
    return true;
  }
}

function populatePopup(response) {
  const urlSpan = document.querySelector("p strong + span");
  if (urlSpan) urlSpan.textContent = response.url;

  const phishingConfidence = document.getElementById("phishingConfidence");
  const phishingStatus = document.getElementById("phishingStatus");

  if (phishingConfidence && phishingStatus) {
    const confidence = response.phishing_check.phishing_confidence;
  
    phishingConfidence.textContent = `${confidence.toFixed(2)}%`;
  
    let label = "";
    let color = "";
  
    if (confidence <= 10) {
      label = "SECURE";
      color = "#4caf50"; 
    } else if (confidence <= 30) {
      label = "MODERATELY SECURE";
      color = "#ff9800"; 
    } else if (confidence <= 50) {
      label = "HIGH RISK";
      color = "#ff5722"; 
    } else {
      label = "DANGEROUS";
      color = "#f44336"; 
    }
  
    phishingStatus.textContent = label;
    phishingConfidence.style.color = color;
    phishingStatus.style.backgroundColor = color;
  
    phishingStatus.style.color = "#ffffff";
    phishingStatus.style.padding = "2px 8px";
    phishingStatus.style.borderRadius = "5px";
    phishingStatus.style.fontSize = "12px";
  }  

  // SSL Verification Info
  const tlsStatus = document.getElementById("tlsStatus");
  if (tlsStatus) {
    tlsStatus.textContent = response.ssl_check.ssl_verified ? "Verified" : "Unverified";
    tlsStatus.style.backgroundColor = response.ssl_check.ssl_verified ? "#4caf50" : "#ff4d4d";
    tlsStatus.style.color = "#ffffff";
    tlsStatus.style.padding = "2px 8px";
    tlsStatus.style.borderRadius = "5px";
    tlsStatus.style.fontSize = "12px";
  }

  const certFields = document.querySelectorAll("div ul li");
  if (certFields.length >= 5) {
    certFields[0].innerHTML = `<strong>Common Name:</strong> ${response.ssl_check.common_name}`;
    certFields[1].innerHTML = `<strong>Subject Alternative Names:</strong> ${response.ssl_check.subject_alternative_names.join(", ")}`;
    certFields[2].innerHTML = `<strong>Serial Number:</strong> ${response.ssl_check.serial_number}`;
    certFields[3].innerHTML = `<strong>SHA1 Thumbprint:</strong> ${response.ssl_check.sha1_thumbprint}`;
    certFields[4].innerHTML = `<strong>Expiration Date:</strong> ${response.ssl_check.expiration_date}`;
  }

  //Visual Similarity Detection Section
  const visualScoreSpan = document.getElementById("visualScore");
  const visualStatusSpan = document.getElementById("visualStatus");

  if (visualScoreSpan && visualStatusSpan) {
    const similarityScore = response.visual_similarity.similarity_score;
    const isDetected = response.visual_similarity.visual_similarity_detected;
  
    visualScoreSpan.textContent = `${similarityScore.toFixed(2)}%`;
  
    // Set score text color: Red if > 50%, otherwise green
    visualScoreSpan.style.color = similarityScore > 50 ? "#ff4d4d" : "#4caf50";
  
    if (isDetected) {
      visualStatusSpan.textContent = "YES";
      visualStatusSpan.style.backgroundColor = "#ff4d4d"; // Red
    } else {
      visualStatusSpan.textContent = "NO";
      visualStatusSpan.style.backgroundColor = "#4caf50"; // Green
    }
  
    visualStatusSpan.style.color = "#ffffff";
    visualStatusSpan.style.padding = "2px 8px";
    visualStatusSpan.style.borderRadius = "5px";
    visualStatusSpan.style.fontSize = "12px";
  }  
}


// Analyze current tab's URL
async function analyzeCurrentTab(token) {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const currentUrl = tabs[0].url;

    try {
      const response = await fetch("https://phishing-api-750285941825.asia-southeast1.run.app/analyze_url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: currentUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        populatePopup(data);
      } else {
        console.error("API Error:", await response.text());
      }
    } catch (err) {
      console.error("Error fetching analysis:", err);
    }
  });
}

// On popup load, check auth token
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["authToken"], (result) => {
    const token = result.authToken;
    if (!token || isTokenExpired(token)) {
      window.location.href = "../auth/login.html";
    } else {
      analyzeCurrentTab(token);
    }
  });
});

// Logout
document.getElementById("logout-btn")?.addEventListener("click", () => {
  chrome.storage.local.remove("authToken", () => {
    window.location.href = "../auth/login.html";
  });
});

// Navigate to browsing history
document.getElementById("previousBrowsingButton")?.addEventListener("click", () => {
  window.location.href = "./history.html";
});
