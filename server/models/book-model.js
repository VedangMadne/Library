import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    ISBN : {
        type : String,
        required : true,
        unique : true
    },
    title : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
    },
    category:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
    },
    almirah:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Almirah',
        required : true
    },
    shelf : {
        type : String,
        required : false
    },
    imagePath : {
        type : String,
        required : false
    },
    status : {
        type : String,
        enum : ["Available","Issued"],
        default : "Available"
    },
    publisher : String,
    description : String,
    edition : String,
    
},{timestamps:true});

const BookModel = mongoose.model("Book",bookSchema);

export default BookModel;