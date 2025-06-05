import mongoose from "mongoose";

const AddTasskModel = new mongoose.Schema({
      UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // name of the model
    required: true
  },
      date : {type : String , required : true},
      Time : {type : String , required : true},
      Task : {type : String , required : true},
      isDone : {type : Boolean}
})

export const TaskModel = mongoose.model("shaduleTask" , AddTasskModel)