<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Existing CSS & JS -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link rel="stylesheet" href="style.css" />
  <link rel="icon" type="image/png" href="Copilot_20260104_134130.png"/>
</head>

<body>

  <div class="sidebar">
    <div class="brand">
      <div class="brand-logo">
        <h3>ET</h3>
      </div>
      <h1>Expense Tracker</h1>  
    </div>
    <nav class="nav">
      
      <div class="nav-item active"><span class="icon">🏠</span><span>Home</span></div>
      <div class="nav-item"><span class="icon">➕</span><span>Add expense</span></div>
      <div class="nav-item"><span class="icon">📊</span><span>Reports</span></div>
    </nav>
  </div>
  
  <main class="main">
    <!-- Header -->
    <section class="header">
      <h2>Personal Expense Tracker</h2>
      <div class="controls">
        <button class="btn" id="toggleThemeBtn">Toggle theme</button>
        <button class="btn primary nav-item" id="addExpenseBtnTop">Add expense</button>
      </div>
    </section>
    
    <!-- Category cards -->
    <section class="cards">
      <div class="card food"><div class="label">🍔 Food</div><div class="value" id="totalFood">Rs 0</div></div>
      <div class="card transport"><div class="label">🚗 Transport</div><div class="value" id="totalTransport">Rs 0</div></div>
      <div class="card utilities"><div class="label">💡 Utilities</div><div class="value" id="totalUtilities">Rs 0</div></div>
      <div class="card entertainment"><div class="label">🎬 Entertainment</div><div class="value" id="totalEntertainment">Rs 0</div></div>
    </section>
    
    <!-- Charts -->
    <section class="panels">
      <div class="panel"><h3>Spending by category</h3><div class="chart-wrap"><canvas id="pieChart"></canvas></div></div>
      <div class="panel"><h3>Weekly trend</h3><div class="chart-wrap"><canvas id="lineChart"></canvas></div></div>
    </section>
    
    
    <!-- Add Expense Form -->
    <section class="form-panel" id="addExpenseFormPanel">
      <h3>Add New Expense</h3>
      <form id="expenseForm" class="form-grid">
        <div class="field"><label>Category</label>
        <select name="category" id="category" required>
          <option>Food</option><option>Transport</option><option>Utilities</option><option>Entertainment</option>
        </select>
      </div>
      <div class="field"><label>Date</label><input type="date" name="date" id="date" required></div>
      <div class="field"><label>Amount</label><input type="number" name="amount" id="amount" required placeholder="Amount"></div>
      <div class="field"><label>Description</label><input type="text" name="description" id="description" placeholder="e.g., Grocery shopping" required></div>
      <div class="form-actions"><button type="submit" class="btn primary">Save</button></div>
    </form>
  </section>

    <!-- Expenses Table -->
    <section class="table-panel">
      <h3>Expense List</h3>
      <table class="table">
        <thead>
          <tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th>Action</th></tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    </section>
<section 
  class="panel" 
  id="summaryPanel" 
>
</section>

  </main>
  <script src="Project.js" ></script>

  
</body>
</html>
