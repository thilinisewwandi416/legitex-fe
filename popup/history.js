async function fetchHistory(token) {
  try {
    const res = await fetch("https://phishing-api-750285941825.asia-southeast1.run.app/report", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.error("Failed to fetch history:", await res.text());
      return;
    }

    const data = await res.json();
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = ""; 

    const last10 = data.slice(-10).reverse();

    last10.forEach(entry => {
      const tr = document.createElement("tr");

      const urlTd = document.createElement("td");
      urlTd.textContent = entry.url;
      urlTd.title = entry.url;
      Object.assign(urlTd.style, {
        padding: "10px",
        border: "1px solid #e0e0e0",
        wordBreak: "break-word",
        fontSize: "12px",
        verticalAlign: "middle"
      });

      const riskTd = document.createElement("td");

      let label = "UNKNOWN";
      let color = "#9e9e9e";
      const score = (entry.score || "").toLowerCase();
      const title = (entry.title || "").toLowerCase();
      const issue = (entry.issue || "").toLowerCase();
      
      if (score === "critical") {
        label = "DANGEROUS";
        color = "#f44336";
      } else if (title.includes("phishing") || issue.includes("url reputation") || issue.includes("visual clone")) {
        label = "HIGH RISK";
        color = "#ff5722";
      } else if (score === "safe" && issue === "none") {
        label = "SECURE";
        color = "#4caf50";
      }
      

      Object.assign(riskTd.style, {
        padding: "10px",
        border: "1px solid #e0e0e0",
        fontWeight: "bold",
        fontSize: "12px",
        color: color,
        textAlign: "center",
        verticalAlign: "middle"
      });

      riskTd.innerHTML = `
        ${label}
        <span style="
          margin-left: 6px;
          width: 10px;
          height: 10px;
          background-color: ${color};
          border-radius: 50%;
          display: inline-block;
        "></span>
      `;

      tr.appendChild(urlTd);
      tr.appendChild(riskTd);
      tableBody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error loading history:", error);
  }
}

  
  document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["authToken"], (result) => {
      const token = result.authToken;
      if (token) {
        fetchHistory(token);
      } else {
        console.warn("No auth token found.");
      }
    });
  });
  
  document.getElementById("moreDetailsBtn").addEventListener("click", () => {
    chrome.tabs.create({ url: "../recent-scans/recent-scans.html" }); 
  });
  