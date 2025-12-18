const API_URL = "https://avisight-backend.onrender.com";

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
    resultDiv.innerHTML =
      "<p style='color:red;'>Student not found.</p>";
  }
});