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
      tableBody.innerHTML = ""; // Clear existing rows
  
      const last10 = data.slice(-10).reverse(); // Get last 10 entries, newest first
  
      last10.forEach(entry => {
        const tr = document.createElement("tr");
  
        // === Website URL Cell ===
        const urlTd = document.createElement("td");
        urlTd.textContent = entry.url;
        urlTd.title = entry.url; // Tooltip
        Object.assign(urlTd.style, {
          padding: "10px",
          border: "1px solid #e0e0e0",
          wordBreak: "break-word",
          fontSize: "12px",
          verticalAlign: "middle"
        });
  
        // === Risk Level Cell ===
        const riskTd = document.createElement("td");
        Object.assign(riskTd.style, {
          padding: "10px",
          border: "1px solid #e0e0e0",
          fontWeight: "bold",
          fontSize: "12px",
          color: entry.is_safe ? "#4caf50" : "#ff4d4d",
          textAlign: "center",
          verticalAlign: "middle"
        });
  
        riskTd.innerHTML = `
          ${entry.is_safe ? "SAFE" : "UNSAFE"}
          <span style="
            margin-left: 6px;
            width: 10px;
            height: 10px;
            background-color: ${entry.is_safe ? "#4caf50" : "#ff4d4d"};
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
  