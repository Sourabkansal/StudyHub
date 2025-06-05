import express from "express";
import { TaskModel } from "../../DbModels/ScheduleStudy/AddTaskModel.js";

export const GetTasktime = async (req, res) => {
    
  try { 
    let id = req.user.id 
    const { Task, date, Time } = req.body;
    let task =  new TaskModel({ UserId : id, Task, date, Time , isDone:false } );
     task.save();  
    res.status(200).json({ message: "added sucess " });

  } catch(error) {
    res.status(409).json({ message: " not addedddddd" });
  }
};

export const Readtask = async (req ,res )=>{
     try{ 
        let task = await TaskModel.find({UserId : req.user.id})
        res.status(200).json({ taskData : task ,message : "got "})
     }catch(error){


     }
}

export const DeteTask = async (req , res )=>{
           try{
               const id = req.params.id;
               const deleted = await TaskModel.findByIdAndDelete(id) 

               if(!deleted){
                   res.status(404).json({message : "  not found " })
               }
               res.status(200).json({message:"sucessfull deleted"})
           }
           catch(error){
             res.status(500).json({ error: "Failed to delete todo" });
             
           }
}

export const isDone = async (req , res )=>{
       try {
             const id = req.params.id;
             const getTask = await TaskModel.findOne({ _id: id })
             getTask.isDone = !getTask.isDone
             getTask.save()
             if(!getTask){
                res.status(404).json({message : " Not found "})
             }
                res.status(200).json({message : " Done  "})

       }
       catch(error){
             res.status(500).json({ error: "Failed to Done task " });
          
       }
}