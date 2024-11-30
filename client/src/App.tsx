import Department from "./components/Department"
import Axios from "../src/api/axios"
import { useEffect, useState } from "react"

function App() {
  const [depts, setDepts] = useState<Array<string>>([])

  const handle = {
    addDept: () => {
      var name = prompt("Enter the Name")
      if (name == "") {
        return
      }
      Axios.post("/department/create", { name: name })
      fetchDepts()
    }
  }
  const fetchDepts = () => {
    Axios.get("/department/all").then(data =>
      setDepts(data.data.departments)
    )
  }

  useEffect(() => {
    fetchDepts()
  }, [])
  return (
    <div className="height:100%" style={{ height: "100%", backgroundColor: "#fffddd" }}>
      <h1 style={{ textAlign: "center" }}>Departments</h1>
      <ul className="list-group list-group-flush">
        {depts.map(dept => <Department name={dept} key={dept} />)}
        <li className="list-group-item" style={{ width: "100%", display: "flex", flexDirection: "row" }}>
          <button onClick={handle.addDept} className="btn btn-primary" style={{ marginLeft: "auto", marginRight: "auto" }}><i className="bi bi-plus"></i></button>
        </li>
      </ul>
    </div>
  )
}

export default App
