import fs from "fs"
import path from "path"

import * as Faculty from "./faculty"

import config from "./config"
import { ClassType, DepartmentInterface, GlobalConfig, TimetableHourType } from "../types/interface"
const DEFAULT = {
    CONFIG: {
        daysPerWeek: 5,
        hoursPerDay: 6
    }
}


const create = (name: string, dir: string) => {
    try {
        name = name.toUpperCase();
        fs.mkdirSync(path.join(config.dataFolder, dir, name), { recursive: true })
        createRequiredFiles(path.join(dir, name))
        initializeTimetableFile(path.join(dir, name))
        return true
    }
    catch (err) {
        console.log(err);
        return false
    }
}
const exists = (dir: string) => {
    if (fs.existsSync(path.join(config.dataFolder, dir)))
        return true
    return false
}

const get = (dir: string) => {
    if (!exists(dir)) return {
        error: {
            name: "DepartmentNotFound",
            message: "department requested is not found"
        }
    }
    createRequiredFiles(dir);
    let classes: DepartmentInterface['classes'] = [];
    let faculties: DepartmentInterface['faculties'] = [];
    let subjects: DepartmentInterface['subjects'] = [];
    let globalConfig: DepartmentInterface['globalConfig'] = DEFAULT.CONFIG;
    let timetable: DepartmentInterface['timetable'] = {};
    try {
        classes = JSON.parse(fs.readFileSync(path.join(config.dataFolder, dir, config.files.classes), { encoding: "utf-8" }))
    } catch { }
    try {
        faculties = JSON.parse(fs.readFileSync(path.join(config.dataFolder, dir, config.files.faculties), { encoding: "utf-8" }))
    } catch { }
    try {
        subjects = JSON.parse(fs.readFileSync(path.join(config.dataFolder, dir, config.files.subjects), { encoding: "utf-8" }))
    } catch { }
    try {
        globalConfig = JSON.parse(fs.readFileSync(path.join(config.dataFolder, dir, config.files.config), { encoding: "utf-8" }))
    } catch { }
    try {
        timetable = JSON.parse(fs.readFileSync(path.join(config.dataFolder, dir, config.files.timeTableFolder, config.files.timetableFile), { encoding: "utf-8" }))
    } catch { }
    return {
        department: {
            name: path.basename(path.join(config.dataFolder, dir)),
            classes, faculties, subjects, config: globalConfig,
            timetable
        }
    }
}


const createRequiredFiles = (dir: string, overwrite?: boolean) => {
    try {
        const files = fs.readdirSync(path.join(config.dataFolder, dir))
        if (files.find(file => file == config.files.config) == null || overwrite)
            fs.writeFileSync(path.join(config.dataFolder, dir, config.files.config), JSON.stringify(DEFAULT.CONFIG), { encoding: "utf-8" })
        if (files.find(file => file == config.files.classes) == null || overwrite)
            fs.writeFileSync(path.join(config.dataFolder, dir, config.files.classes), "[]", { encoding: "utf-8" })
        if (files.find(file => file == config.files.faculties) == null || overwrite)
            fs.writeFileSync(path.join(config.dataFolder, dir, config.files.faculties), "[]", { encoding: "utf-8" })
        if (files.find(file => file == config.files.subjects) == null || overwrite)
            fs.writeFileSync(path.join(config.dataFolder, dir, config.files.subjects), "[]", { encoding: "utf-8" })
        if (files.find(file => file == config.files.timeTableFolder) == null || overwrite)
            fs.mkdirSync(path.join(config.dataFolder, dir, config.files.timeTableFolder), { recursive: true })
        const filesInTimeTable = fs.readdirSync(path.join(config.dataFolder, dir, config.files.timeTableFolder))
        if (filesInTimeTable.find(file => file == config.files.timetableFile) == null || overwrite)
            fs.writeFileSync(path.join(config.dataFolder, dir, config.files.timeTableFolder, config.files.timetableFile), "{}", { encoding: "utf-8" })
    } catch (err) {
        console.log(err);
        return false

    }
}

