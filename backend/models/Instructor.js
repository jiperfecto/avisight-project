import mongoose from "mongoose";

const InstructorSchema = new mongoose.Schema({
  given_name: String,
  surname: String,
  subject_code: String,
});

export default mongoose.model("Instructor", InstructorSchema);