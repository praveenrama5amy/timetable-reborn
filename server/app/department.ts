import fs from "fs"
import path from "path"


import config from "./config"
import { DepartmentInterface, GlobalConfig } from "../types/interface"
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
    let timetable: DepartmentInterface['timetable'] = [[]];
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
            classes, faculties, subjects, config: globalConfig, timetable
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
            fs.writeFileSync(path.join(config.dataFolder, dir, config.files.timeTableFolder, config.files.timetableFile), "[]", { encoding: "utf-8" })
    } catch (err) {
        console.log(err);
        return false

    }
}

const initializeTimetableFile = async (dir: string) => {
    createRequiredFiles(dir)
    const { department, error } = get(dir)
    if (error) return { error }
    const { config: generalSettings, timetable } = department
    const newTimeTable: Array<Array<string | null | undefined>> = []
    for (let i = 0; i < generalSettings.daysPerWeek; i++) {
        const dayT: Array<string | null | undefined> = []
        for (let j = 0; j < generalSettings.hoursPerDay; j++) {
            if (newTimeTable[i] == null) timetable[i] = []
            dayT.push(timetable[i][j] || null);
        }
        newTimeTable.push(dayT)
    }
    fs.writeFileSync(path.join(config.dataFolder, dir, config.files.timeTableFolder, config.files.timetableFile), JSON.stringify(newTimeTable), { encoding: "utf-8" })
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
    initializeTimetableFile(dir);
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
    getUserDepartments,
    set
}