import { useState } from "react"
import { useNavigate } from "react-router"
import useAppData from "../hooks/useAppData"


const Nav = () => {
    const [profileSelected, setProfileSelected] = useAppData().profile
    const [departments] = useAppData().departments
    const { createDepartment, deleteDepartment } = useAppData()
    const navigate = useNavigate()
    const [page, setPage] = useState("home")
    const go = (link: string) => {
        navigate(link)
        setPage(link)
    }
    if (profileSelected == null || departments.find(e => e == profileSelected) == null) {
        setProfileSelected(departments[0])
    }

    const handle = {
        department: {
            add: async (name: string | null = "") => {
                while (name == "") {
                    name = prompt("Enter Department Name", "")
                }
                if (name == null) return;
                const res = await createDepartment(name)
                console.log(res);

                if (res.data.error) {
                    console.error(res.data.error)
                    alert(res.data.error.message)
                }
                if (res.data.status) setProfileSelected(name)
            },
            delete: async (name: string) => {
                if (confirm("Sure?")) {
                    const res = await deleteDepartment(name)
                    if (res.data.status && res.data.status.success) {
                        departments.length > 0 ? setProfileSelected(departments[0]) : handle.department.add("main")
                    }
                }
            }
        }
    }
    if (departments.length == 0) {
        handle.department.add("main")
    }
    return (
        <nav className="navbar bg-dark border-bottom border-body fixed w-100 z-20" data-bs-theme="dark">
            <div className="container-fluid">
                <div className="navbar-nav flex flex-row me-auto gap-3 w-100">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle navbar-brand" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {profileSelected}
                        </a>
                        <ul className="dropdown-menu absolute">
                            {departments.map(department => <li key={department} className="flex felx-row justify-center items-center">
                                <a className="dropdown-item" href="#" onClick={() => { setProfileSelected(department) }}>{department}</a>
                                <button className="p-2 text-red-500 opacity-70 hover:opacity-100" onClick={() => { handle.department.delete(department) }}><i className="bi bi-trash text-xl"></i></button>
                            </li>
                            )}
                            <hr className="divider" />
                            <li className="">
                                <a className="dropdown-item flex items-center justify-center" href="#" onClick={() => { handle.department.add() }}>Add <i className="bi bi-plus text-xl text-green-500"></i></a>
                            </li>
                        </ul>
                    </li>
                    {/* <a className={`nav-link ${page == "home" && "active"}`} href="#" onClick={() => { go("home") }}>Home</a> */}
                    <a className={`nav-link ${page == "subjects" && "active"}`} href="#" onClick={() => { go("subjects") }}>Subjects</a>
                    <a className={`nav-link ${page == "faculties" && "active"}`} href="#" onClick={() => { go("faculties") }}>Faculties</a>
                    <a className={`nav-link ${page == "classes" && "active"}`} href="#" onClick={() => { go("classes") }}>Classes</a>
                    <a className={`nav-link ${page == "timetable" && "active"}`} href="#" onClick={() => { go("timetable") }}>Timetable</a>
                </div>
            </div>
        </nav >
    )
}

export default Nav