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
    classes: Array<ClassType>;
    faculties: Array<FacultyType>;
    subjects: Array<SubjectType>;
    globalConfig: GlobalConfig;
    timetable: Array<Array<TimetableHourType>>;
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
}
export type FacultyType = {
    id: number,
    name: string,
    min: number,
    max: number,
    busy: Array<Array<number>>
}
export type SubjectType = {
    id: number,
    name: string,
    hoursPerWeek: number,
    consecutive: number,
    priority: number,
}
export type TimetableHourType = string | null | undefined


export interface ConflictInterface {
    message: string,
    type: "room" | "faculty" | "subject",
    maker: string
}