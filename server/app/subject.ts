import { SubjectType } from "../types/interface"

import * as Department from "./department"

const create = (dir: string, subject: { name: SubjectType['name'], min: SubjectType['min'], max: SubjectType['max'] }) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.subjects.find(e => e.name == subject.name)) return { error: { name: "SubjectCreationFailed", message: "subject already exists" } }
    const id = Date.now()
    department.subjects.push({ id, ...subject })
    Department.set(dir, { subjects: department.subjects })
    return { status: { success: true, message: "subject created", id } }
}

const edit = (dir: string, subject: { id: SubjectType['id'], name?: SubjectType['name'], min?: SubjectType['min'], max?: SubjectType['max'] }) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.subjects.find(e => e.id == subject.id) == null) return { error: { name: "SubjectNotFound", message: "subject requested is not found" } }
    if (department.subjects.find(e => e.name == subject.name)) return { error: { name: "SubjectEditedFailed", message: "subject name provided already exists" } }
    department.subjects = department.subjects.map(e => e.id == subject.id ? {
        id: subject.id,
        name: subject.name || e.name,
        max: subject.max || e.max,
        min: subject.min || e.min,
    } : e)
    Department.set(dir, { subjects: department.subjects })
    return { status: { success: true, message: "subject edited" } }
}

const remove = (dir: string, subjectId: SubjectType['id']) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.subjects.find(e => e.id == subjectId) == null) return { error: { name: "SubjectNotFound", message: "subject requested is not found" } }
    department.classes = department.classes.map(e => e.subjects.find(f => f.subject != subjectId) ? e : {
        ...e,
        subjects: e.subjects.filter(i => i.subject != subjectId)
    })
    department.subjects = department.subjects.filter(e => e.id != subjectId)
    Department.set(dir, { subjects: department.subjects, classes: department.classes })
    return { status: { success: true, message: "subject removed" } }
}

remove("1/mca", 1732644283299)



export {
    create,
    edit,
    remove
}