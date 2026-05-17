import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    class: { type: String, required: true, unique: true },
})

const ClassModel = mongoose.model("Class", classSchema);

export default ClassModel;