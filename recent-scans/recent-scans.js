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

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Legitex - Recent Scan Report", 14, 20);

  const table = document.querySelector("table");
  const rows = [];
  const headers = [];

  // Get headers
  table.querySelectorAll("thead th").forEach(th => {
    headers.push(th.innerText.trim());
  });

  // Get data rows
  table.querySelectorAll("tbody tr").forEach(tr => {
    const row = [];
    tr.querySelectorAll("td").forEach(td => {
      row.push(td.innerText.trim());
    });
    rows.push(row);
  });

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 30,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 74, 173] }
  });

  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  doc.save(`legitex_recent_scans_${timestamp}.pdf`);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchScanData();
  setInterval(fetchScanData, 30000);

  const btn = document.getElementById("generateBtn");
  if (btn) {
    btn.addEventListener("click", generatePDF);
  }
});
