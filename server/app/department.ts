import fs from "fs"
const DEFAULT = {
    CONFIG: {
        daysPerWeek: 5,
        hoursPerDay: 6
    }
}


const create = (name: string) => {
    try {
        name = name.toUpperCase();
        fs.mkdirSync(`./data/${name}`, { recursive: true })
        createRequiredFiles(name)
        return true
    }
    catch (err) {
        console.log(err);
        return false
    }
}
const exists = (name:string) => {
    const folders = fs.readdirSync("./data")
    if (folders.find(dept => dept == name)) {
        return true
    }
    return false
}
console.log(exists("MCA"));


const createRequiredFiles = (deptName:string) => {
    try {
        fs.writeFileSync(`./data/${deptName}/config.json`,JSON.stringify(DEFAULT.CONFIG),{encoding:"utf-8"})
        fs.writeFileSync(`./data/${deptName}/classes.json`,"[]",{encoding:"utf-8"})
        fs.writeFileSync(`./data/${deptName}/faculties.json`,"[]",{encoding:"utf-8"})
        fs.writeFileSync(`./data/${deptName}/subjects.json`,"[]",{encoding:"utf-8"})
        fs.writeFileSync(`./data/${deptName}/timetable.json`,"[]",{encoding:"utf-8"})
    } catch (err) {
        console.log(err);
        return false
        
    }
}
const initializeTimetableFile = (deptName:string) => {
    
}

const remove = (name: string) => {
    try {
        fs.rmSync(`./data/${name}`,{recursive:true,force:true})
        return true
    } catch (err) {
        console.log(err);
        return false
    }
}


export {
    create,
    remove
}