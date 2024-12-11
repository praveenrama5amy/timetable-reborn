import { useState } from "react"
import { useNavigate } from "react-router"
import useAppData from "../hooks/useAppData"


const Nav = () => {
    const [profileSelected, setProfileSelected] = useAppData().profile
    const [departments] = useAppData().departments
    const navigate = useNavigate()
    const [page, setPage] = useState("home")
    const go = (link: string) => {
        navigate(link)
        setPage(link)
    }
    if (profileSelected == null || departments.find(e => e == profileSelected) == null) {
        setProfileSelected(departments[0])
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
                            {departments.map(department => <li key={department}>
                                <a className="dropdown-item" href="#" onClick={() => { setProfileSelected(department) }}>{department}</a>
                            </li>
                            )}
                        </ul>
                    </li>
                    <a className={`nav-link ${page == "home" && "active"}`} href="#" onClick={() => { go("home") }}>Home</a>
                    <a className={`nav-link ${page == "classes" && "active"}`} href="#" onClick={() => { go("classes") }}>Classes</a>
                    <a className={`nav-link ${page == "faculties" && "active"}`} href="#" onClick={() => { go("faculties") }}>Faculties</a>
                    <a className={`nav-link ${page == "subjects" && "active"}`} href="#" onClick={() => { go("subjects") }}>Subjects</a>
                    <a className={`nav-link ${page == "timetable" && "active"}`} href="#" onClick={() => { go("timetable") }}>Timetable</a>
                </div>
            </div>
        </nav >
    )
}

export default Nav