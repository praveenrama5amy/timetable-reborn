
import { ConflictInterface } from "../types/interface";
import * as Department from "./department"

const validateEntries = (dir: string) => {
    const { error, department } = Department.get(dir)
    if (error) return { error }
    let conflicts: Array<ConflictInterface> = [];
    //Class Hour Allotment Check
    const allotmentNeeded = department.config.daysPerWeek * department.config.hoursPerDay
    department.classes.forEach(room => {
        const alloted = 0

    })

    return { conflicts }
}


export {
    validateEntries
}