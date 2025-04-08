async function fetchScanData() {
  try {
    chrome.storage.local.get(["authToken"], async (result) => {
      const token = result.authToken;
      if (!token) {
        console.warn("Auth token missing.");
        return;
      }

      const res = await fetch("https://phishing-api-750285941825.asia-southeast1.run.app/report", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const tbody = document.getElementById("scanTableBody");
      tbody.innerHTML = "";

      const last10 = data.slice(0, 10);

      last10.forEach((entry) => {
        const tr = document.createElement("tr");

        const urlTd = document.createElement("td");
        urlTd.className = "url";
        urlTd.textContent = entry.url;

        const scoreTd = document.createElement("td");
        const score = (entry.score || "").toLowerCase();
        const title = (entry.title || "").toLowerCase();
        const issue = (entry.issue || "").toLowerCase();

        let label = "UNKNOWN";
        let color = "#9e9e9e";

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

        scoreTd.textContent = label;
        scoreTd.style.color = color;
        scoreTd.style.fontWeight = "bold";

        const titleTd = document.createElement("td");
        titleTd.textContent = entry.title || "N/A";

        const issueTd = document.createElement("td");
        issueTd.textContent = entry.issue || "Unknown";

        const timeTd = document.createElement("td");
        timeTd.textContent = formatRelativeTime(entry.checked_at);

        tr.append(urlTd, scoreTd, titleTd, issueTd, timeTd);
        tbody.appendChild(tr);
      });

      document.getElementById("lastUpdate").textContent = `Last update: ${new Date().toLocaleString()}`;
    });
  } catch (err) {
    console.error("Failed to load scan data:", err);
  }
}

function formatRelativeTime(datetimeStr) {
  const utcString = datetimeStr.replace(" ", "T") + "Z";
  const past = new Date(utcString);
  const now = new Date();

  const seconds = Math.floor((now - past) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchScanData();
  setInterval(fetchScanData, 30000);

  document.getElementById("generateBtn").addEventListener("click", async () => {
    const pdf = new window.jspdf.jsPDF();
  
    const table = document.querySelector("table");
  
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.setFontSize(16);
      pdf.text("Legitex - Recent Scan Report", 10, 10);
      pdf.addImage(imgData, "PNG", 0, 20, pdfWidth, pdfHeight);
      pdf.save("recent-scans.pdf");
    });
  });  
});
