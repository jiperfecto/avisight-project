import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: String,
  simulator_hours: Number,
  absences: Number, // "No Show Hours"
  target_hours_left: Number,
  instructor_name: String, // Linked Instructor
});

export default mongoose.model("Student", StudentSchema);