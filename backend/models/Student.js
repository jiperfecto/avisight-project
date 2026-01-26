import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  given_name: String,
  surname: String,
  simulator_hours: Number,
  absences: Number,
  target_hours_left: Number,
  instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' } // Linking by ID is safer for name changes
});

export default mongoose.model("Student", StudentSchema);