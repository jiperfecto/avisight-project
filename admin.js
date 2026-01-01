const API_URL = "https://avisight-backend.onrender.com";

/* ==========================
   AUTO CALCULATE TARGET HOURS
========================== */
function calculateTarget() {
  const sim = +document.getElementById("simHours").value || 0;
  const abs = +document.getElementById("absences").value || 0;
  document.getElementById("targetLeft").value = sim - abs;
}

document.getElementById("simHours").addEventListener("input", calculateTarget);
document.getElementById("absences").addEventListener("input", calculateTarget);

/* ==========================
   LOGIN
========================== */
document.getElementById("loginBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("loginMsg");

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    msg.textContent = "Login successful!";
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("adminSection").style.display = "block";
    loadAllStudents();
  } else {
    msg.textContent = "Invalid credentials.";
  }
});

/* ==========================
   SAVE STUDENT
========================== */
document.getElementById("addStudentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const sim = +document.getElementById("simHours").value;
  const abs = +document.getElementById("absences").value;

  const student = {
    name: document.getElementById("name").value.trim(),
    simulator_hours: sim,
    absences: abs,
    target_hours_left: sim - abs
  };

  await fetch(`${API_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });

  alert("Student saved!");
  loadAllStudents();
  e.target.reset();
  document.getElementById("targetLeft").value = "";
});

/* ==========================
   DELETE STUDENT
========================== */
async function deleteStudent(name) {
  if (!confirm(`Delete ${name}?`)) return;
  await fetch(`${API_URL}/students/${name}`, { method: "DELETE" });
  loadAllStudents();
}

/* ==========================
   LOAD STUDENTS
========================== */
async function loadAllStudents() {
  const res = await fetch(`${API_URL}/students`);
  const data = await res.json();
  const tbody = document.querySelector("#studentsTable tbody");

  tbody.innerHTML = "";

  data.forEach((s) => {
    tbody.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.simulator_hours}</td>
        <td>${s.absences}</td>
        <td>${s.target_hours_left}</td>
        <td>
          <button onclick="deleteStudent('${s.name}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

document.getElementById("refreshBtn")
  .addEventListener("click", loadAllStudents);