
import { ClassType, ConflictInterface, DepartmentInterface, FacultyType, SubjectType } from "../types/interface";
import * as Department from "./department"
import * as Faculty from "./faculty"


const assign = (dir: string, classId: ClassType['id'], day: number, hour: number, subjectId: SubjectType['id']) => {
    const { department, error: deptError } = Department.get(dir)
    if (deptError) return { error: deptError }
    //Subject Hash
    const subjectsHash: { [key: SubjectType['id']]: SubjectType } = {}
    department?.subjects.forEach(sub => {
        subjectsHash[sub.id] = sub
    })

    //faculty hash 
    const facultyHash: { [key: FacultyType['id']]: FacultyType } = {}
    department?.faculties.forEach(faculty => {
        facultyHash[faculty.id] = faculty
    })

    //room hash 
    const roomHash: { [key: ClassType['id']]: ClassType } = {}
    department?.classes.forEach(room => {
        roomHash[room.id] = room
    })
    //check if class exists
    const room = roomHash[classId]
    if (room == null) return { error: { name: "ClassNotFound", message: "requested class not found" } }

    // //Unassign if already assigned
    // if (room.timetable[day][hour] != null) unassign(dir, room.id, day, hour)

    //Check whether hour already assigned
    if (room.timetable[day][hour] != null) return { error: { name: "AssignmentError", message: "already hour assigned" } }

    //check whether the subject is assigned to the class
    const subject = subjectsHash[subjectId]
    if (subject == null) return { error: { name: "SubjectNotFound", message: "requested subject not found" } }
    const assignedSubject = room.subjects.find(sub => sub.subject == subjectId)
    if (assignedSubject == null) return { error: { name: "SubjectNotAssigned", message: "requested subject not assigned to the requested class" } }
    //Subject Limit Reached?
    const alreadyAlloted = room.timetable.flat().filter(sub => sub == subjectId).length
    if (alreadyAlloted >= subject.hoursPerWeek) return { error: { name: "SubjectLimitReached", message: `subject reached it limit ${subject.hoursPerWeek}` } }

    //consecutive hour availability
    if (hour + subject.consecutive > room.hoursPerDay) return { error: { name: "AssignmentError", message: "class is not free for subsequent hour" } }
    for (let i = 0; i < subject.consecutive; i++) {
        //consecutive hour free?
        if (room.timetable[day][hour + i] != null) return { error: { name: "AssignmentError", message: "class is not free for subsequent hour" } }
    }

    //Get faculties
    const faculties = department.faculties.filter(faculty => assignedSubject.faculties.includes(faculty.id))
    //consecutive check
    for (let i = 0; i < subject.consecutive; i++) {
        //Whether Faculty busy?
        if (faculties.some(faculty => isFacultyBusy(dir, faculty.id, day, hour + i))) return { error: { name: "FacultyBusy", message: "faculty is busy for the hour or subsequent hour" } }
    }

    //consecutive Assignment
    for (let i = 0; i < subject.consecutive; i++) {
        room.timetable[day][hour + i] = subject.id
        //Faculty consecutive timetable assignment
        for (let j = 0; j < department.faculties.length; j++) {
            const faculty = department.faculties[j]
            if (!assignedSubject.faculties.includes(faculty.id)) continue;
            department.faculties[j].timetable[day][hour + i] = classId;
        }
    }
    // department.faculties.forEach((faculty, i) => {
    //     if (!assignedSubject.faculties.includes(faculty.id)) return
    //     department.faculties[i].timetable[day][hour + i] = classId
    // })
    department.classes = department.classes.map(e => e.id != room.id ? e : room)
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
                if (subjectId == null) continue;
                department.classes[classIndex].timetable[i][j] = null
                const subjectFaculties = department.classes[classIndex].subjects.find(sub => sub.subject == subjectId)?.faculties
                department.faculties.forEach((faculty, k) => {
                    if (!subjectFaculties?.includes(faculty.id)) return
                    department.faculties[k].timetable[i][j] = null
                })
            }
        }
        Department.set(dir, { classes: department.classes, faculties: department.faculties })
        return { status: { success: true, message: "timetable updated" } }
    } catch (err) {

        console.log(err);
        return { error: err }

    }
}


const isFacultyBusy = (dir: string, facultyId: FacultyType['id'], day: number, hour: number) => {
    const { department, error: deptError } = Department.get(dir)
    if (deptError) return { error: deptError }
    if (department.faculties.find(faculty => faculty.id == facultyId)?.timetable[day][hour] != null) return true
    if (department.faculties.find(faculty => faculty.id == facultyId)?.busy.find(e => e[0] == day && e[1] == hour) != null) return true
    return false
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
    return { priority: finalPriority.sort((a, b) => b[1] - a[1]) }


}
const autoGenerateAll = (dir: string) => {
    Department.initializeClassTimetable(dir)
    Faculty.initializeFacultyTimetable(dir)
    const { error, department } = Department.get(dir)
    if (error) return { error }
    for (const room of department.classes) {
        for (let i = 0; i < room.daysPerWeek; i++) {
            for (let j = 0; j < room.hoursPerDay; j++) {
                const { error, priority: finalPriority } = getBestSubForTheHour(dir, room.id, i, j)
                if (error) return { error }
                let k = 0;
                do {
                    console.log(`i : ${i} , j : ${j} , k : ${k}`);
                    console.log(finalPriority[k]);
                    var { error: assignmentError, status } = assign(dir, room.id, i, j, finalPriority[k][0])
                    console.log(assignmentError);


                    k++;
                } while (assignmentError != null && finalPriority[k] != null)
            }
        }
    }
}
const autoGenerate = (dir: string, hours: Array<{ classId: ClassType['id'], day: number, hour: number }>) => {
    Department.initializeClassTimetable(dir)
    Faculty.initializeFacultyTimetable(dir)
    const { error, department } = Department.get(dir)
    if (error) return { error }

    //Subject Hash
    const subjectsHash: { [key: SubjectType['id']]: SubjectType } = {}
    department?.subjects.forEach(sub => {
        subjectsHash[sub.id] = sub
    })

    //faculty hash 
    const facultyHash: { [key: FacultyType['id']]: FacultyType } = {}
    department?.faculties.forEach(faculty => {
        facultyHash[faculty.id] = faculty
    })

    //room hash 
    const roomHash: { [key: ClassType['id']]: ClassType } = {}
    department?.classes.forEach(room => {
        roomHash[room.id] = room
    })

    for (let i = 0; i < hours.length; i++) {
        const hour = hours[i];
        const { error, priority: finalPriority } = getBestSubForTheHour(dir, hour.classId, hour.day, hour.hour)
        if (error) return { error }
        let k = 0;
        do {
            console.log(`i : ${hour.day} , j : ${hour.hour} , k : ${k}`);
            console.log(finalPriority[k]);
            if (subjectsHash[finalPriority[k][0]].consecutive > 1) {
                if (!(hour.hour + subjectsHash[finalPriority[k][0]].consecutive < roomHash[hour.classId].hoursPerDay)) {
                    k++;
                    continue;
                }
            }
            var { error: assignmentError, status } = assign(dir, hour.classId, hour.day, hour.hour, finalPriority[k][0])
            k++;
        } while (assignmentError != null && finalPriority[k] != null)
    }
    return { status: { success: true, message: "done" } }
}
export {
    assign,
    unassign,
    isFacultyBusy,
    getClassSubjectPriority,
    getFacultiesPriority,
    autoGenerateAll,
    autoGenerate
}