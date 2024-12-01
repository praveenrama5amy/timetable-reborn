
import { ClassType, ConflictInterface, FacultyType, SubjectType } from "../types/interface";
import * as Department from "./department"


const assign = (dir: string, classId: ClassType['id'], day: number, hour: number, subjectId: SubjectType['id']) => {
    const { department, error: deptError } = Department.get(dir)
    if (deptError) return { error: deptError }
    const room = department.classes.find(room => room.id == classId)
    if (room == null) return { error: { name: "ClassNotFound", message: "requested class not found" } }
    const subject = department.subjects.find(subject => subject.id == subjectId)
    if (subject == null) return { error: { name: "SubjectNotFound", message: "requested subject not found" } }
    const assignedSubject = room.subjects.find(sub => sub.subject == subjectId)
    if (assignedSubject == null) return { error: { name: "SubjectNotAssigned", message: "requested subject not assigned to the requested class" } }
    const faculties = department.faculties.filter(faculty => assignedSubject.faculties.includes(faculty.id))
    if (faculties.some(faculty => isFacultyBusy(dir, faculty.id, day, hour))) return { error: { name: "TutorBusy", message: "tutor is busy" } }
    room.timetable[day][hour] = subject.id
    department.classes = department.classes.map(e => e.id != room.id ? e : room)
    department.faculties.forEach((faculty, i) => {
        if (!assignedSubject.faculties.includes(faculty.id)) return
        department.faculties[i].timetable[day][hour] = classId
    })
    Department.set(dir, { classes: department.classes, faculties: department.faculties })
    return { status: { success: true, message: "timetable updated" } }
}

const unassign = (dir: string, classId: ClassType['id'], day: number, hour: number) => {
    const { department, error: deptError } = Department.get(dir)
    if (deptError) return { error: deptError }
    const classIndex = department.classes.findIndex(e => e.id == classId)
    if (classIndex == null || classIndex == -1) return { error: { name: "ClassNotFound", message: "requested class not found" } }
    const subjectId = department.classes[classIndex].timetable[day][hour]
    if (subjectId == null) return { status: { success: true, message: "timetable updated" } }
    department.classes[classIndex].timetable[day][hour] = null

    const subjectFaculties = department.classes[classIndex].subjects.find(sub => sub.subject == subjectId)?.faculties
    department.faculties.forEach((faculty, i) => {
        if (!subjectFaculties?.includes(faculty.id)) return
        department.faculties[i].timetable[day][hour] = null
    })
    Department.set(dir, { classes: department.classes, faculties: department.faculties })
    return { status: { success: true, message: "timetable updated" } }
}

const isFacultyBusy = (dir: string, facultyId: FacultyType['id'], day: number, hour: number) => {
    const { department, error: deptError } = Department.get(dir)
    if (deptError) return { error: deptError }
    return department.faculties.find(faculty => faculty.id == facultyId)?.timetable[day][hour] != null
}

const getClassSubjectPriority = (dir: string, classId: ClassType['id']) => {
    const { department, error } = Department.get(dir)
    if (error) return { error }
    const room = department.classes.find(e => e.id == classId)
    if (room == null) return { error: { name: "ClassNotFound", message: "requested class not found" } }
    const priorities: { [key: SubjectType['id']]: number } = {}
    const alloted: { [key: SubjectType['id']]: number } = {}
    room.timetable.forEach(day => {
        day.forEach(hour => {
            if (hour == null) return
            alloted[hour] = (alloted[hour!] || 0) + 1
        })
    })
    room.subjects.forEach(subject => {
        const sub = department.subjects.find(sub => sub.id == subject.subject)
        if (sub == null) return
        priorities[sub.id] = (sub.hoursPerWeek - (alloted[sub.id] || 0)) * sub.priority
    })
    return priorities
}

const autoGenerate = (dir: string) => {

}
console.log(getClassSubjectPriority("1/MCA", 1732894226896));


export {
    assign,
    unassign,
    isFacultyBusy
}