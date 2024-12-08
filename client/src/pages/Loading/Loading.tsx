import "./Loading.css"
const Loading = () => {
    return (
        <div className="card h-100 rounded-none flex items-center justify-center">
            <div className="loader">
                <p>loading</p>
                <div className="words">
                    <span className="word">Profiles</span>
                    <span className="word">Classes</span>
                    <span className="word">Subjects</span>
                    <span className="word">Faculties</span>
                    <span className="word">Timetables</span>
                </div>
            </div>
        </div>

    )
}

export default Loading