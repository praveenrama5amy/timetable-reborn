import "../Login.css";

const Summary = () => {
    return (
        <div className="center">
            <div className="bgdiv" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <h1><i className="bi bi-check2"></i>&nbsp;No Conflicts Click Next</h1> <br />
                <button type="button" className="btn btn-success">Next</button>
            </div>
        </div>
    );
};

export default Summary;
