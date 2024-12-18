/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import useConflict from "../hooks/useConflict"
import { ClassType, ConflictInterface, FacultyType, SubjectType, useAppDataContext } from "../context/AppDataContext"
import "../css/Timetable.css"
import { useNavigate } from "react-router"
import useTimetable from "../hooks/useTimetable"
import useAppData from "../hooks/useAppData"
import FullBar from "../components/FullBar"
import LoadBar from "../components/LoadBar"


let errorTimeout = setTimeout(() => { })

const Timetable = () => {
    const Conflict = useConflict()
    const [conflicts, setConflicts] = useState<ConflictInterface[]>([])
    const [department] = useAppDataContext().department
    const navigate = useNavigate()
    const [classSelected, setClassSelected] = useState<ClassType['id'] | undefined | null>(department?.classes[0]?.id)
    const Timetable = useTimetable()
    const { fetchDepatment, profile: [profileSelected] } = useAppData()
    const [error, setError] = useState<null | string>(null)
    const [selectMode, setSelectMode] = useState(false)
    const [selected, setSelected] = useState<{ classId: ClassType['id'], day: number, hour: number }[]>([])

    useEffect(() => {
        Conflict.getConflict().then(res => {
            if (res.conflicts) {
                setConflicts(res.conflicts)
            }
        })
    }, [])
    useEffect(() => {
        clearTimeout(errorTimeout)
        errorTimeout = setTimeout(() => {
            setError(null)
        }, 5000)
    }, [error])
    const subjectsHash: { [key: SubjectType['id']]: SubjectType } = {}
    department?.subjects.forEach(sub => {
        subjectsHash[sub.id] = sub
    })
    const facultyHash: { [key: FacultyType['id']]: FacultyType } = {}
    department?.faculties.forEach(faculty => {
        facultyHash[faculty.id] = faculty
    })

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
        unassignAll: () => {
            selected.forEach(e => {
                handle.unassign(e.classId, e.day, e.hour)
            })
            handle.unSelectAll()
        },
        select: (classId: ClassType['id'], day: number, hour: number) => {
            if (selected.find(e => e.classId == classId && e.day == day && e.hour == hour)) {
                setSelected(prev => prev.filter(e => !(e.classId == classId && e.day == day && e.hour == hour)))
            } else {
                setSelected(prev => [...prev, { classId, day, hour }])
            }
        },
        selectAll: () => {
            const checkedTemp = selected
            if (room == null) return
            for (let i = 0; i < room.daysPerWeek; i++) {
                for (let j = 0; j < room.hoursPerDay; j++) {
                    selected.push({ classId: room.id, day: i, hour: j })
                }
            }
            setSelected([...checkedTemp])
        },
        unSelectAll: () => {
            setSelected([])
        },
        selectAllUnAssigned: () => {
            const checkedTemp = selected
            if (room == null) return
            for (let i = 0; i < room.daysPerWeek; i++) {
                for (let j = 0; j < room.hoursPerDay; j++) {
                    if (room.timetable[i][j] == null)
                        selected.push({ classId: room.id, day: i, hour: j })
                }
            }
            setSelected([...checkedTemp])
        },
        autoGenerate: async () => {
            const res = await Timetable.autoGenerate(selected);
            if (res.data.status) {
                fetchDepatment(profileSelected!)
                handle.unSelectAll()
            }
            if (res.data.error) {
                setError(res.data.error)
            }
        },
        printBtnPress: () => {
            navigate("/print", { state: department })
        }
    }

    if (department == null) return;
    if (department.classes.length == 0) {
        navigate("/classes");
        return
    };



    const room = department.classes.find(e => e.id == classSelected)
    const roomFacultiesAssigned = room?.subjects.map(e => e.faculties).flat()
    const roomSubjectsAssigned = room?.subjects.map(e => e.subject).flat()
    const roomFaculty = department.faculties.filter(e => roomFacultiesAssigned?.includes(e.id))
    const roomSubjects = department.subjects.filter(e => roomSubjectsAssigned?.includes(e.id))
    const timetable = room?.timetable

    if (timetable == null) return
    const getAlloted = useCallback((subId: number) => {
        return timetable.flat().filter(e => e == subId).length
    }, [department, classSelected])
    useEffect(() => {
        if (selectMode == false) handle.unSelectAll()
    }, [selectMode])

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
        <div className="h-100">
            <p className="text-3xl font-medium text-center">Timetable</p>
            {/* Print Button */}
            <button className="w-[70px] btn btn-dark block ml-auto mr-10" onClick={handle.printBtnPress}>Print</button>
            {/* Options Container */}
            <div className="flex justify-center items-center">
                <button className={`btn rounded-3xl ml-10 ${selectMode ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => { setSelectMode(!selectMode) }}>Select</button>
                {selectMode &&
                    <>
                        <button className={`btn rounded-3xl mx-3 btn-dark`} onClick={() => { handle.selectAll() }}>Select All</button>
                        <button className={`btn rounded-3xl mx-3 btn-dark`} onClick={() => { handle.selectAllUnAssigned() }}>Select All Unassigned</button>
                    </>
                }
                {selected.length > 0 &&
                    <>
                        <button className={`btn rounded-3xl mx-3 btn-dark`} onClick={() => { handle.unSelectAll() }}>Unselect All</button>
                        <button className={`btn rounded-3xl mx-3 btn-dark`} onClick={() => { handle.unassignAll() }}>Unassign All</button>
                        <button className={`btn rounded-3xl mx-3 btn-dark`} onClick={() => { handle.autoGenerate() }}>AutoGenerate</button>
                    </>
                }
                <div className="p-10 max-w-[350px] ml-auto">
                    <select className="form-select " aria-label="Default select example" value={classSelected ? classSelected : ""} onChange={(e) => { setClassSelected(Number(e.currentTarget.value)) }}>
                        {department.classes.map(room =>
                            <option value={room.id} key={room.id}>{room.name}</option>
                        )}
                        {/* {department.faculties.map(faculty =>
                        <option value={faculty.id} key={faculty.id}>{faculty.name}</option>
                    )} */}
                    </select>
                </div>
            </div>

            {/* Containter */}
            <div className="text-center flex h-75 ">
                <div className="border-2 flex-1 p-4 overflow-y-scroll no-scroll">
                    {/* Subject Details */}
                    <p className="text-2xl font-medium mb-10">Subjects</p>
                    {room?.subjects.sort((a, b) => {
                        return (subjectsHash[b.subject].hoursPerWeek - getAlloted(b.subject)) - (subjectsHash[a.subject].hoursPerWeek - getAlloted(a.subject))
                    }).map(sub =>
                        <div key={sub.subject} className="border-b-[1px] p-2 border-black">
                            <p className="font-medium">{subjectsHash[sub.subject].name}</p>
                            <div className="flex justify-center items-center gap-1">
                                <p>{getAlloted(sub.subject)}</p>
                                <FullBar full={subjectsHash[sub.subject].hoursPerWeek} state={getAlloted(sub.subject)} />
                                <p>{subjectsHash[sub.subject].hoursPerWeek}</p>
                            </div>
                            <div>
                                {sub.faculties.map(facultyId =>
                                    <div key={facultyId}>
                                        {facultyHash[facultyId].name}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {/* Table  */}
                <table className="table" style={{ flex: 4 }}>
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
                                    <td key={i + "" + j}>
                                        <div className="w-100 h-100 flex justify-center items-center">
                                            {selectMode && <input type="checkbox" className="position-absolute top-0 right-0" style={{ width: 15, aspectRatio: 1 / 1, cursor: "pointer" }} checked={selected.find(e => e.classId == room?.id && e.day == i && e.hour == j) != null} onChange={() => { handle.select(room!.id, i, j) }} />}
                                            {hour ? subjectsHash[hour].name : hour}
                                            {hour ?
                                                <button title="Unassign?" onClick={() => { classSelected && handle.unassign(classSelected, i, j) }}><i className="bi bi-x cursor-pointer text-red-600 text-3xl font-extrabold"></i></button>
                                                :
                                                <div className="dropdown">
                                                    <button className="" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" title="Unassign?" onClick={() => { classSelected && handle.unassign(classSelected, i, j) }}>
                                                        <i className="bi bi-plus cursor-pointer text-blue-700 text-3xl font-extrabold"></i>
                                                    </button>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                        {roomSubjects.sort((a, b) => {
                                                            return (subjectsHash[b.id].hoursPerWeek - getAlloted(b.id)) - (subjectsHash[a.id].hoursPerWeek - getAlloted(a.id))
                                                        }).map(subject =>
                                                            <li key={subject.id}><div className="dropdown-item cursor-pointer" onClick={() => { classSelected && handle.assign(classSelected, subject.id, i, j) }}>{subject.name}</div></li>
                                                        )}
                                                    </ul>
                                                </div>
                                            }
                                        </div>
                                    </td>
                                )}

                            </tr>
                        )}
                    </tbody>
                </table>
                {/* Faculty Details */}
                <div className="border-2 flex-1 p-4 overflow-y-scroll">
                    <p className="text-2xl font-medium mb-10">Faculties</p>
                    {roomFaculty.sort((a, b) => {
                        return a.timetable.flat().filter(hour => hour != null).length - b.timetable.flat().filter(hour => hour != null).length

                    }).map(faculty =>
                        <div key={faculty.id} className="border-b-[1px] p-2 border-black">
                            <p className="font-medium">Mr/Mrs. {faculty.name}</p>
                            <div className="flex justify-center items-center gap-2">
                                <p>{faculty.min}</p>
                                <LoadBar min={faculty.min} max={faculty.max} value={faculty.timetable.flat().filter(e => e != null).length} />
                                <p>{faculty.max}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Error display */}
            {error && <div className="alert alert-danger fade show" role="alert">
                {error}
            </div>}
        </div>
    )
}

export default Timetable