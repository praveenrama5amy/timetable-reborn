import { useRef, useState } from "react"
import LoadBar from "../components/LoadBar"
import { FacultyType, useAppDataContext } from "../context/AppDataContext"
import useFaculty from "../hooks/useFaculty"

const Faculties = () => {
    const [department, setDepartment] = useAppDataContext().department
    const nameRef = useRef<HTMLInputElement>(null)
    const minRef = useRef<HTMLInputElement>(null)
    const maxRef = useRef<HTMLInputElement>(null)
    const errorRef = useRef<HTMLInputElement>(null)
    const Faculty = useFaculty()
    const [editId, setEditId] = useState<null | number>(null)
    const handle = {
        add: async () => {
            const data = {
                name: nameRef.current!.value,
                min: parseInt(minRef.current!.value),
                max: parseInt(maxRef.current!.value),
            }
            if (data.name.trim() == "" || data.min == null || data.max == null) {
                errorRef.current!.innerText = "Fill all field"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.min)) {
                errorRef.current!.innerText = "Min must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.max)) {
                errorRef.current!.innerText = "Max must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (data.min > data.max) {
                errorRef.current!.innerText = "Min can't be greater than max"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            errorRef.current!.innerHTML = ""
            try {
                const res = await Faculty.add(data)
                if (res.error) {
                    errorRef.current!.innerHTML = res.error.message
                }
                if (res.status && res.status.success) {
                    setDepartment(prev => {
                        return prev != null ? { ...prev, faculties: [...prev.faculties, res.status.faculty] } : null
                    })
                    alert("Added")
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        remove: async (id: FacultyType['id']) => {
            if (confirm("Are you sure?") == false) return
            const res = await Faculty.remove(id)
            if (res.status && res.status.success) {
                setDepartment(prev => (prev != null ? { ...prev, faculties: prev.faculties.filter(e => e.id != id) } : null))
            }
            if (res.error) {
                alert(res.error.message)
            }
        },
        editBtnPress: (id: FacultyType['id']) => {
            console.log("here");

            const faculty = department!.faculties.find(e => e.id == id)
            setEditId(id)
            nameRef.current!.value = faculty!.name;
            minRef.current!.value = faculty!.min + "";
            maxRef.current!.value = faculty!.max + "";
        },
        edit: async () => {
            if (editId == null) return
            const data = {
                name: nameRef.current!.value,
                min: parseInt(minRef.current!.value),
                max: parseInt(maxRef.current!.value),
            }
            if (data.name.trim() == "" || data.min == null || data.max == null) {
                errorRef.current!.innerText = "Fill all field"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.min)) {
                errorRef.current!.innerText = "Min must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (isNaN(data.max)) {
                errorRef.current!.innerText = "Max must be number"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            if (data.min > data.max) {
                errorRef.current!.innerText = "Min can't be greater than max"
                setTimeout(() => {
                    errorRef.current!.innerText = ""
                }, 5000)
                return
            }
            errorRef.current!.innerHTML = ""
            try {
                const res = await Faculty.edit(editId, { ...data })
                console.log(res.data);

                if (res.error) {
                    errorRef.current!.innerHTML = res.error.message
                }
                if (res.status && res.status.success) {
                    console.log(res.status);

                    setDepartment(prev => {
                        return prev != null ? { ...prev, faculties: prev.faculties.map(e => e.id != editId ? e : res.status.faculty) } : null
                    })
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (err: any) {
                errorRef.current!.innerHTML = err.response.data.error.message || ""
            }
        }
    }
    const clearAllFormFields = () => {
        setEditId(null)
        nameRef.current!.value = ``
        minRef.current!.value = ``
        maxRef.current!.value = ``
    }

    return (
        <div className="h-100">
            <p className="text-4xl text-center font-medium">Faculties</p>
            <button type="button" className="btn btn btn-dark block ml-auto mr-[10%]" data-bs-toggle="modal" data-bs-target="#newFacultyModal" onClick={() => { clearAllFormFields() }}>Add</button>
            <div className="container flex gap-5 flex-col">
                {department?.faculties.map(faculty =>
                    <div key={faculty.id} className="bg-white rounded-lg shadow-md flex p-4">
                        <div className="flex-1">
                            <p className="text-lg text-dimgrey font-semibold">Mr/Mrs. {faculty.name} <span className="text-khaki text-base font-normal">#{faculty.id}</span></p>
                            <div className="flex w-100">
                                <p>Min : {faculty.min}</p>
                                <p className="ml-auto">Max : {faculty.max}</p>
                            </div>
                            <LoadBar max={faculty.max} min={faculty.min} value={faculty.timetable.flat().filter(e => e != null).length} />
                        </div>
                        <div className="flex flex-col ml-3">
                            <div className="btn-group-vertical" role="group" aria-label="Vertical button group">
                                <button type="button" className="btn btn-primary" onClick={() => { handle.editBtnPress(faculty.id) }} data-bs-toggle="modal" data-bs-target="#newFacultyModal"><i className="bi bi-pencil" ></i></button>
                                <button type="button" className="btn btn-danger" onClick={() => { handle.remove(faculty.id) }}><i className="bi bi-trash"></i></button>
                            </div>
                        </div>

                    </div>
                )}

                <div className="modal fade text-white" id="newFacultyModal" aria-labelledby="newFacultyModalLabel" aria-hidden="true" data-bs-theme="dark">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="newFacultyModalLabel">{editId ? "Edit Faculty" : "New Faculty"}</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {editId &&
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="floatingName" placeholder="Faculty Id" value={editId} readOnly />
                                        <label htmlFor="floatingName">Id</label>
                                    </div>
                                }
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="floatingName" placeholder="Faculty Name" ref={nameRef} />
                                    <label htmlFor="floatingName">Faculty Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="number" className="form-control" id="floatingMin" placeholder="Min" ref={minRef} />
                                    <label htmlFor="floatingMin">Min Hour</label>
                                </div>
                                <div className="form-floating">
                                    <input type="number" className="form-control" id="floatingMax" placeholder="Max" ref={maxRef} />
                                    <label htmlFor="floatingMax">Max Hour</label>
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

export default Faculties
