import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Outlet } from 'react-router-dom'
import NavBar from './component/NavBar'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
     <NavBar/>
     <Outlet/>

   </>
  )
}

export default App
