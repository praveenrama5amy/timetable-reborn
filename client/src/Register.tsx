function Register() {

    function handleRegister() {

    }


    return <div className="container-sm" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column" }}>
        <div className="form-floating mb-3" style={{ minWidth: "300px" }}>
            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
            <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating mb-3" style={{ minWidth: "300px" }}>
            <input type="email" className="form-control" id="floatingInput" placeholder="name" />
            <label htmlFor="floatingInput">Name</label>
        </div>
        <div className="form-floating" style={{ minWidth: "300px" }}>
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
            <label htmlFor="floatingPassword">Password</label>
        </div>
        <div className="form-floating" style={{ minWidth: "300px", marginTop: "10px" }}>
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
            <label htmlFor="floatingPassword">Confirm Password</label>
        </div>
        <button type="button" className="btn btn-primary" style={{ marginTop: "10px" }} onClick={handleRegister}>Register</button>
        {/* <p style={{ marginTop: "10px" }}>Not a User? <a href="/register">Register</a></p> */}
    </div>
}

export default Register