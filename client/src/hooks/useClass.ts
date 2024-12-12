import { ClassType, FacultyType, SubjectType } from "../context/AppDataContext"
import useAppData from "./useAppData"
import useAxiosPrivate from "./useAxiosPrivate"

const useClass = () => {
    const axiosPrivate = useAxiosPrivate()
    const [profile] = useAppData().profile
    const add = async (room: {
        name: ClassType['name'],
        hoursPerDay: ClassType['hoursPerDay'],
        daysPerWeek: ClassType['daysPerWeek'],
    }) => {
        const res = await axiosPrivate.post("/class/", { department: profile, ...room })
        return res.data
    }
    const remove = async (id: ClassType['id']) => {
        const res = await axiosPrivate.delete("/class/", {
            data: {
                department: profile,
                id
            }
        })
        return res.data
    }
    const edit = async (id: ClassType['id'], room: {
        name?: ClassType['name'],
        hoursPerDay?: ClassType['hoursPerDay'],
        daysPerWeek?: ClassType['daysPerWeek'],
    }) => {
        const res = await axiosPrivate.put("/class/", { department: profile, id, ...room })
        return res.data
    }
    const addSubject = async (id: ClassType['id'], subjectId: SubjectType['id'], facultyIds: FacultyType['id'][]) => {
        const res = await axiosPrivate.put("/class/subject", { department: profile, classId: id, subjectId, facultyIds })
        return res.data
    }
    const editSubjectFaculty = async (id: ClassType['id'], subjectId: SubjectType['id'], facultyIds: FacultyType['id'][]) => {
        const res = await axiosPrivate.put("/class/subject/faculty", { department: profile, classId: id, subjectId, facultyIds })
        return res.data
    }
    const removeSubject = async (id: ClassType['id'], subjectId: SubjectType['id']) => {
        const res = await axiosPrivate.delete("/class/subject", {
            data: {
                department: profile,
                classId: id,
                subjectId
            }
        })
        return res.data
    }
    return { add, remove, edit, addSubject, removeSubject, editSubjectFaculty }
}

export default useClass