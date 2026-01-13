const API_URL = "https://avisight-backend.onrender.com";

document.getElementById("studentLoginBtn").addEventListener("click", async () => {
  const username = document.getElementById("studentUsername").value.trim();
  const password = document.getElementById("studentPassword").value.trim();
  const msg = document.getElementById("studentLoginMsg");

  const res = await fetch(`${API_URL}/student-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    msg.textContent = "Login successful";
    document.getElementById("studentLogin").style.display = "none";
    document.getElementById("studentSection").style.display = "block";
  } else {
    msg.textContent = "Invalid credentials";
  }
});

document.getElementById("searchBtn").addEventListener("click", async () => {
  const name = document.getElementById("searchName").value.trim();
  const resultDiv = document.getElementById("result");

  if (!name) {
    resultDiv.innerHTML = "<p>Please enter a name.</p>";
    return;
  }

  const res = await fetch(`${API_URL}/students/${name}`);
  if (res.ok) {
    const s = await res.json();
    resultDiv.innerHTML = `
      <p><b>Name:</b> ${s.name}</p>
      <p><b>Simulator Hours:</b> ${s.simulator_hours}</p>
      <p><b>Absences:</b> ${s.absences}</p>
      <p><b>Target Hours Left:</b> ${s.target_hours_left}</p>
    `;
  } else {
    resultDiv.innerHTML = "<p style='color:red;'>Student not found.</p>";
  }
});