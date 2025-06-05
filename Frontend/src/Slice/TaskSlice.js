import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
}

export const TaskSlice =  createSlice({
     name : 'taskToDo',
     initialState,
     reducers:{
        GettaskToDo : (state, action) => {
      state.value = action.payload;
    },  
      Deletetasak: (state , action)=>{
          let id = action.payload
       state.value =  state.value.filter((item)=>{
                return  item._id !==  id ;
          })
     },
     isDonee : (state , action)=>{
            let id = action.payload 
            state.value = state.value.map((item)=>{
              console.log(item)
                   return item._id==id ? {...item , isDone : !item.isDone } : item
            })
     }
     }
})

export const { GettaskToDo , Deletetasak , isDonee } = TaskSlice.actions

export default TaskSlice.reducer