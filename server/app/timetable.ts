
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

const getClassSubjectPriority = (department: DepartmentInterface, classId: ClassType['id'], day?: number, hour?: number) => {
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
    return { priority: Object.entries(priorities).sort((a, b) => b[1] - a[1]) }
}
const getClassFacultiesPriority = (dir: string, classId: ClassType['id']) => {
    const { department, error } = Department.get(dir)
    if (error) return { error }
    const room = department.classes.find(e => e.id == classId)
    if (room == null) return { error: { name: "ClassNotFound", message: "requested class not found" } }
    const alloted: { [key: SubjectType['id']]: number } = {}
    const priorities: { [key: SubjectType['id']]: number } = {}
    const facultyIds = room.subjects.map(e => e.faculties).flat().reduce((p: Array<number>, c) => {
        if (!p.includes(c)) p.push(c)
        return p
    }, [])
    const faculties = department.faculties.filter(faculty => facultyIds.includes(faculty.id))
    faculties.forEach(faculty => {
        // faculty.
    })
    return faculties
}
const getFacultiesPriority = (department: DepartmentInterface, day?: number, hour?: number) => {
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
    return { priority: Object.entries(priorities).sort((a, b) => b[1] - a[1]) }

}

const getClassPriority = (department: DepartmentInterface) => {
    const priorities: { [key: SubjectType['id']]: number } = {}
    department.classes.forEach(room => {
        priorities[room.id] = room.daysPerWeek * room.hoursPerDay - room.timetable.flat().filter(hour => hour != null).length
    })
    return { priority: Object.entries(priorities).sort((a, b) => b[1] - a[1]) }
}

const autoGenerate = (dir: string) => {
    Department.initializeClassTimetable(dir)
    Faculty.initializeFacultyTimetable(dir)
    const { error, department } = Department.get(dir)
    if (error) return { error }
    do {
        var classPriority = getClassPriority(department).priority
        const room = department.classes.find(e => e.id == Number(classPriority[0][0]))
        if (room == null) return
        room.timetable.forEach((day, dayIndex) => {
            day.forEach((hour, hourIndex) => {
                if (hourIndex != 0 || dayIndex != 0) return
                let { error, priority: subjectPriority } = getClassSubjectPriority(department, room.id, dayIndex, hourIndex)
                if (error) return
                const facultyPriority = getFacultiesPriority(department, dayIndex, hourIndex).priority
                subjectPriority = subjectPriority?.map(sub => {
                    const subFaculties = room.subjects.find(s => s.subject == Number(sub[0]))!.faculties
                    const subFacultiesTotalPriority = facultyPriority.filter(f => subFaculties.includes(Number(f[0]))).reduce((p: number, c) => { return p += c[1] }, 0)
                    const subFacultiesMean = subFaculties.length != 0 ? subFacultiesTotalPriority / subFaculties.length : subFacultiesTotalPriority / 1
                    return [sub[0], sub[1] + subFacultiesMean]
                })
                subjectPriority = subjectPriority?.sort((a, b) => b[1] - a[1])
                console.log(subjectPriority);
                console.log(assign(dir, room.id, dayIndex, hourIndex, 1732987007558));

                // if (subjectPriority != null) {
                //     for (const sub of subjectPriority) {
                //         const { error } = assign(dir, room.id, dayIndex, hourIndex, Number(sub[0]))
                //         if (error == null) break
                //         department.classes.find(e => e.id == room.id)!.timetable[dayIndex][hourIndex] = Number(sub[0])
                //         room.subjects.find(e => e.subject == Number(sub[0]))?.faculties.forEach(fac => {
                //             department.faculties.find(e => e.id = fac)!.timetable[dayIndex][hourIndex] = Number(sub[0])
                //         })
                //     }
                // }
            })
        })
        break;
    } while (classPriority?.find(priority => priority[1] != 0) != null)
}
console.log(autoGenerate("1/MCA"));




export {
    assign,
    unassign,
    isFacultyBusy,
    getClassFacultiesPriority,
    getClassSubjectPriority,
    getFacultiesPriority,
    autoGenerate
}