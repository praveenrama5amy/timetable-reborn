import './login.css'
import { NavLink } from "react-router";

const login = () => {
  return (
    <div className="center">
      <div className="bgdiv">
        <h2>Login</h2><br />
        <form>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" autoComplete='username'></input>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" autoComplete='current-password'></input>
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1"></input>
            <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
          </div>
          <NavLink to="/App">
            <button type="submit" className="btn btn-primary">Login</button>
          </NavLink>

          <NavLink to="/Register">
            <button type="submit" className="btn btn-primary" style={{ marginLeft: "10px" }}>Register</button>
          </NavLink>
        </form>
      </div>
    </div>
  )
}

export default login