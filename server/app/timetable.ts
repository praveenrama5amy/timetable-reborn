
import { ClassType, ConflictInterface, DepartmentInterface, FacultyType, SubjectType } from "../types/interface";
import * as Department from "./department"
import * as Faculty from "./faculty"


const assign = (dir: string, classId: ClassType['id'], day: number, hour: number, subjectId: SubjectType['id']) => {
    const { department, error: deptError } = Department.get(dir)
    if (deptError) return { error: deptError }
    const room = department.classes.find(room => room.id == classId)
    if (room == null) return { error: { name: "ClassNotFound", message: "requested class not found" } }
    const subject = department.subjects.find(subject => subject.id == subjectId)
    if (subject == null) return { error: { name: "SubjectNotFound", message: "requested subject not found" } }
    const assignedSubject = room.subjects.find(sub => sub.subject == subjectId)
    if (assignedSubject == null) return { error: { name: "SubjectNotAssigned", message: "requested subject not assigned to the requested class" } }
    const alreadyAlloted = room.timetable.flat().filter(sub => sub == subjectId).length
    if (alreadyAlloted >= subject.hoursPerWeek) return { error: { name: "SubjectLimitReached", message: `subject reached it limit ${subject.hoursPerWeek}` } }
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

const unassign = (dir: string, classId: ClassType['id'], day?: number | null, hour?: number) => {
    try {
        const { department, error: deptError } = Department.get(dir)
        if (deptError) return { error: deptError }
        const classIndex = department.classes.findIndex(e => e.id == classId)
        if (classIndex == null || classIndex == -1) return { error: { name: "ClassNotFound", message: "requested class not found" } }
        for (let i = day || 0; i <= (day != null ? day : department.classes[classIndex].timetable.length - 1); i++) {
            for (let j = hour || 0; j <= (hour != null ? hour : department.classes[classIndex].timetable[i].length - 1); j++) {
                const subjectId = department.classes[classIndex].timetable[i][j]
                // if (subjectId == null) return { status: { success: true, message: "timetable updated" } }
                if (subjectId == null) continue;
                department.classes[classIndex].timetable[i][j] = null

                const subjectFaculties = department.classes[classIndex].subjects.find(sub => sub.subject == subjectId)?.faculties
                department.faculties.forEach((faculty, i) => {
                    if (!subjectFaculties?.includes(faculty.id)) return
                    department.faculties[i].timetable[i][j] = null
                })
            }
        }
        Department.set(dir, { classes: department.classes, faculties: department.faculties })
        return { status: { success: true, message: "timetable updated" } }
    } catch (err) {
        console.log(err);

    }
}


const isFacultyBusy = (dir: string, facultyId: FacultyType['id'], day: number, hour: number) => {
    const { department, error: deptError } = Department.get(dir)
    if (deptError) return { error: deptError }
    return department.faculties.find(faculty => faculty.id == facultyId)?.timetable[day][hour] != null
}

const getClassSubjectPriority = (dir: string, classId: ClassType['id'], day?: number, hour?: number) => {
    const { error, department } = Department.get(dir)
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
    if (day != null) {
        room.timetable[day].forEach(sub => {
            if (sub == null) return
            priorities[sub] = priorities[sub!] / 1.5
        })
    }
    if (day != null && hour != null) {
        if (room.timetable[day][hour - 1] != null) priorities[room.timetable[day][hour - 1]!] /= 2
        if (room.timetable[day][hour + 1] != null) priorities[room.timetable[day][hour + 1]!] /= 2
    }
    const priority: Array<[SubjectType['id'], number]> = Object.entries(priorities).sort((a, b) => b[1] - a[1]).map(p => { return [Number(p[0]), p[1]] })
    return { priority }
}

const getFacultiesPriority = (dir: string, day?: number, hour?: number) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    const alloted: { [key: SubjectType['id']]: number } = {}
    const priorities: { [key: SubjectType['id']]: number } = {}
    department.faculties.forEach(faculty => {
        priorities[faculty.id] = 0
        alloted[faculty.id] = faculty.timetable.flat().filter(e => e != null).length
        const frequency = faculty.max - faculty.min
        priorities[faculty.id] += (frequency - alloted[faculty.id])
        if (alloted[faculty.id] >= faculty.min) priorities[faculty.id] /= 2

        const facultyWorkingOnTheDay = day != null ? faculty.timetable[day].filter(e => e != null).length : 0
        if (day != null && facultyWorkingOnTheDay != 0) {
            priorities[faculty.id] /= faculty.timetable[day].filter(e => e != null).length * 1.2
        }
        if (day != null && hour != null && facultyWorkingOnTheDay != 0) {
            if (faculty.timetable[day][hour - 1] != null) priorities[faculty.id] /= 1.2
            if (faculty.timetable[day][hour + 1] != null) priorities[faculty.id] /= 1.2
        }
    })
    const priority: Array<[FacultyType['id'], number]> = Object.entries(priorities).sort((a, b) => b[1] - a[1]).map(p => { return [Number(p[0]), p[1]] })
    return { priority }

}

const getClassPriority = (dir: string) => {
    const { error, department } = Department.get(dir);
    if (error) return { error }
    const priorities: { [key: SubjectType['id']]: number } = {}
    department.classes.forEach(room => {
        priorities[room.id] = room.daysPerWeek * room.hoursPerDay - room.timetable.flat().filter(hour => hour != null).length
    })
    const priority: Array<[ClassType['id'], number]> = Object.entries(priorities).sort((a, b) => b[1] - a[1]).map(p => { return [Number(p[0]), p[1]] })
    return { priority }
}
const getBestSubForTheHour = (dir: string, classId: ClassType['id'], day: number, hour: number) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    const room = department.classes.find(room => room.id == classId)
    if (room == null) return { error: { name: "ClassNotFound", message: `class requested not found in the department` } }
    const { error: subjectPriorityError, priority: subjectPriority } = getClassSubjectPriority(dir, classId, day, hour);
    if (subjectPriorityError) return { error: subjectPriorityError }
    const { error: facultyError, priority: facultyPriority } = getFacultiesPriority(dir, day, hour)
    if (facultyError) return { error: facultyError }
    const finalPriority: [FacultyType['id'], number][] = subjectPriority.map(sub => {
        const subAssigned = room.subjects.find(e => e.subject == sub[0])
        if (subAssigned == null) return sub
        const facultiesMeanPriority = subAssigned.faculties.reduce((p: number, c: FacultyType['id']) => {
            const fp = facultyPriority.find(e => e[0] == c)
            if (fp == null) return p
            return p + fp[1]
        }, 0)
        return [sub[0], sub[1] + facultiesMeanPriority]
    })
    return finalPriority.sort((a, b) => b[1] - a[1])


}
const autoGenerate = (dir: string) => {
    Department.initializeClassTimetable(dir)
    Faculty.initializeFacultyTimetable(dir)
    const { error, department } = Department.get(dir)
    if (error) return { error }
    for (const room of department.classes) {
        for (let i = 0; i < room.daysPerWeek; i++) {
            for (let j = 0; j < room.hoursPerDay; j++) {
                const finalPriority = getBestSubForTheHour(dir, room.id, i, j)
                return finalPriority
            }
        }
    }

}
console.log(autoGenerate("1/mca"));

export {
    assign,
    unassign,
    isFacultyBusy,
    getClassSubjectPriority,
    getFacultiesPriority,
    autoGenerate
}