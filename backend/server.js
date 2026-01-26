import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =======================
   MONGODB CONNECTION
======================= */
// Ensure you set MONGODB_URI in Render Dashboard
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Schema Inline for Simplicity
const StudentSchema = new mongoose.Schema({
  name: String,
  simulator_hours: Number,
  absences: Number,
  target_hours_left: Number,
});
const Student = mongoose.model("Student", StudentSchema);

/* =======================
   ROOT ROUTE (For Render)
======================= */
app.get("/", (req, res) => {
  res.send("AviSight Backend is running");
});

/* =======================
   ADMIN LOGIN
   Creds: admin1 / 1234567809
======================= */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin1" && password === "1234567809") {
    return res.json({ message: "Admin login successful" });
  }
  res.status(401).json({ message: "Invalid admin credentials" });
});

/* =======================
   STUDENT LOGIN
   Creds: avisight_student1 / 1234567809
======================= */
app.post("/student-login", (req, res) => {
  const { username, password } = req.body;
  if (username === "avisight_student1" && password === "1234567809") {
    return res.json({ message: "Student login successful" });
  }
  res.status(401).json({ message: "Invalid student credentials" });
});

/* =======================
   STUDENT DATA ROUTES
======================= */
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

// Search by name (Case Insensitive)
app.get("/students/:name", async (req, res) => {
  try {
    const student = await Student.findOne({
      name: new RegExp(`^${req.params.name}$`, "i"),
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error searching student" });
  }
});

// Add or Update Student
app.post("/students", async (req, res) => {
  const { name, simulator_hours, absences } = req.body;
  const target_hours_left = simulator_hours - absences;

  try {
    // upsert: true means "Create if doesn't exist, Update if it does"
    const updated = await Student.findOneAndUpdate(
      { name }, 
      { name, simulator_hours, absences, target_hours_left },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error saving student" });
  }
});

// Delete Student
app.delete("/students/:name", async (req, res) => {
  try {
    await Student.findOneAndDelete({ name: req.params.name });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ AviSight backend running on port ${PORT}`)
);