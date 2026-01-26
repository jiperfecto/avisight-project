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

/* ===== AUTH ROUTES ===== */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    return res.json({ message: "Admin login successful" });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

app.post("/student-login", (req, res) => {
  const { username, password } = req.body;
  if (username === "avisight_student1" && password === "1234567809") {
    return res.json({ message: "Student login successful" });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

/* ===== INSTRUCTOR ROUTES ===== */
// 1. Add Instructor
app.post("/instructors", async (req, res) => {
  try {
    const { name, subject_code } = req.body;
    // Update if exists, Create if new
    const newInstructor = await Instructor.findOneAndUpdate(
      { name }, 
      { name, subject_code },
      { upsert: true, new: true }
    );
    res.json(newInstructor);
  } catch (err) {
    res.status(500).json({ message: "Error saving instructor" });
  }
});

// 2. Get All Instructors (For Dropdowns)
app.get("/instructors", async (req, res) => {
  const instructors = await Instructor.find();
  res.json(instructors);
});

// 3. Get Instructor Stats (Total No-Shows)
app.get("/instructors/:name/stats", async (req, res) => {
  try {
    const students = await Student.find({ instructor_name: req.params.name });
    // Sum all student absences
    const total_no_shows = students.reduce((sum, stu) => sum + (stu.absences || 0), 0);
    
    res.json({ 
      instructor: req.params.name, 
      total_no_shows, 
      student_count: students.length 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

/* ===== STUDENT ROUTES ===== */
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.get("/students/:name", async (req, res) => {
  const student = await Student.findOne({
    name: new RegExp(`^${req.params.name}$`, "i"),
  });
  if (!student) return res.status(404).json({ message: "Not found" });
  res.json(student);
});

app.post("/students", async (req, res) => {
  const { name, simulator_hours, absences, instructor_name } = req.body;
  const target_hours_left = simulator_hours - absences;

  const updated = await Student.findOneAndUpdate(
    { name },
    { name, simulator_hours, absences, target_hours_left, instructor_name },
    { upsert: true, new: true }
  );
  res.json(updated);
});

app.delete("/students/:name", async (req, res) => {
  await Student.findOneAndDelete({ name: req.params.name });
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => console.log(`✅ AviSight running on port ${PORT}`));