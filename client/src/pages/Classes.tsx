import { ClassType, FacultyType, SubjectType } from "../context/AppDataContext"
import LoadBar from "../components/LoadBar"
import useAppData from "../hooks/useAppData"

const Classes = () => {
    const [department, setDepartment] = useAppData().department

    const handle = {
        add: () => {

        },
        remove: (id: ClassType['id']) => {

        },
        editBtnPress: (id: ClassType['id']) => {

        }
    }
    return (
        <div className="h-100">
            <p className="text-4xl text-center font-medium">Classes</p>
            <button type="button" className="btn btn btn-dark block ml-auto mr-[10%]" data-bs-toggle="modal" data-bs-target="#newFacultyModal" onClick={() => { }}>Add</button>
            <div className="container flex gap-5 flex-col">
                {department?.classes.map(room =>
                    <div key={room.id} className="bg-white rounded-lg shadow-md flex p-4">
                        <div className="flex-1">
                            <p className="text-lg text-dimgrey font-semibold text-center"> {room.name} <span className="text-khaki text-base font-normal">#{room.id}</span></p>
                            <p>Days per Week: {room.daysPerWeek}</p>
                            <p >Hours Per Day : {room.hoursPerDay}</p>
                            <p className="mt-3 font-medium text-base">Subjects:</p>
                            <div className="accordion accordion-flush" id="accordionFlushExample">
                                {room.subjects.map((sub, i) => <Subject id={sub.subject} key={sub.subject} facultyIds={sub.faculties} i={i + 1} />)}
                            </div>
                            {/* <LoadBar max={room.max} min={room.min} value={room.timetable.flat().filter(e => e != null).length} /> */}
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
        </div>
    )
}

export const Subject = ({ id, facultyIds, i }: { id: SubjectType['id'], facultyIds: FacultyType['id'][], i?: number }) => {
    const subjects = useAppData().department[0]?.subjects
    const faculties = useAppData().department[0]?.faculties
    let sub = subjects?.find(e => e.id == id)
    let subFaculties = faculties?.filter(e => facultyIds.includes(e.id))

    return (
        <div className="accordion-item">
            <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${sub?.id}`} aria-expanded="false" aria-controls={`flush-collapse${sub?.id}`}>
                    {sub?.name} {i && `#${i}`}
                </button>
            </h2>
            <div id={`flush-collapse${sub?.id}`} className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div className="accordion-body text-black">
                    {subFaculties?.map(e => e.name).join(" ,")}
                </div>
            </div>
        </div>
    )
}

export default Classes