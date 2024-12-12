import { ClassType, FacultyType, SubjectType, useAppDataContext } from "../context/AppDataContext"
import useAppData from "../hooks/useAppData"
import { useRef, useState } from "react"
import useClass from "../hooks/useClass"

const Classes = () => {
    const [department, setDepartment] = useAppData().department

    const [editId, setEditId] = useState<null | number>(null)

    const Class = useClass()

    const nameRef = useRef<HTMLInputElement>(null)
    const hoursPerDayRef = useRef<HTMLInputElement>(null)
    const daysPerWeekRef = useRef<HTMLInputElement>(null)
    const errorRef = useRef<HTMLInputElement>(null)

    const handle = {
        add: async () => {
            const data = {
                name: nameRef.current!.value,
                daysPerWeek: parseInt(daysPerWeekRef.current!.value),
                hoursPerDay: parseInt(hoursPerDayRef.current!.value),
            }
            if (data.name.trim() == "" || data.daysPerWeek == null || data.hoursPerDay == null) {
                errorRef.current!.innerText = "Fill all field"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.daysPerWeek)) {
                errorRef.current!.innerText = "days per week must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.hoursPerDay)) {
                errorRef.current!.innerText = "hours per day must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            errorRef.current!.innerHTML = ""
            try {
                const res = await Class.add(data)
                if (res.error) {
                    errorRef.current!.innerHTML = res.error.message
                }
                if (res.status && res.status.success) {
                    setDepartment(prev => {
                        return prev != null ? { ...prev, classes: [...prev.classes, res.status.class] } : null
                    })
                    dismissModal()
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        remove: async (id: ClassType['id']) => {
            if (confirm("Are you sure?") == false) return
            const res = await Class.remove(id)
            if (res.status && res.status.success) {
                setDepartment(prev => (prev != null ? { ...prev, classes: prev.classes.filter(e => e.id != id) } : null))
            }
            if (res.error) {
                alert(res.error.message)
            }
        },
        editBtnPress: (id: ClassType['id']) => {
            const room = department!.classes.find(e => e.id == id)
            if (room == null) return
            setEditId(id)
            nameRef.current!.value = room.name;
            hoursPerDayRef.current!.value = room.hoursPerDay + "";
            daysPerWeekRef.current!.value = room.daysPerWeek + "";
        },
        edit: async () => {
            if (editId == null) return
            const data = {
                name: nameRef.current!.value,
                hoursPerDay: parseInt(hoursPerDayRef.current!.value),
                daysPerWeek: parseInt(daysPerWeekRef.current!.value),
            }
            if (data.name.trim() == "" || data.hoursPerDay == null || data.daysPerWeek == null) {
                errorRef.current!.innerText = "Fill all field"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.hoursPerDay)) {
                errorRef.current!.innerText = "Hours per day must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.daysPerWeek)) {
                errorRef.current!.innerText = "Days per week must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            errorRef.current!.innerHTML = ""
            try {
                const res = await Class.edit(editId, { ...data })
                if (res.error) {
                    errorRef.current!.innerHTML = res.error.message
                }
                if (res.status && res.status.success) {
                    dismissModal()
                    setDepartment(prev => {
                        return prev != null ? { ...prev, classes: prev.classes.map(e => e.id != editId ? e : res.status.class) } : null
                    })
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (err: any) {
                errorRef.current!.innerHTML = err.response.data.error.message || ""
            }
        },
        addSubject: async (id: ClassType['id'], subjectId: SubjectType['id']) => {
            try {
                const res = await Class.addSubject(id, subjectId, []);
                if (res.error) {
                    errorRef.current!.innerHTML = res.error.message
                }
                if (res.status && res.status.success) {
                    console.log(res.status.class);

                    setDepartment(prev => {
                        return prev != null ? { ...prev, classes: prev.classes.map(e => e.id != editId ? e : res.status.class) } : null
                    })
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (err: any) {
                errorRef.current!.innerHTML = err.response.data.error.message || ""
            }
        },
        removeSubject: async (id: ClassType['id'], subjectId: SubjectType['id']) => {
            try {
                const res = await Class.removeSubject(id, subjectId);
                if (res.error) {
                    errorRef.current!.innerHTML = res.error.message
                }
                if (res.status && res.status.success) {
                    setDepartment(prev => {
                        return prev != null ? { ...prev, classes: prev.classes.map(e => e.id != editId ? e : res.status.class) } : null
                    })
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (err: any) {
                errorRef.current!.innerHTML = err.response.data.error.message || ""
            }
        },
    }
    const clearAllFormFields = () => {
        setEditId(null)
        nameRef.current!.value = ``
        hoursPerDayRef.current!.value = ``
        daysPerWeekRef.current!.value = ``
    }
    const dismissModal = () => {
        const modalDismissBtn = document.getElementById("modalDismissBtn")
        modalDismissBtn?.click()
    }
    return (
        <div className="h-100">
            <p className="text-4xl text-center font-medium">Classes</p>
            <button type="button" className="btn btn btn-dark block ml-auto mr-[10%]" data-bs-toggle="modal" data-bs-target="#newFacultyModal" onClick={() => { clearAllFormFields() }}>Add</button>
            <div className="container flex gap-5 flex-col">
                {department?.classes.map(room =>
                    <div key={room.id} className="bg-white rounded-lg shadow-md flex p-4">
                        <div className="flex-1">
                            <p className="text-lg text-dimgrey font-semibold text-center"> {room.name} <span className="text-khaki text-base font-normal">#{room.id}</span></p>
                            <p>Days per Week: {room.daysPerWeek}</p>
                            <p >Hours Per Day : {room.hoursPerDay}</p>
                            <p className="mt-3 font-medium text-base">Subjects:</p>
                            <div className="dropdown">
                                <button className={`btn btn-secondary dropdown-toggle m-3 ${department.subjects.filter(sub => !room.subjects.map(s => s.subject).includes(sub.id)).length == 0 && 'disabled'}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {department.subjects.filter(sub => !room.subjects.map(s => s.subject).includes(sub.id)).length == 0 ?
                                        "All subject added already" : "Add Subject"
                                    }
                                </button>
                                <ul className="dropdown-menu">
                                    {department.subjects.filter(sub => !room.subjects.map(s => s.subject).includes(sub.id)).map(sub =>
                                        <li key={sub.id} onClick={() => { handle.addSubject(room.id, sub.id) }}><a className="dropdown-item" href="#">{sub.name}</a></li>
                                    )}
                                </ul>
                            </div>
                            <div className="accordion accordion-flush" id="accordionFlushExample">
                                {room.subjects.map((sub, i) => <Subject classId={room.id} id={sub.subject} key={sub.subject} facultyIds={sub.faculties} i={i + 1} onDeleteBtnPress={() => { handle.removeSubject(room.id, sub.subject) }} />)}
                            </div>
                        </div>
                        <div className="flex flex-col ml-3">
                            <div className="btn-group-vertical" role="group" aria-label="Vertical button group">
                                <button type="button" className="btn btn-primary" onClick={() => { handle.editBtnPress(room.id) }} data-bs-toggle="modal" data-bs-target="#newFacultyModal"><i className="bi bi-pencil" ></i></button>
                                <button type="button" className="btn btn-danger" onClick={() => { handle.remove(room.id) }}><i className="bi bi-trash"></i></button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
            <div className="modal fade text-white" id="newFacultyModal" aria-labelledby="newFacultyModalLabel" aria-hidden="true" data-bs-theme="dark">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="newFacultyModalLabel">{editId ? "Edit Faculty" : "New Faculty"}</h1>
                            <button type="button" className="btn-close" id="modalDismissBtn" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {editId &&
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="floatingName" placeholder="Class Id" value={editId} readOnly />
                                    <label htmlFor="floatingName">Id</label>
                                </div>
                            }
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingName" placeholder="Class Name" ref={nameRef} />
                                <label htmlFor="floatingName">Class Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="number" className="form-control" id="floatingDaysPerWeek" placeholder="Min" ref={daysPerWeekRef} />
                                <label htmlFor="floatingDaysPerWeek">Days per week</label>
                            </div>
                            <div className="form-floating">
                                <input type="number" className="form-control" id="floatingHoursPerDay" placeholder="Hours Per Week" ref={hoursPerDayRef} />
                                <label htmlFor="floatingHoursPerDay">Hours Per Week</label>
                            </div>
                            <div>
                                <p className="text-red-500 mt-4 ml-5 font-medium" ref={errorRef}></p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {editId == null ?
                                <button type="button" className="btn btn-primary" onClick={handle.add}>Save changes</button>
                                :
                                <button type="button" className="btn btn-primary" onClick={handle.edit}>Edit changes</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Subject = ({ classId, id, facultyIds, i, onDeleteBtnPress }: { id: SubjectType['id'], facultyIds: FacultyType['id'][], i?: number, classId: ClassType['id'], onDeleteBtnPress?: () => void }) => {
    const subjects = useAppData().department[0]?.subjects
    const faculties = useAppData().department[0]?.faculties
    let sub = subjects?.find(e => e.id == id)
    let subFaculties = faculties?.filter(e => facultyIds.includes(e.id))
    const Class = useClass()
    const setDepartment = useAppDataContext().department[1]

    const handle = {
        addSubjectFaculty: async (subjectId: SubjectType['id'], facultyId: FacultyType['id']) => {
            const res = await Class.editSubjectFaculty(classId, subjectId, facultyIds.includes(facultyId) ? facultyIds.filter(e => e != facultyId) : [...facultyIds, facultyId])
            if (res.status && res.status.success) {
                setDepartment(prev => {
                    return prev != null ? { ...prev, classes: prev.classes.map(e => e.id != classId ? e : res.status.class) } : null
                })
            }
            if (res.error) {
                alert(res.error.message)
            }
        }
    }
    if (sub == null) return
    return (
        <div className="border-b-2 p-3 flex flex-row items-center">
            <p>{sub?.name} {i && `#${i}`}</p>
            <button type="button" className="btn btn-outline-secondary dropdown-toggle ml-auto font-medium text-primary" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                {subFaculties?.map(e => e.name).length == 0 ? ["No faculty assigned"] : subFaculties?.map(e => e.name).join(", ")}
            </button>
            <div className="dropdown-menu p-4">
                {faculties?.map(faculty => <div key={faculty.id} className="p-2 border-b-2 flex flex-row items-center">
                    <label htmlFor={`checkBox${classId}${sub.id}${faculty.id}`} className="cursor-pointer">{faculty.name}</label>
                    <input className="ml-auto cursor-pointer" type="checkbox" name="" id={`checkBox${classId}${sub.id}${faculty.id}`} checked={subFaculties?.map(e => e.id).includes(faculty.id)} onChange={() => {
                        handle.addSubjectFaculty(sub.id, faculty.id)
                    }} />
                </div>)}
            </div>
            <button className="btn btn-danger ml-3" onClick={onDeleteBtnPress}><i className="bi bi-trash"></i></button>
        </div>
    )
}

export default Classes