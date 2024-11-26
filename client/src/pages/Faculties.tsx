
const Faculties = () => {
    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Faculties</h1>
            <br />
            <div className="container">

                <button type="button" className="btn btn-outline-light">
                    Add
                </button><br /><br />
                <div style={{ float: "right" }}>
                    <button type="button" className="btn btn-danger" style={{ float: "right" }}>
                        <i className="bi bi-trash"></i></button> <br /> <br />
                    <button type="button" className="btn btn-primary" style={{ float: "right" }}>
                        <i className="bi bi-pencil"></i></button>
                </div>
                <h4>Mam
                </h4>
                <p>subject:
                </p>
                <p>inga graph varum ne edit panniko
                </p>
                <hr />
            </div>
        </div >
    )
}

export default Faculties