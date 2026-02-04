import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Student from "./models/Student.js";
import Instructor from "./models/Instructor.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => res.send("AviSight Backend is running"));

/* ================= AUTH ROUTES ================= */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    return res.json({ message: "Admin login successful" });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

/* ================= INSTRUCTOR ROUTES ================= */
// GET ALL
app.get("/instructors", async (req, res) => {
  const instructors = await Instructor.find().sort({ surname: 1 });
  res.json(instructors);
});

// ADD NEW
app.post("/instructors", async (req, res) => {
  const { given_name, surname, subject_code } = req.body;
  
  const exists = await Instructor.findOne({ 
    given_name: new RegExp(`^${given_name}$`, "i"),
    surname: new RegExp(`^${surname}$`, "i")
  });
  
  if (exists) return res.status(409).json({ message: "Instructor already exists!" });

  const newInst = await Instructor.create({ given_name, surname, subject_code });
  res.json(newInst);
});

// UPDATE
app.put("/instructors/:id", async (req, res) => {
  const { subject_code } = req.body;
  await Instructor.findByIdAndUpdate(req.params.id, { subject_code });
  res.json({ message: "Updated" });
});

// DELETE
app.delete("/instructors/:id", async (req, res) => {
  await Instructor.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// STATS
app.get("/instructors/:id/stats", async (req, res) => {
  try {
    const inst = await Instructor.findById(req.params.id);
    const students = await Student.find({ instructor_id: req.params.id });
    const total_no_shows = students.reduce((sum, stu) => sum + (stu.absences || 0), 0);
    
    res.json({ 
      instructor: `${inst.surname}, ${inst.given_name}`, 
      total_no_shows, 
      student_count: students.length 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

/* ================= STUDENT ROUTES ================= */
// GET ALL
app.get("/students", async (req, res) => {
  const students = await Student.find().populate("instructor_id");
  res.json(students);
});

// ADD NEW
app.post("/students", async (req, res) => {
  const { given_name, surname, simulator_hours, absences, instructor_id } = req.body;
  
  const exists = await Student.findOne({ 
    given_name: new RegExp(`^${given_name}$`, "i"),
    surname: new RegExp(`^${surname}$`, "i"),
    instructor_id: instructor_id
  });

  if (exists) return res.status(409).json({ message: "Student record already exists for this instructor!" });

  const target_hours_left = simulator_hours - absences;
  const newStudent = await Student.create({
    given_name, surname, simulator_hours, absences, target_hours_left, instructor_id
  });
  res.json(newStudent);
});

// UPDATE
app.put("/students/:id", async (req, res) => {
  const { simulator_hours, absences, instructor_id } = req.body;
  const target_hours_left = simulator_hours - absences;

  await Student.findByIdAndUpdate(req.params.id, {
    simulator_hours, absences, target_hours_left, instructor_id
  });
  res.json({ message: "Updated" });
});

// DELETE
app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// SEARCH (For Student Portal - Returns Array)
app.post("/students/search", async (req, res) => {
  const { given_name, surname } = req.body;
  
  const students = await Student.find({
    given_name: new RegExp(`^${given_name}$`, "i"),
    surname: new RegExp(`^${surname}$`, "i")
  }).populate("instructor_id");

  if (students.length === 0) return res.status(404).json({ message: "Not found" });
  
  res.json(students);
});

app.listen(PORT, () => console.log(`✅ AviSight running on port ${PORT}`));