const initializeTimetableFile = async (dir: string) => {
    // createRequiredFiles(dir)
    // const { department, error } = get(dir)
    // if (error) return { error }
    // const { config: generalSettings, timetable } = department
    // const newTimeTable: DepartmentInterface['timetable'] = {}

    // department.classes.forEach(room => {
    //     newTimeTable[room.name] = [[]]
    //     for (let i = 0; i < room.daysPerWeek || generalSettings.daysPerWeek; i++) {
    //         const dayT: Array<TimetableHourType> = []
    //         for (let j = 0; j < room.hoursPerDay || generalSettings.hoursPerDay; j++) {
    //             if (newTimeTable[i] == null) timetable[i] = []
    //             dayT.push(department.timetable[room.name][i][j] || null);
    //         }
    //         newTimeTable[room.name].push(dayT)
    //     }
    // })
    // fs.writeFileSync(path.join(config.dataFolder, dir, config.files.timeTableFolder, config.files.timetableFile), JSON.stringify(newTimeTable), { encoding: "utf-8" })
}
const initializeClassTimetable = (dir: string) => {
    createRequiredFiles(dir)
    const { department, error } = get(dir)
    if (error) return { error }
    department.classes.forEach((room, index) => {
        if (department.classes[index].timetable == null) department.classes[index].timetable = []
        let newTimeTable: ClassType['timetable'] = []
        for (let i = 0; i < (room.daysPerWeek || department.config.daysPerWeek); i++) {
            if (department.classes[index].timetable[i] == null) department.classes[index].timetable[i] = []
            if (newTimeTable[i] == null) newTimeTable[i] = []
            for (let j = 0; j < (room.hoursPerDay || department.config.hoursPerDay); j++) {
                newTimeTable[i][j] = department.classes[index].timetable[i][j] || null
                // department.classes[index].timetable[i][j] = department.classes[index].timetable[i][j] || null
            }
        }
        department.classes[index].timetable = newTimeTable
    })
    set(dir, { classes: department.classes })
}

const setConfig = (dir: string, configPassed: {
    daysPerWeek?: GlobalConfig['daysPerWeek'],
    hoursPerDay?: GlobalConfig['hoursPerDay']
}) => {
    const { department, error } = get(dir)
    if (error) return { error }
    const { config: generalSettings } = department
    if (configPassed.daysPerWeek) generalSettings.daysPerWeek = configPassed.daysPerWeek
    if (configPassed.hoursPerDay) generalSettings.hoursPerDay = configPassed.hoursPerDay
    fs.writeFileSync(path.join(config.dataFolder, dir, config.files.config), JSON.stringify(generalSettings), { encoding: "utf-8" });
    //Class hours Modification
    department.classes.forEach((room, index) => {
        if (configPassed.daysPerWeek && room.daysPerWeek > configPassed.daysPerWeek) department.classes[index].daysPerWeek = configPassed.daysPerWeek
        if (configPassed.hoursPerDay && room.hoursPerDay > configPassed.hoursPerDay) department.classes[index].hoursPerDay = configPassed.hoursPerDay
    })
    set(dir, { classes: department.classes })
    initializeClassTimetable(dir)
    Faculty.initializeFacultyTimetable(dir)
    initializeTimetableFile(dir)
}

const set = (
    dir: string,
    { subjects, classes, faculties, timetable }: {
        subjects?: DepartmentInterface['subjects'],
        classes?: DepartmentInterface['classes'],
        faculties?: DepartmentInterface['faculties'],
        timetable?: DepartmentInterface['timetable']
    }
) => {
    const { department, error } = get(dir)
    if (error) return { error }
    if (subjects) fs.writeFileSync(path.join(config.dataFolder, dir, config.files.subjects), JSON.stringify(subjects), { encoding: "utf-8" });
    if (classes) fs.writeFileSync(path.join(config.dataFolder, dir, config.files.classes), JSON.stringify(classes), { encoding: "utf-8" });
    if (faculties) fs.writeFileSync(path.join(config.dataFolder, dir, config.files.faculties), JSON.stringify(faculties), { encoding: "utf-8" });
    if (timetable) fs.writeFileSync(path.join(config.dataFolder, dir, config.files.timetableFile), JSON.stringify(timetable), { encoding: "utf-8" });
}
const remove = (dir: string) => {
    try {
        fs.rmSync(path.join(config.dataFolder, dir), { recursive: true, force: true })
        return true
    } catch (err) {
        console.log(err);
        return false
    }
}

const getUserDepartments = (dir: string) => {
    if (!exists(dir)) return {
        error: {
            error: "UserNotFound",
            message: "user requested not found"
        }
    }
    const depts = fs.readdirSync(path.join(config.dataFolder, dir))
    return { departments: depts }
}


export {
    create,
    exists,
    createRequiredFiles,
    remove,
    get,
    setConfig,
    initializeTimetableFile,
    initializeClassTimetable,
    getUserDepartments,
    set
}