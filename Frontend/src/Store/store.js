import { configureStore } from '@reduxjs/toolkit'
import  TaskSlice  from '../Slice/TaskSlice'

export const store = configureStore({
  reducer: {
    taskToDo : TaskSlice,
  },
})