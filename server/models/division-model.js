import mongoose from "mongoose";

const divisionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const DivisionModel = mongoose.model("Division", divisionSchema);

export default DivisionModel;