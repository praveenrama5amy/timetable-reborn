import fs from "fs"
import path from "path"


import config from "./config"
import { GlobalConfig } from "../types/interface"
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
            error: "DepartmentNotFound",
            message: "department requested is not found"
        }
    }
    createRequiredFiles(dir);
    let classes: Array<string> = [];
    let faculties: Array<string> = [];
    let subjects: Array<string> = [];
    let globalConfig: GlobalConfig = DEFAULT.CONFIG;
    let timetable: Array<Array<string | null | undefined>> = [];
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
        timetable = JSON.parse(fs.readFileSync(path.join(config.dataFolder, dir, config.files.timeTableFolder, config.files.config), { encoding: "utf-8" }))
    } catch { }

    return {
        department: {
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
    let { config: generalSettings, timetable } = department
    console.log(timetable);
    for (let i = 0; i < generalSettings.daysPerWeek; i++) {
        for (let j = 0; j < generalSettings.hoursPerDay; j++) {
            if (timetable[i] == null) timetable[i] = []
            if (timetable[i][j] == null) timetable[i][j] = null
        }
    }
    fs.writeFileSync(path.join(config.dataFolder, dir, config.files.timeTableFolder, config.files.timetableFile), JSON.stringify(timetable), { encoding: "utf-8" })
}
const setConfig = (dir: string, config: {}) => {
}

const remove = (dir: string) => {
    try {
        fs.rmSync(dir, { recursive: true, force: true })
        return true
    } catch (err) {
        console.log(err);
        return false
    }
}


export {
    create,
    exists,
    createRequiredFiles,
    remove,
    get
}