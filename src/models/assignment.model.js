import mongoose,{Schema} from "mongoose";


const assignmentSchema= new Schema({

    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    task:{
        type:String,
        required:true,
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    type:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    },
    


},{timestamps:true})

export const Assignment = mongoose.model("Assignment",assignmentSchema)


