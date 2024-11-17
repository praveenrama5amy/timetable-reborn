import { useState } from "react"
import Login from "./Login"
import Register from "./Register"

function App() {
  const [page, setPage] = useState("login")
  return <div className="h-100">
    <div>
      <button onClick={() => { setPage("login") }}>Login</button>
      <button onClick={() => { setPage("register") }}>Register</button>
    </div>
    {page == "login" && <Login />}
    {page == "register" && <Register />}
  </div>
}


export default App

