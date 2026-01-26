import mongoose from "mongoose";

const InstructorSchema = new mongoose.Schema({
  name: String,
  subject_code: String,
});

export default mongoose.model("Instructor", InstructorSchema);