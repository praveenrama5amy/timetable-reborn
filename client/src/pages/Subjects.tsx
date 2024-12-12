import { useRef, useState } from "react"
// import LoadBar from "../components/LoadBar"
import { FacultyType, useAppDataContext } from "../context/AppDataContext"
import useSubject from "../hooks/useSubject"


const Subject = () => {
    const [department, setDepartment] = useAppDataContext().department
    const nameRef = useRef<HTMLInputElement>(null)
    const hoursPerWeekRef = useRef<HTMLInputElement>(null)
    const priorityRef = useRef<HTMLInputElement>(null)
    const consecutiveRef = useRef<HTMLInputElement>(null)

    const errorRef = useRef<HTMLInputElement>(null)
    const Subject = useSubject()
    const [editId, setEditId] = useState<null | number>(null)
    const handle = {
        add: async () => {
            const data = {
                name: nameRef.current!.value,
                hoursPerWeek: parseInt(hoursPerWeekRef.current!.value),
                priority: parseInt(priorityRef.current!.value),
                consecutive: parseInt(consecutiveRef.current!.value),
            }
            if (data.name.trim() == "" || data.priority == null || data.consecutive == null || data.hoursPerWeek == null) {
                errorRef.current!.innerText = "Fill all field"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.hoursPerWeek)) {
                errorRef.current!.innerText = "Hours per week must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.consecutive)) {
                errorRef.current!.innerText = "Consecutive must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.priority)) {
                errorRef.current!.innerText = "Priority must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }

            errorRef.current!.innerHTML = ""
            try {
                const res = await Subject.add(data)
                if (res.error) {
                    errorRef.current!.innerHTML = res.error.message
                }
                if (res.status && res.status.success) {
                    setDepartment(prev => {
                        return prev != null ? { ...prev, subjects: [...prev.subjects, res.status.subject] } : null
                    })
                    dismissModal()
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        remove: async (id: FacultyType['id']) => {
            if (confirm("Are you sure?") == false) return
            const res = await Subject.remove(id)
            if (res.status && res.status.success) {
                setDepartment(prev => (prev != null ? { ...prev, subjects: prev.subjects.filter(e => e.id != id) } : null))
            }
            if (res.error) {
                alert(res.error.message)
            }
        },
        editBtnPress: (id: FacultyType['id']) => {
            const subject = department!.subjects.find(e => e.id == id)
            if (subject == null) return
            setEditId(subject.id)
            nameRef.current!.value = subject.name;
            hoursPerWeekRef.current!.value = subject.hoursPerWeek + "";
            priorityRef.current!.value = subject.priority + "";
            consecutiveRef.current!.value = subject.consecutive + "";
        },
        edit: async () => {
            if (editId == null) return
            const data = {
                name: nameRef.current!.value,
                hoursPerWeek: parseInt(hoursPerWeekRef.current!.value),
                priority: parseInt(priorityRef.current!.value),
                consecutive: parseInt(consecutiveRef.current!.value),
            }
            if (data.name.trim() == "" || data.priority == null || data.consecutive == null || data.hoursPerWeek == null) {
                errorRef.current!.innerText = "Fill all field"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.hoursPerWeek)) {
                errorRef.current!.innerText = "Hours per week must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.consecutive)) {
                errorRef.current!.innerText = "Consecutive must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.priority)) {
                errorRef.current!.innerText = "Priority must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            errorRef.current!.innerHTML = ""
            try {
                const res = await Subject.edit(editId, { ...data })
                if (res.error) {
                    errorRef.current!.innerHTML = res.error.message
                }
                if (res.status && res.status.success) {
                    console.log(res.status);
                    dismissModal()
                    setDepartment(prev => {
                        return prev != null ? { ...prev, subjects: prev.subjects.map(e => e.id != editId ? e : res.status.subject) } : null
                    })
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (err: any) {
                errorRef.current!.innerHTML = err.response.data.error.message || ""
            }
        }
    }
    const dismissModal = () => {
        const modalDismissBtn = document.getElementById("modalDismissBtn")
        modalDismissBtn?.click()

    }
    const clearAllFormFields = () => {
        setEditId(null)
        nameRef.current!.value = ``
        priorityRef.current!.value = ``
        consecutiveRef.current!.value = ``
        hoursPerWeekRef.current!.value = ``
    }

    return (
        <div className="h-100">
            <p className="text-4xl text-center font-medium">Subjects</p>
            <button type="button" className="btn btn btn-dark block ml-auto mr-[10%]" data-bs-toggle="modal" data-bs-target="#newSubjectModal" onClick={() => { clearAllFormFields() }}>Add</button>
            <div className="container flex gap-5 flex-col">
                {department?.subjects.map(subject =>
                    <div key={subject.id} className="bg-white rounded-lg shadow-md flex p-4">
                        <div className="flex-1">
                            <p className="text-lg text-dimgrey font-semibold">{subject.name} <span className="text-khaki text-base font-normal">#{subject.id}</span></p>
                            <div className="flex-col ml-8 w-100">
                                <p>Hours per week : {subject.hoursPerWeek}</p>
                                <p>Priority : {subject.priority}</p>
                                <p>Consecutive : {subject.consecutive}</p>
                                <p>Before : {subject.before}</p>
                                <p>After : {subject.after}</p>
                            </div>
                            {/* <LoadBar max={subject.max} min={subject.min} value={subject.timetable.flat().filter(e => e != null).length} /> */}
                        </div>
                        <div className="flex flex-col ml-3">
                            <div className="btn-group-vertical" role="group" aria-label="Vertical button group">
                                <button type="button" className="btn btn-primary" onClick={() => { handle.editBtnPress(subject.id) }} data-bs-toggle="modal" data-bs-target="#newSubjectModal"><i className="bi bi-pencil" ></i></button>
                                <button type="button" className="btn btn-danger" onClick={() => { handle.remove(subject.id) }}><i className="bi bi-trash"></i></button>
                            </div>
                        </div>

                    </div>
                )}

                <div className="modal fade text-white" id="newSubjectModal" aria-labelledby="newFacultyModalLabel" aria-hidden="true" data-bs-theme="dark">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="newFacultyModalLabel">{editId ? "Edit Faculty" : "New Faculty"}</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="modalDismissBtn"></button>
                            </div>
                            <div className="modal-body">
                                {editId &&
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="floatingName" placeholder="Faculty Id" value={editId} readOnly />
                                        <label htmlFor="floatingName">Id</label>
                                    </div>
                                }
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="floatingName" placeholder="Subject Name" ref={nameRef} />
                                    <label htmlFor="floatingName">Subject Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="number" className="form-control" id="floatingHoursPerWeek" placeholder="Hours per week" ref={hoursPerWeekRef} />
                                    <label htmlFor="floatingHoursPerWeek">Hour per week</label>
                                </div>
                                <div className="form-floating">
                                    <input type="number" className="form-control mb-3" id="floatingPriority" placeholder="Priority hour" ref={priorityRef} />
                                    <label htmlFor="floatingPriority">Priority Hour</label>
                                </div>
                                <div className="form-floating">
                                    <input type="number" className="form-control" id="floatingConsecutiveHour" placeholder="Consecutive hour" ref={consecutiveRef} />
                                    <label htmlFor="floatingConsecutiveHour">Consecutive Hour</label>
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
        </div >
    )
}

export default Subject
