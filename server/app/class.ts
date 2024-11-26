import { ClassType, FacultyType, SubjectType } from "../types/interface"

import * as Department from "./department"

const create = (dir: string, roomName: ClassType['name']) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.classes.find(e => e.name == roomName)) return { error: "ClassCreationFailed", message: "class name already exists" }
    const id = Date.now()
    department.classes.push({
        id,
        name: roomName,
        subjects: []
    })
    Department.set(dir, { classes: department.classes })
    return { status: { success: true, message: "class created", id } }
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
    if (department.classes.find(e => e.name == room.name)) return { error: { name: "ClassEditFailed", message: "new name provided already exists" } }
    department.classes = department.classes.map(e => e.id != room.id ? e : room)
    Department.set(dir, { classes: department.classes })
    return { status: { success: true, message: "class edited" } }
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
    return { status: { success: true, message: "subject added successfully" } }
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
    return { status: { success: true, message: "subject removed successfully" } }
}


export {
    create,
    remove,
    edit,
    addSubject,
    removeSubject
}