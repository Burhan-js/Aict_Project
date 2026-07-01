document.addEventListener('DOMContentLoaded', () => {
  const expenseForm = document.getElementById('expenseForm');
  const tableBody = document.getElementById('tableBody');
  const addExpenseBtnTop = document.getElementById('addExpenseBtnTop');
  const addExpenseFormPanel = document.getElementById('addExpenseFormPanel');
  const toggleThemeBtn = document.getElementById('toggleThemeBtn');

  let pieChart = null;
  let lineChart = null;

  

  // Helpers
  function formatCurrency(v) {
    return `Rs ${Number(v).toFixed(2)}`;
  }

  function updateCards(rows) {
    const totals = { Food: 0, Transport: 0, Utilities: 0, Entertainment: 0 };
    rows.forEach(r => {
      const cat = r[2];
      const amt = parseFloat(r[4]) || 0;
      if (cat in totals) totals[cat] += amt;
    });
    document.getElementById('totalFood').innerText = formatCurrency(totals.Food);
    document.getElementById('totalTransport').innerText = formatCurrency(totals.Transport);
    document.getElementById('totalUtilities').innerText = formatCurrency(totals.Utilities);
    document.getElementById('totalEntertainment').innerText = formatCurrency(totals.Entertainment);
    return totals;
  }

  // Safer table rendering (no inline onclick)
  function renderTable(rows) {
    tableBody.innerHTML = '';
    rows.forEach(r => {
      const [id, date, category, description = '-', amount] = r;
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${date}</td>
        <td><span class="badge ${category.toLowerCase()}">${category}</span></td>
        <td>${description}</td>
        <td>${formatCurrency(amount)}</td>
        <td>
          <button class="btn edit-btn">Edit</button>
          <button class="btn delete-btn">Delete</button>
        </td>
      `;

      tr.querySelector('.edit-btn').addEventListener('click', () => {
        editRow(id, date, category, description, amount);
      });
      tr.querySelector('.delete-btn').addEventListener('click', () => {
        deleteRow(id);
      });

      tableBody.appendChild(tr);
    });
  }

  function renderCharts(data) {
    const totals = { Food: 0, Transport: 0, Utilities: 0, Entertainment: 0 };
    data.forEach(e => { totals[e[2]] += Number(e[4]); });

    if (pieChart) pieChart.destroy();
    if (lineChart) lineChart.destroy();

    pieChart = new Chart(document.getElementById("pieChart"), {
      type: "pie",
      data: {
        labels: Object.keys(totals),
        datasets: [{
          data: Object.values(totals),
          backgroundColor: ["#ff7675", "#74b9ff", "#ffeaa7", "#a29bfe"]
        }]
      }
    });

    const sorted = [...data].sort((a, b) => new Date(a[1]) - new Date(b[1]));
    lineChart = new Chart(document.getElementById("lineChart"), {
      type: "line",
      data: {
        labels: sorted.map(e => e[1]),
        datasets: [{
          label: "Expenses",
          data: sorted.map(e => Number(e[4])),
          borderColor: "#00cec9",
          fill: false,
          tension: 0.3
        }]
      }
    });
  }

  // 🔥 Summaries
function renderSummaries(rows) {
  const summary = document.getElementById("summaryPanel");
  if (!summary) return;

  /* ===== PANEL STYLE (JS) ===== */
  Object.assign(summary.style, {
    background: "#2b2b42",
    borderRadius: "16px",
    padding: "24px",
    marginTop: "20px",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)"
  });

  summary.innerHTML = "<h3>Expense Summaries</h3>";

  /* ===== HEADING STYLE ===== */
  const h3 = summary.querySelector("h3");
  Object.assign(h3.style, {
    fontSize: "22px",
    fontWeight: "700",
    color: "#43cea2",
    borderBottom: "2px solid rgba(255,255,255,0.15)",
    paddingBottom: "6px"
  });

  const monthly = {};
  const weekly = {};

  rows.forEach(r => {
    const date = new Date(r[1]);
    const amt = parseFloat(r[4]) || 0;

    const mKey = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
    monthly[mKey] = (monthly[mKey] || 0) + amt;

    const wKey = `${date.getFullYear()}-W${Math.ceil(date.getDate()/7)}`;
    weekly[wKey] = (weekly[wKey] || 0) + amt;
  });

  /* ===== MONTHLY ===== */
  const mh = document.createElement("h4");
  mh.innerText = "Monthly";
  Object.assign(mh.style, {
    fontSize: "18px",
    color: "#36d1dc",
    marginTop: "6px"
  });

  const mul = document.createElement("ul");
  Object.assign(mul.style, {
    listStyleType: "none",
    padding: "0",
    display: "grid",
    gap: "10px"
  });

  Object.entries(monthly).forEach(([m,v]) => {
    const li = document.createElement("li");
    Object.assign(li.style, {
      background: "#2c2c3e",
      padding: "12px 16px",
      borderRadius: "12px",
      display: "flex",
      justifyContent: "space-between"
    });

    const span = document.createElement("span");
    span.innerText = m;
    span.style.color = "#ff7e5f";
    span.style.fontWeight = "700";

    li.append(span, document.createTextNode(` Rs ${v}`));
    mul.appendChild(li);
  });

  /* ===== WEEKLY ===== */
  const wh = mh.cloneNode(true);
  wh.innerText = "Weekly";

  const wul = mul.cloneNode(false);

  Object.entries(weekly).forEach(([w,v]) => {
    const li = document.createElement("li");
    Object.assign(li.style, {
      background: "#2c2c3e",
      padding: "12px 16px",
      borderRadius: "12px",
      display: "flex",
      justifyContent: "space-between"
    });

    const span = document.createElement("span");
    span.innerText = w;
    span.style.color = "#ff7e5f";
    span.style.fontWeight = "700";

    li.append(span, document.createTextNode(` Rs ${v}`));
    wul.appendChild(li);
  });

  summary.append(mh, mul, wh, wul);
}



  // Force fresh fetch (avoid cache)
  function loadData() {
    fetch('read.php?ts=' + Date.now())
      .then(res => res.json())
      .then(data => {
        console.log("Fresh data:", data);
        renderTable(data);
        renderCharts(data);
        updateCards(data);
        renderSummaries(data);
      })
      .catch(err => console.error('Failed to load data', err));
  }

  // Submit form -> save or edit
  expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    const editId = this.dataset.editId;
    let url = 'save.php';
    if (editId) {
      formData.append('id', editId);
      url = 'edit.php';
    }

    fetch(url, { method: 'POST', body: formData })
      .then(res => res.text())
      .then(txt => {
        if (txt.trim() === 'success' || txt.trim() === 'updated') {
          this.reset();
          delete this.dataset.editId;
          loadData();
        } else {
          alert('Operation failed: ' + txt);
        }
      })
      .catch(err => {
        console.error(err);
        alert('Save error');
      });
  });

  addExpenseBtnTop.addEventListener('click', () => {
    addExpenseFormPanel.scrollIntoView({ behavior: 'smooth' });
  });

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});

  window.deleteRow = function (id) {
    if (!confirm('Delete this expense?')) return;
    const fd = new FormData();
    fd.append('id', id);
    fetch('delete.php', { method: 'POST', body: fd })
      .then(res => res.text())
      .then(() => loadData())
      .catch(err => console.error(err));
  };

  window.editRow = function (id, date, category, description, amount) {
    document.getElementById('date').value = date;
    document.getElementById('category').value = category;
    document.getElementById('description').value = description;
    document.getElementById('amount').value = amount;

    expenseForm.dataset.editId = id;
    addExpenseFormPanel.scrollIntoView({ behavior: 'smooth' });
  };
  const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {
  item.addEventListener("click", () => {

    // active class remove
    navItems.forEach(i => i.classList.remove("active"));

    // active class add
    item.classList.add("active");

    const text = item.innerText.trim();

    if (text.includes("Home")) {
      showHome();
    } 
    else if (text.includes("Add")) {
      showAddExpense();
    } 
    else if (text.includes("Reports")) {
      showReports();
    } 
  });
});
function showHome() {
  document.querySelector(".cards").style.display = "grid";
  document.querySelector(".panels").style.display = "grid";
  document.querySelector(".table-panel").style.display = "block";
  document.getElementById("summaryPanel").style.display = "block";
  document.getElementById("addExpenseFormPanel").style.display = "none";
}

function showAddExpense() {
  document.querySelector(".cards").style.display = "none";
  document.querySelector(".panels").style.display = "none";
  document.querySelector(".table-panel").style.display = "none";
  document.getElementById("summaryPanel").style.display = "none";
  document.getElementById("addExpenseFormPanel").style.display = "block";
}

function showReports() {
  document.querySelector(".cards").style.display = "none";
  document.querySelector(".panels").style.display = "grid";
  document.querySelector(".table-panel").style.display = "block";
  document.getElementById("summaryPanel").style.display = "block";
  document.getElementById("addExpenseFormPanel").style.display = "none";
}




  document.getElementById('date').value = new Date().toISOString().slice(0, 10);
  loadData();
});
