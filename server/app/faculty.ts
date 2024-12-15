import { ClassType, FacultyType } from "../types/interface"

import * as Department from "./department"

const create = (dir: string, faculty: { name: FacultyType['name'], min: FacultyType['min'], max: FacultyType['max'], busy: FacultyType['busy'] }) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.faculties.find(e => e.name == faculty.name)) return { error: { name: "FacultyCreationFailed", message: "faculty already exists" } }
    const id = Date.now()
    const facult = { id, ...faculty, busy: faculty.busy || [[]], timetable: [] }
    department.faculties.push(facult)
    Department.set(dir, { faculties: department.faculties })
    initializeFacultyTimetable(dir, id)
    return { status: { success: true, message: "faculty created", id, faculty: facult } }
}

const edit = (dir: string, faculty: { id: FacultyType['id'], name?: FacultyType['name'], min?: FacultyType['min'], max?: FacultyType['max'], busy: FacultyType['busy'] }) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    if (department.faculties.find(e => e.id == faculty.id) == null) return { error: { name: "FacultyNotFound", message: "faculty requested is not found" } }
    if (department.faculties.find(e => e.name == faculty.name && e.id != faculty.id)) return { error: { name: "FacultyEditedFailed", message: "faculty name provided already exists" } }
    department.faculties = department.faculties.map(e => e.id == faculty.id ? {
        ...e,
        ...faculty
    } : e)
    Department.set(dir, { faculties: department.faculties })
    initializeFacultyTimetable(dir, faculty.id)
    return { status: { success: true, message: "faculty edited", faculty: department.faculties.find(e => e.id == faculty.id) } }
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

const initializeFacultyTimetable = (dir: string, facultyId?: FacultyType['id']) => {
    const { department, error } = Department.get(dir)
    if (error) return { error }
    department.faculties.forEach((faculty, index) => {
        if (facultyId != null && faculty.id != facultyId) return
        if (department.faculties[index].timetable == null) department.faculties[index].timetable = []
        let newTimeTable: ClassType['timetable'] = []
        for (let i = 0; i < department.config.daysPerWeek; i++) {
            if (department.faculties[index].timetable[i] == null) department.faculties[index].timetable[i] = []
            if (newTimeTable[i] == null) newTimeTable[i] = []
            for (let j = 0; j < department.config.hoursPerDay; j++) {
                newTimeTable[i][j] = department.faculties[index].timetable[i][j] || null
                // department.faculties[index].timetable[i][j] = department.faculties[index].timetable[i][j] || null
            }
        }
        department.faculties[index].timetable = newTimeTable
    })
    Department.set(dir, { faculties: department.faculties })
}


export {
    create,
    edit,
    remove,
    initializeFacultyTimetable,
}