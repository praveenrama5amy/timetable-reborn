
const Settings
    = () => {
        return (
            <div className="center">
                <div className="bgdiv" style={{ display: "flex", alignItems: "left", justifyContent: "center", flexDirection: "column" }}>
                    <h5> <i className="bi bi-exclamation-diamond-fill"></i>&nbsp;Changing any of these settings clear all timetable</h5>
                    <br />
                    <div className="mb-3">
                        <label htmlFor="week" className="form-label">Days per Week :</label>
                        <input type="number" className="form-control" id="week" aria-describedby="week"></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="days" className="form-label">Hours per Day :</label>
                        <input type="number" className="form-control" id="days" aria-describedby="days"></input>
                    </div>

                    <button type="button" className="btn btn-success" style={{ width: "60px" }}>Save</button>
                </div>
            </div>


        )
    }

export default Settings
