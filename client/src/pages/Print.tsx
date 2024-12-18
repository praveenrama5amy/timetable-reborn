import { useLocation, useNavigate } from "react-router"
import { ClassType, DepartmentInterface, SubjectType } from "../context/AppDataContext"
import { useCallback } from "react"

const Print = () => {
    const { state: department }: { state: DepartmentInterface } = useLocation()
    const navigate = useNavigate()
    if (department == null) {
        navigate("/timetable")
        return
    }
    const getSubject = useCallback((subId: SubjectType['id']) => {
        const subjectsHash: { [key: SubjectType['id']]: SubjectType } = {}
        for (const sub of department.subjects) {
            subjectsHash[sub.id] = sub
        }
        return subjectsHash[subId]
    }, [department.subjects])
    const getClass = useCallback((classId: ClassType['id']) => {
        const classHash: { [key: ClassType['id']]: ClassType } = {}
        for (const room of department.classes) {
            classHash[room.id] = room
        }
        return classHash[classId]
    }, [department.subjects])

    return (
        <div>
            <p className="text-4xl text-center font-semibold uppercase">Timetable</p>
            {department?.classes.map(room =>
                <table key={room.id} className="table w-75 m-auto my-10 caption-top" style={{ height: "115mm" }}>
                    <caption className="font-bold text-base text-center">{room.name}</caption>
                    <thead>
                        <tr>
                            <th>Day/Hour</th>
                            {[...Array(room.hoursPerDay).keys()].map(hour => <td key={hour}>{hour + 1}</td>)}
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {room.timetable.map((day, i) =>
                            <tr key={i + 1}>
                                <th>{`Day ${i + 1}`}</th>
                                {day.map((hour, j) =>
                                    <td key={`${i}${j}`}>
                                        {hour ? getSubject(hour).name : hour}
                                    </td>
                                )}
                            </tr>)}
                    </tbody>
                </table>
            )}
            {department?.faculties.map(faculty =>
                <table key={faculty.id} className="table w-75 m-auto my-10 caption-top" style={{ height: "115mm" }}>
                    <caption className="font-bold text-base text-center">Mr/Mrs. {faculty.name}</caption>
                    <thead>
                        <tr>
                            <th>Day/Hour</th>
                            {faculty.timetable[0].map((_, i) => <td key={i}>{i + 1}</td>)}
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {faculty.timetable.map((day, i) =>
                            <tr key={i + 1}>
                                <td>{`Day ${i + 1}`}</td>
                                {day.map((hour, j) => <td key={`${i}${j}`}><div className="flex justify-center items-center flex-col">
                                    {hour ? getClass(hour).name : hour}
                                    <p>{hour ? getClass(hour).timetable[i][j] ? getSubject(getClass(hour).timetable[i][j]!).name : null : hour}</p>
                                </div></td>)}
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div >
    )
}

export default Print