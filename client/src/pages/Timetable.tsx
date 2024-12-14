/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import useConflict from "../hooks/useConflict"
import { ClassType, ConflictInterface, SubjectType, useAppDataContext } from "../context/AppDataContext"
import "../css/Timetable.css"
import { useNavigate } from "react-router"

const Timetable = () => {
    const Conflict = useConflict()
    const [conflicts, setConflicts] = useState<ConflictInterface[]>([])
    const [department] = useAppDataContext().department
    const navigate = useNavigate()
    const [classSelected] = useState<ClassType['id'] | undefined | null>(department?.classes[0]?.id)
    useEffect(() => {
        Conflict.getConflict().then(res => {
            if (res.conflicts) {
                setConflicts(res.conflicts)
            }
        })
    }, [])
    const subjectsHash: { [key: SubjectType['id']]: SubjectType } = {}
    department?.subjects.forEach(sub => {
        subjectsHash[sub.id] = sub
    })
    console.log(subjectsHash);

    if (department == null) return;
    if (department.classes.length == 0) return navigate("/classes");
    const timetable = department.classes.find(e => e.id == classSelected)?.timetable
    if (timetable == null) return
    if (conflicts.length > 0) return <div className="h-100">
        <p className="text-4xl text-center font-medium">Conflicts</p>
        <p className="mt-10 ml-5 text-lg font-medium text-red-500">There is some conflict in the given inputs. Correct the conflicts to proceed further</p>
        <p className="mt-10 text-right mr-5 text-lg font-medium text-red-500">Total Conflicts : {conflicts.length}</p>
        <div className="container">
            {conflicts.map((conflict, i) =>
                <div key={i} className="text-base font-medium border-2 p-8 rounded-md">
                    {/* <p>{conflict.type}</p> */}
                    <p className="text-xl underline -ml-2">{conflict.error}</p>
                    <p>{conflict.maker.name} #{conflict.maker.id}</p>
                    <p className="text-red-600">{conflict.message}</p>
                    <p className="text-base font-medium text-green-500">Solutions :</p>
                    {conflict.solutions.map((solution, j) => <div key={j} className="ml-6">
                        <p className="text-base font-medium capitalize">{solution}</p>
                    </div>)}
                </div>
            )}
        </div>
    </div>
    return (
        <div>
            <p className="text-3xl font-medium text-center">Timetable</p>
            <div className="container text-center">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            {timetable[0].map((_, i) =>
                                <th scope="col" key={i}>{i + 1}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {timetable.map((day, i) =>
                            <tr key={i}>
                                <th scope="row">{i + 1}</th>
                                {day.map((hour, j) =>
                                    <td key={i + "" + j}>{hour ? subjectsHash[hour].name : hour}</td>
                                )}

                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Timetable