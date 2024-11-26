
import { useNavigate, Outlet } from "react-router"

const Nav = () => {
    const navigate = useNavigate()

    return (
        <div style={{ height: "100%" }}>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">MENU</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav" style={{ paddingLeft: "62%" }}>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={() => { navigate("/classes") }}><i className="bi bi-person-video3"></i>&nbsp;Classes</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={() => { navigate("/faculties") }}><i className="bi bi-people-fill"></i>&nbsp;Faculties</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={() => { navigate("/subjects") }}><i className="bi bi-book-half"></i>&nbsp;Subjects</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={() => { navigate("/summary") }}><i className="bi bi-body-text"></i>&nbsp;Summary</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={() => { navigate("/settings") }}><i className="bi bi-gear-wide-connected"></i>&nbsp;Settings</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div style={{ height: "100% " }}>
                <Outlet />
            </div>
        </div>
    )
}

export default Nav