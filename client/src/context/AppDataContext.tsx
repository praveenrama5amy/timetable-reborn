import { useState, useContext, createContext, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';


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




interface AppDataContext {
    loading: [boolean, Dispatch<SetStateAction<boolean>>],
    profile: [string | null, Dispatch<SetStateAction<string | null>>],
    departments: [string[], Dispatch<SetStateAction<string[]>>],
    department: [DepartmentInterface | null, Dispatch<SetStateAction<DepartmentInterface | null>>],
    conflicts: [ConflictInterface[], Dispatch<SetStateAction<ConflictInterface[]>>],
}



const AppDataContext = createContext<AppDataContext>({
    loading: [true, () => { return null }],
    profile: ["", () => { return null }],
    departments: [[], () => { return null }],
    department: [null, () => { return null }],
    conflicts: [[], () => { return null }],
})

export const useAppDataContext = () => {
    return useContext(AppDataContext)
}


const AppDataProvider = ({ children }: { children: ReactNode }) => {
    const loading = useState<AppDataContext['loading'][0]>(true);
    const profile = useState<AppDataContext['profile'][0]>(null);
    const departments = useState<AppDataContext['departments'][0]>([]);
    const department = useState<AppDataContext['department'][0]>(null);
    const conflicts = useState<AppDataContext['conflicts'][0]>([]);

    useEffect(() => {
        profile[1](localStorage.getItem("profileSelected"))
    }, [])
    useEffect(() => {
        console.log("Profile Switched");
        profile[0] != null && localStorage.setItem("profileSelected", profile[0])
    }, [profile[0]])
    useEffect(() => {
        console.log(department[0]);


    }, [department[0]])

    return <AppDataContext.Provider value={{
        loading,
        profile,
        departments,
        department,
        conflicts
    }}>
        {children}
    </AppDataContext.Provider>
}


export default AppDataProvider