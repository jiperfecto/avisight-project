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

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin1" && password === "1234567809") {
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/students", (req, res) => {
  res.json(loadStudents());
});

app.get("/students/:name", (req, res) => {
  const students = loadStudents();
  const s = students.find(stu => stu.name.toLowerCase() === req.params.name.toLowerCase());
  if (!s) return res.status(404).json({ message: "Student not found" });
  res.json(s);
});

app.post("/students", (req, res) => {
  const students = loadStudents();
  const idx = students.findIndex(stu => stu.name.toLowerCase() === req.body.name.toLowerCase());
  if (idx >= 0) students[idx] = req.body;
  else students.push(req.body);
  saveStudents(students);
  res.json({ message: "Student saved successfully" });
});

app.delete("/students/:name", (req, res) => {
  let students = loadStudents();
  students = students.filter(stu => stu.name.toLowerCase() !== req.params.name.toLowerCase());
  saveStudents(students);
  res.json({ message: "Student deleted successfully" });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
