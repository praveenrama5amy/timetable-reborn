export interface User {
    id: number,
    name: string,
    email: string,
    avatar: string
}

export interface UserPayload extends User {
    iat: number,
    exp: number
}


export interface GlobalConfig {
    daysPerWeek: number,
    hoursPerDay: number
}

export interface DepartmentInterface {
    name: string
    classes: Array<ClassType>;
    faculties: Array<FacultyType>;
    subjects: Array<SubjectType>;
    config: GlobalConfig;
    timetable?: {
        [key: string]: Array<Array<TimetableHourType>>
    };
}
export type ClassType = {
    id: number,
    name: string,
    daysPerWeek: number
    hoursPerDay: number
    subjects: Array<{
        subject: SubjectType['id'],
        faculties: Array<FacultyType['id']>
    }>
    timetable: Array<Array<TimetableHourType>>
}
export type FacultyType = {
    id: number,
    name: string,
    min: number,
    max: number,
    busy: Array<Array<number>>
    timetable: Array<Array<TimetableHourType>>
}
export type SubjectType = {
    id: number,
    name: string,
    hoursPerWeek: number,
    consecutive: number,
    priority: number,
    before: number | 0
    after: number | 0
}
export type TimetableHourType = null | undefined | SubjectType['id']


export interface ConflictInterface {
    type: "room" | "faculty" | "subject",
    maker: ClassType | FacultyType | SubjectType,
    error: string,
    message: string,
    solutions: Array<string>
}