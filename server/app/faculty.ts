import { ClassType, FacultyType } from "../types/interface"

import * as Department from "./department"

const create = (dir: string, faculty: { name: FacultyType['name'], min: FacultyType['min'], max: FacultyType['max'], busy: FacultyType['busy'] }) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.faculties.find(e => e.name == faculty.name)) return { error: { name: "FacultyCreationFailed", message: "faculty already exists" } }
    const id = Date.now()
    department.faculties.push({ id, ...faculty, busy: faculty.busy || [[]] })
    Department.set(dir, { faculties: department.faculties })
    return { status: { success: true, message: "faculty created", id } }
}

const edit = (dir: string, faculty: { id: FacultyType['id'], name?: FacultyType['name'], min?: FacultyType['min'], max?: FacultyType['max'], busy: FacultyType['busy'] }) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.faculties.find(e => e.id == faculty.id) == null) return { error: { name: "FacultyNotFound", message: "faculty requested is not found" } }
    if (department.faculties.find(e => e.name == faculty.name)) return { error: { name: "FacultyEditedFailed", message: "faculty name provided already exists" } }
    department.faculties = department.faculties.map(e => e.id == faculty.id ? {
        id: faculty.id,
        name: faculty.name || e.name,
        max: faculty.max || e.max,
        min: faculty.min || e.min,
        busy: faculty.busy || e.busy
    } : e)
    Department.set(dir, { faculties: department.faculties })
    return { status: { success: true, message: "faculty edited" } }
}

const remove = (dir: string, facultyId: FacultyType['id']) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.faculties.find(e => e.id == facultyId) == null) return { error: { name: "FacultyNotFound", message: "faculty requested is not found" } }
    department.faculties = department.faculties.filter(e => e.id != facultyId)
    department.classes = department.classes.map(
        e => e.subjects.find(f => f.faculties.includes(facultyId))
            ? {
                ...e,
                subjects: e.subjects.map(g =>
                    ({ ...g, faculties: g.faculties.filter(h => h != facultyId) })
                )
            }
            : e
    )
    Department.set(dir, { faculties: department.faculties, classes: department.classes })
    return { status: { success: true, message: "faculty removed" } }
}



export {
    create,
    edit,
    remove
}