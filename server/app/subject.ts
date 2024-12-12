import { SubjectType } from "../types/interface"

import * as Department from "./department"
const create = (dir: string, subject: { name: SubjectType['name'], consecutive: SubjectType['consecutive'], hoursPerWeek: SubjectType['hoursPerWeek'], priority: SubjectType['priority'], before?: SubjectType['before'], after?: SubjectType['after'] }) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (subject.before && subject.before > department.config.hoursPerDay) return {
        error: {
            name: "ValidationError",
            message: `before can't be greater than ${department.config.hoursPerDay}`
        }
    }
    if (subject.after && subject.after > department.config.hoursPerDay - 1) return {
        error: {
            name: "ValidationError",
            message: `after can't be greater than ${department.config.hoursPerDay}`
        }
    }
    if (subject.after && subject.before && subject.after >= subject.before) return {
        error: {
            name: "ValidationError",
            message: `after can't be greater than before`
        }
    }
    if (department.subjects.find(e => e.name == subject.name)) return { error: { name: "SubjectCreationFailed", message: "subject already exists" } }
    const id = Date.now()
    const sub = {
        id,
        after: 0,
        before: 0,
        ...subject,
    }
    department.subjects.push(sub)
    Department.set(dir, { subjects: department.subjects })
    return { status: { success: true, message: "subject created", id, subject: sub } }
}

const edit = (dir: string, subject: { id: SubjectType['id'], name?: SubjectType['name'], consecutive?: SubjectType['consecutive'], hoursPerWeek?: SubjectType['hoursPerWeek'], priority: SubjectType['priority'], before: SubjectType['before'], after: SubjectType['after'] }) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (subject.before && subject.before > department.config.hoursPerDay) return {
        error: {
            name: "ValidationError",
            message: `before can't be greater than ${department.config.hoursPerDay}`
        }
    }
    if (subject.after && subject.after > department.config.hoursPerDay) return {
        error: {
            name: "ValidationError",
            message: `after can't be greater than ${department.config.hoursPerDay}`
        }
    }
    if (department.subjects.find(e => e.id == subject.id) == null) return { error: { name: "SubjectNotFound", message: "subject requested is not found" } }
    if (department.subjects.find(e => e.name == subject.name && e.id != subject.id)) return { error: { name: "SubjectEditedFailed", message: "subject name provided already exists" } }
    department.subjects = department.subjects.map(e => e.id == subject.id ? {
        id: subject.id,
        name: subject.name || e.name,
        consecutive: subject.consecutive || e.consecutive,
        hoursPerWeek: subject.hoursPerWeek || e.hoursPerWeek,
        priority: subject.priority || e.priority,
        before: subject.before || e.before || 0,
        after: subject.after || e.after || 0,
    } : e)
    Department.set(dir, { subjects: department.subjects })
    return { status: { success: true, message: "subject edited", subject: department.subjects.find(e => e.id == subject.id) } }
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




export {
    create,
    edit,
    remove
}