import { useEffect, useState } from "react"
import { ClassType, FacultyType, SubjectType, useAppDataContext } from "../context/AppDataContext"
import useTimetable from "../hooks/useTimetable"
import useAppData from "../hooks/useAppData"

const Timetable = () => {
    const [department, setDepartment] = useAppDataContext().department
    const [conflicts] = useAppDataContext().conflicts
    const [profileSelected] = useAppDataContext().profile

    const Timetable = useTimetable()
    const { fetchDepatment } = useAppData()

    const [typeSelected, setTypeSelected] = useState<"class" | "faculty">("class")
    const [selected, setSelected] = useState<ClassType | FacultyType | undefined | null>(typeSelected == "class" ? department?.classes[0] : department?.faculties[0])
    const [error, setError] = useState<null | string>()

    const [checked, setChecked] = useState<Array<{ classId: ClassType['id'], day: number, hour: number }>>([])

    useEffect(() => {
        if (error != null) {
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    }, [error])

    if (conflicts.length > 0) return <div className="h-100">
        <p className="text-4xl text-center font-medium">Conflicts</p>
        <p className="mt-10 ml-5 text-lg font-medium text-red-500">There is some conflict in the given inputs. Correct the conflicts to proceed further</p>
        <p className="mt-10 text-right mr-5 text-lg font-medium text-red-500">Total Conflicts : {conflicts.length}</p>
        <div className="container">
            {conflicts.map((conflict, i) =>
                <div key={i} className="text-base font-medium border-2 p-8">
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
    const handle = {
        assign: async (classId: ClassType['id'], subjectId: SubjectType['id'], day: number, hour: number) => {
            const res = await Timetable.assign(classId, subjectId, day, hour)
            console.log(res);
            if (res.status && res.status.success) {
                fetchDepatment(profileSelected!)
            }
            if (res.error) {
                setError(res.error.message)
            }
        },
        unassign: async (classId: ClassType['id'], day: number, hour: number) => {
            const res = await Timetable.unassign(classId, day, hour)
            if (res.status && res.status.success) {
                fetchDepatment(profileSelected!)
            }
        },
        toggleCheck: (classId: ClassType['id'], day: number, hour: number) => {
            if (checked.find(e => e.classId == classId && e.day == day && e.hour == hour)) {
                setChecked(checked.filter(e => e.classId != classId || e.day != day || e.hour != hour))
            } else {
                setChecked([...checked, { classId, day, hour }])
            }
        },
        unassignAll: () => {
            checked.forEach(e => {
                handle.unassign(e.classId, e.day, e.hour)
            })
            handle.unCheckAll()
        },
        checkAll: () => {
            const checkedTemp = checked
            const selectedClass = department!.classes.find(e => e.id == selected!.id)

            for (let i = 0; i < selectedClass!.daysPerWeek; i++) {
                for (let j = 0; j < selectedClass!.hoursPerDay; j++) {
                    checked.push({ classId: selectedClass!.id, day: i, hour: j })
                }
            }
            setChecked(checkedTemp)
        },
        unCheckAll: () => {
            setChecked([])
        }
    }
    return (
        <div>
            <p className="text-xl font-medium">Type : </p>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {typeSelected}
                </button>
                <ul className="dropdown-menu">
                    <li onClick={() => { setTypeSelected("class") }}><button className="dropdown-item" type="button">Class</button></li>
                    {/* <li onClick={() => { setTypeSelected("faculty") }}><button className="dropdown-item" type="button">Faculty</button></li> */}
                </ul>
            </div>
            <p className="text-xl font-medium capitalize">{typeSelected} : </p>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {selected?.name || "Select"}
                </button>
                <ul className="dropdown-menu">
                    {department?.classes.map(room =>
                        <li key={room.id} onClick={() => { setSelected(room) }}><button className="dropdown-item" type="button">{room.name}</button></li>
                    )}
                </ul>
            </div>
            {checked.length > 0 ? <div>
                <button className="btn btn-dark m-5" onClick={() => {
                    handle.unCheckAll()
                }}>Uncheck All</button>
                <button className="btn btn-dark m-5" onClick={() => {
                    handle.unassignAll()
                }}>Unassign All</button>
            </div> : <button className="btn btn-dark m-5" onClick={() => {
                handle.checkAll()
            }}>Select All</button>}
            <p className="text-red-600 font-medium text-xl">{error}</p>
            {typeSelected && selected && <div>
                {
                    typeSelected == "class" ?
                        <div>
                            <p className="text-xl font-bold">{selected.name}</p>
                            <table className="table table-bordered">
                                <tbody>
                                    {department?.classes.find(e => e.id == selected.id)?.timetable.map((day, i) => <tr key={i}>
                                        {day.map((hour, j) =>
                                            <td key={j} className="relative">
                                                <input type="checkbox" className="absolute top-0 right-0" checked={checked.find(e => e.classId == selected.id && e.day == i && e.hour == j) ? true : false} onChange={e => { handle.toggleCheck(selected.id, i, j) }} />
                                                <div className="dropdown">
                                                    <button className={`btn  dropdown-toggle ${department.subjects.find(e => e.id == hour) == null ? 'btn-outline-secondary' : 'btn-secondary'}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        {department.subjects.find(e => e.id == hour)?.name || "Select"}
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        {department.classes.find(e => e.id == selected.id)?.subjects.map(sub =>
                                                            <li className="p-2" onClick={() => {
                                                                handle.assign(selected.id, sub.subject, i, j)
                                                            }} key={sub.subject}><a className="dropdown-item" href="#">
                                                                    {department.subjects.find(e => e.id == sub.subject)?.name}
                                                                </a></li>
                                                        )}
                                                        <li className="p-2" onClick={() => {
                                                            handle.unassign(selected.id, i, j)
                                                        }}><a className="dropdown-item text-red-600" href="#">Delete</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        )}
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                        :
                        <div>

                        </div>
                }
            </div>}
        </div >
    )
}

export default Timetable