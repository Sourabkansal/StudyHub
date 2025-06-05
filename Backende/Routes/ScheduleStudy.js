import express from "express"
import {GetTasktime} from "../Controller/ScheduleStController/GetTasktime.js"
import { Readtask } from "../Controller/ScheduleStController/GetTasktime.js"
import { DeteTask } from "../Controller/ScheduleStController/GetTasktime.js"
import { isDone } from "../Controller/ScheduleStController/GetTasktime.js"

const ScheduleStudy = express.Router()
ScheduleStudy.post("/GetTasktime",GetTasktime)
ScheduleStudy.post("/ReadTask" , Readtask)
ScheduleStudy.delete("/deleteTask/:id", DeteTask)
ScheduleStudy.get("/isDone/:id" , isDone)
export default ScheduleStudy  