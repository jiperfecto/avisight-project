const API_URL="https://your-backend-url.onrender.com";
document.getElementById("loginBtn").addEventListener("click",async()=>{
 const u=document.getElementById("username").value.trim();
 const p=document.getElementById("password").value.trim();
 const msg=document.getElementById("loginMsg");
 const res=await fetch(`${API_URL}/login`,{
  method:"POST",headers:{"Content-Type":"application/json"},
  body:JSON.stringify({username:u,password:p})
 });
 if(res.ok){
  msg.textContent="Login successful!";
  document.getElementById("loginSection").style.display="none";
  document.getElementById("adminSection").style.display="block";
  loadAllStudents();
 } else msg.textContent="Invalid credentials.";
});
document.getElementById("addStudentForm").addEventListener("submit",async(e)=>{
 e.preventDefault();
 const student={
  name:document.getElementById("name").value.trim(),
  simulator_hours:+document.getElementById("simHours").value,
  absences:+document.getElementById("absences").value,
  target_hours_left:+document.getElementById("targetLeft").value
 };
 await fetch(`${API_URL}/students`,{
  method:"POST",headers:{"Content-Type":"application/json"},
  body:JSON.stringify(student)
 });
 alert("Student saved!");
 loadAllStudents(); e.target.reset();
});
async function deleteStudent(name){
 if(!confirm(`Delete ${name}?`))return;
 await fetch(`${API_URL}/students/${name}`,{method:"DELETE"});
 loadAllStudents();
}
async function loadAllStudents(){
 const res=await fetch(`${API_URL}/students`);
 const data=await res.json();
 const tbody=document.querySelector("#studentsTable tbody");
 tbody.innerHTML="";
 data.forEach(s=>{
  tbody.innerHTML+=`<tr>
   <td>${s.name}</td><td>${s.simulator_hours}</td>
   <td>${s.absences}</td><td>${s.target_hours_left}</td>
   <td><button onclick="deleteStudent('${s.name}')">Delete</button></td>
  </tr>`;
 });
}
document.getElementById("refreshBtn").addEventListener("click",loadAllStudents);
