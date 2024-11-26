const Subjects = () => {
    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Subjects</h1>
            <br />
            <div className="container">
                <button type="button" className="btn btn-outline-light">
                    Add
                </button><br /><br />
                <h4>Wad
                    <button type="button" className="btn btn-danger" style={{ float: "right", marginRight: "2px" }}>
                        <i className="bi bi-trash"></i></button>
                    <button type="button" className="btn btn-primary" style={{ float: "right", marginRight: "2px" }}>
                        <i className="bi bi-pencil"></i></button>
                    <button type="button" className="btn btn-primary" style={{ float: "right", marginRight: "2px" }}>
                        <i className="bi bi-eye"></i></button>

                </h4>
                <hr />
            </div>
        </div >
    );
};

export default Subjects;
