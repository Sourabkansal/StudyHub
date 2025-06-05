import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Outlet } from 'react-router-dom'
import NavBar from './component/NavBar'
import { Provider } from 'react-redux'
import { store } from './Store/store'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <Provider store={store} >
     <NavBar/>
     <Outlet/>
   </Provider>

   </>
  )
}

export default App
