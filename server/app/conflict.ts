
import { ClassType, ConflictInterface, FacultyType } from "../types/interface";
import * as Department from "./department"

const validateEntries = (dir: string) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }

    const { error: e, allocation } = getAllocation(dir)
    if (e) return { error: e }

    const conflicts: Array<ConflictInterface> = [];

    department.classes.forEach(room => {
        const hoursNeed = room.daysPerWeek * room.hoursPerDay
        if (hoursNeed > allocation.class[room.id]) conflicts.push({
            type: "room",
            error: "HoursUnderflow",
            message: `${room.name} needs ${hoursNeed - allocation.class[room.id]} more classes`,
            solutions: ["reduce class hours", "assign more subjects", "increase subject hours per week"],
            maker: room
        })
        if (hoursNeed < allocation.class[room.id]) conflicts.push({
            type: "room",
            error: "HoursOverflow",
            message: `${room.name} has ${allocation.class[room.id] - hoursNeed} more classes`,
            solutions: ["increase class hours", "deallocate some subjects", "reduce subject hours per week"],
            maker: room
        })
    })
    department.faculties.forEach(faculty => {
        if (faculty.min > allocation.faculties[faculty.id]) conflicts.push({
            type: "faculty",
            maker: faculty,
            error: "FacultyUnderflow",
            solutions: ["reduce minimum work load criteria", "assign for subjects"],
            message: `${faculty.name} doesn't minimum criteria, needs ${faculty.min - allocation.faculties[faculty.id]} more hours`
        })
        if (faculty.max < allocation.faculties[faculty.id]) conflicts.push({
            type: "faculty",
            maker: faculty,
            error: "FacultyOverflow",
            solutions: ["increase maximum work load criteria", "free some subject assignment"],
            message: `${faculty.name} exceeding maximum criteria, exceeding ${allocation.faculties[faculty.id] - faculty.min} hours`
        })
    })
    department.subjects.forEach(subject => {
        if (subject.hoursPerWeek % subject.consecutive != 0) conflicts.push({
            error: "InvalidSubjectHour",
            maker: subject,
            type: "subject",
            message: `${subject.name} must be in multiply of ${subject.consecutive}`,
            solutions: [`make hours per week to multiply of ${subject.consecutive}`]
        })
    })
    return { conflicts }
}
const getAllocation = (dir: string) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    //Hour Allocation
    let allocation: {
        class: { [key: ClassType['id']]: number }
        faculties: { [key: FacultyType['id']]: number }
    } = { class: {}, faculties: {} }
    department.classes.forEach(room => {
        allocation.class[room.id] = 0
        room.subjects.forEach(subject => {
            let sub = department.subjects.find(e => e.id == subject.subject)
            let faculties = department.faculties.filter(e => subject.faculties.includes(e.id))
            faculties.forEach(faculty =>
                allocation.faculties[faculty.id] = (allocation.faculties[faculty.id] || 0) + (sub?.hoursPerWeek || 0)
            )
            allocation.class[room.id] = (allocation.class[room.id] || 0) + (sub?.hoursPerWeek || 0)
        })
    })
    department.faculties.forEach(faculty => {
        if (allocation.faculties[faculty.id] == null) allocation.faculties[faculty.id] = 0
    })
    return { allocation }
}



export {
    validateEntries,
    getAllocation,
}