import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Signup from './component/signup.jsx'
import Login from './component/login.jsx'

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";

let routerr = createBrowserRouter(
  createRoutesFromElements(
      <Route>
            <Route 
             path='/'
             element={<App/>}
             />
              <Route 
             path='/Signup'
             element={<Signup/>}
             />
              <Route 
             path='/login'
             element={<Login/>}
             />


      </Route>
  )
)


createRoot(document.getElementById('root')).render(

   <RouterProvider router={routerr} />
)
