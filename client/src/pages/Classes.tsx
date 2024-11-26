import "./Classes.css";

const Classes = () => {
    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Subjects</h1>
            <br />
            <div className="container">
                <button type="button" className="btn btn-outline-light">
                    Add
                </button>
                <br />
                <br />
                <div className="container">
                    <h4></h4>
                </div>
            </div>
            {/* rightside div */}
            <div className="rightdiv" style={{ border: "1px solid black", float: "right" }}>
                <div className=".inside" >
                    <h5>Abirami</h5>
                    <p>Min : 20</p>
                    <p>Max : 30</p>
                    <p>Available : 18</p>
                    <p>Alloted : 15</p>
                </div>
                <div className=".inside">
                    <h5>Abirami</h5>
                    <p>Min : 20</p>
                    <p>Max : 30</p>
                    <p>Available : 18</p>
                    <p>Alloted : 15</p>
                </div><div className=".inside">
                    <h5>Abirami</h5>
                    <p>Min : 20</p>
                    <p>Max : 30</p>
                    <p>Available : 18</p>
                    <p>Alloted : 15</p>
                </div>
            </div>
        </div>
    );
};

export default Classes;
