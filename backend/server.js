import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "./students.json";

app.use(cors());
app.use(express.json());

function loadStudents() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveStudents(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
}

/* ==========================
   LOGIN
========================== */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin1" && password === "1234567809") {
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

/* ==========================
   STUDENTS
========================== */
app.get("/students", (req, res) => {
  res.json(loadStudents());
});

app.get("/students/:name", (req, res) => {
  const students = loadStudents();
  const student = students.find(
    s => s.name.toLowerCase() === req.params.name.toLowerCase()
  );
  if (!student) return res.status(404).json({ message: "Not found" });
  res.json(student);
});

app.post("/students", (req, res) => {
  const { name, simulator_hours, absences } = req.body;

  const studentData = {
    name,
    simulator_hours,
    absences,
    target_hours_left: simulator_hours - absences
  };

  const students = loadStudents();
  const index = students.findIndex(
    s => s.name.toLowerCase() === name.toLowerCase()
  );

  if (index >= 0) students[index] = studentData;
  else students.push(studentData);

  saveStudents(students);
  res.json({ message: "Student saved successfully" });
});

app.delete("/students/:name", (req, res) => {
  let students = loadStudents();
  students = students.filter(
    s => s.name.toLowerCase() !== req.params.name.toLowerCase()
  );
  saveStudents(students);
  res.json({ message: "Student deleted" });
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);