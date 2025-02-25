import { ClassType, FacultyType, SubjectType } from "../types/interface"

import * as Department from "./department"

const create = (dir: string, room: ClassType) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.classes.find(e => e.name == room.name)) return { error: { name: "ClassCreationFailed", message: "class name already exists" } }
    if (room.daysPerWeek > department.config.daysPerWeek) return { error: { name: "DaysExceed", message: "days per week for class can't be greater than days per week of global settings" } }
    if (room.hoursPerDay > department.config.hoursPerDay) return { error: { name: "HoursExceed", message: "hours per day for class can't be greater than hours per day of global settings" } }
    const id = Date.now()
    const clas = {
        ...room,
        id: Date.now(),
        subjects: room.subjects || []
    }
    department.classes.push(clas)
    Department.set(dir, { classes: department.classes })
    Department.initializeClassTimetable(dir)
    return { status: { success: true, message: "class created", id, class: clas } }
}
const remove = (dir: string, id: ClassType['id']) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (!department.classes.find(e => e.id == id)) return { error: { name: "ClassNotFound", message: "class requested is not found" } }
    department.classes = department.classes.filter(e => e.id != id)
    Department.set(dir, { classes: department.classes })
    return { status: { success: true, message: "class removed" } }
}
const edit = (dir: string, room: ClassType) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.classes.find(e => e.id == room.id) == null) return { error: { name: "ClassNotFound", message: "class requested is not found" } }
    if (department.classes.find(e => (e.name == room.name && e.id != room.id))) return { error: { name: "ClassEditFailed", message: "new name provided already exists" } }
    if (room.daysPerWeek > department.config.daysPerWeek) return { error: { name: "DaysExceed", message: "days per week for class can't be greater than days per week of global settings" } }
    if (room.hoursPerDay > department.config.hoursPerDay) return { error: { name: "HoursExceed", message: "hours per day for class can't be greater than hours per day of global settings" } }
    department.classes = department.classes.map(e => e.id != room.id ? e : { ...e, ...room })
    Department.set(dir, { classes: department.classes })
    if (room.daysPerWeek || room.hoursPerDay) Department.initializeClassTimetable(dir)
    return { status: { success: true, message: "class edited", class: department.classes.find(e => e.id == room.id) } }
}

const addSubject = (dir: string, classId: ClassType['id'], subjectId: SubjectType['id'], facultyIds: Array<FacultyType['id']>) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.classes.find(e => e.id == classId) == null) return { error: { name: "ClassNotFound", message: "class requested is not found" } }
    if (department.classes.find(e => e.id == classId)?.subjects.find(e => e.subject == subjectId) != null) {
        department.classes = department.classes.map(e => e.id != classId ? e : {
            ...e,
            subjects: e.subjects.filter(f => f.subject != subjectId)
        })
    }
    if (department.subjects.find(e => e.id == subjectId) == null) return { error: { name: "SubjectNotFound", message: "subject requested is not found" } }
    if (department.faculties.filter(e => facultyIds.includes(e.id)).length != facultyIds.length) return { error: { name: "FacultyNotFound", message: "Faculty requested is not found" } }
    department.classes = department.classes.map(e => e.id != classId ? e : {
        ...e,
        subjects: [...e.subjects, { subject: subjectId, faculties: facultyIds }]
    })
    Department.set(dir, { classes: department.classes })
    const room = department.classes.find(e => e.id == classId)
    return { status: { success: true, message: "subject added successfully", class: room } }
}
const editSubjectFaculty = (dir: string, classId: ClassType['id'], subjectId: SubjectType['id'], facultyIds: Array<FacultyType['id']>) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.classes.find(e => e.id == classId) == null) return { error: { name: "ClassNotFound", message: "class requested is not found" } }
    if (department.subjects.find(e => e.id == subjectId) == null) return { error: { name: "SubjectNotFound", message: "subject requested is not found" } }
    if (department.faculties.filter(e => facultyIds.includes(e.id)).length != facultyIds.length) return { error: { name: "FacultyNotFound", message: "Faculty requested is not found" } }
    department.classes = department.classes.map(e => e.id != classId ? e : {
        ...e,
        subjects: e.subjects.map(e => e.subject != subjectId ? e : { ...e, faculties: facultyIds })
    })
    Department.set(dir, { classes: department.classes })
    return { status: { success: true, message: "subject edited successfully", class: department.classes.find(e => e.id == classId) } }
}

const removeSubject = (dir: string, classId: ClassType['id'], subjectId: SubjectType['id']) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.classes.find(e => e.id == classId) == null) return { error: { name: "ClassNotFound", message: "class requested is not found" } }
    if (department.classes.find(e => e.id == classId)?.subjects.find(e => e.subject == subjectId) == null) return { error: { name: "SubjectNotFound", message: "requested subject not found on class" } }
    department.classes = department.classes.map(e => e.id != classId ? e : {
        ...e,
        subjects: e.subjects.filter(f => f.subject != subjectId)
    })
    Department.set(dir, { classes: department.classes })
    return { status: { success: true, message: "subject removed successfully", class: department.classes.find(e => e.id == classId) } }
}


export {
    create,
    remove,
    edit,
    addSubject,
    removeSubject,
    editSubjectFaculty
}