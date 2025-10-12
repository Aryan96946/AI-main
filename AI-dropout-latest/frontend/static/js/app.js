let chartInstance = null;

function getAuthHeaders() {
  const token = localStorage.getItem('access');
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

document.getElementById('btn-predict').addEventListener('click', async () => {
  const attendance = document.getElementById('attendance').value;
  const gpa = document.getElementById('gpa').value;
  const assignments = document.getElementById('assignments').value;
  const engagement = document.getElementById('engagement').value;

  const payload = { attendance_percent: attendance, gpa: gpa, assignments_completed: assignments, engagement_score: engagement };

  const res = await fetch('/predict/student', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    alert(data.msg || 'Prediction failed. Please login.');
    return;
  }
  // populate table
  const tbody = document.querySelector('#prediction-table tbody');
  tbody.innerHTML = '';
  for (let i = 0; i < data.table.features.length; i++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${data.table.features[i]}</td><td>${data.table.values[i]}</td>`;
    tbody.appendChild(tr);
  }
  // draw chart
  const ctx = document.getElementById('riskChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.chart.labels,
      datasets: [{
        data: data.chart.data
      }]
    },
    options: {
      plugins: { legend: { position: 'bottom' } }
    }
  });
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('access'); localStorage.removeItem('user');
  window.location = '/login.html';
});

// redirect to login if not authenticated (for demo: allow to use predictive route with no auth too)
(async function checkAuth() {
  const token = localStorage.getItem('access');
  if (!token) {
    // allow public view but encourage login
    console.log("Public mode: Please login to enable full functionality.");
  }
})();
