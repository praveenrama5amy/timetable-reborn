import { useEffect, useState } from "react"
import useConflict from "../hooks/useConflict"
import { ConflictInterface } from "../context/AppDataContext"
import "../css/Timetable.css"

const Timetable = () => {
    const Conflict = useConflict()
    const [conflicts, setConflicts] = useState<ConflictInterface[]>([])
    useEffect(() => {
        Conflict.getConflict().then(res => {
            if (res.conflicts) {
                setConflicts(res.conflicts)
            }
        })
    }, [])
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
            <div className="border-2 border-black  rounded-lg m-10 flex flex-col">
                <div className="flex flex-row border-b-2 p-4 border-primary">
                    <p className="font-bold text-lg text-center flex-1">Day/Hour</p>
                    {/* <p className="font-bold text-lg text-center flex-1">Day/Hour</p> */}
                </div>
                <div className="flex flex-row border-b-2 p-4 border-primary">
                    <p className="font-bold text-lg text-center flex-1">Day 1</p>
                </div>
            </div>
            <table className="border-2 border-black">
                <thead>
                    <tr>
                        <th>Day/Hour</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Timetable