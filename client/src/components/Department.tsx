
const Department = ({ name }: { name: string }) => {
    return (
        <li className="list-group-item" style={{ width: "100%", display: "flex", flexDirection: "row" }}>{name}
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "auto" }}>
                <button className="btn btn-primary" style={{ marginLeft: "auto" }}><i className="bi bi-box-arrow-up-right"></i></button>
                <button className="btn btn-danger"><i className="bi bi-trash"></i></button>
            </div>
        </li>
    )
}

export default Department