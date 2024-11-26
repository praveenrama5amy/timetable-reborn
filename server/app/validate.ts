import Joi, { number } from "joi"




export const pathValidate = Joi.object(
    {
        name: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim()
    }
)



export const departmentReq = {
    config: Joi.object({
        name: Joi.string().required().trim(),
        daysPerWeek: Joi.number(),
        hoursPerDay: Joi.number(),
    }).or('daysPerWeek', 'hoursPerDay')
}

export const classReq = {
    create: Joi.object({
        department: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim(),
        name: Joi.string().required().trim(),
    }),
    remove: Joi.object({
        department: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim(),
        id: Joi.number().required(),
    }),
    edit: Joi.object({
        department: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim(),
        id: Joi.number().required(),
        name: Joi.string().required().trim(),
    }),
    addSubject: Joi.object({
        department: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim(),
        classId: Joi.number().required(),
        subjectId: Joi.number().required(),
        facultyIds: Joi.array().items(Joi.number()).required()
    }),
    removeSubject: Joi.object({
        department: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim(),
        classId: Joi.number().required(),
        subjectId: Joi.number().required(),
    })
}

export const facultyReq = {
    create: Joi.object({
        department: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim(),
        faculty: Joi.object({
            name: Joi.string().required().trim(),
            min: Joi.number().required(),
            max: Joi.number().required()
        }).required()
    }),
    remove: Joi.object({
        department: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim(),
        id: Joi.number().required(),
    }),
    edit: Joi.object({
        department: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim(),
        id: Joi.number().required(),
        name: Joi.string().trim(),
        min: Joi.number(),
        max: Joi.number()
    }).or("min", "max", "name")

}
export const subjectReq = {
    create: Joi.object({
        department: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim(),
        subject: Joi.object({
            name: Joi.string().required().trim(),
            min: Joi.number().required(),
            max: Joi.number().required()
        }).required()
    }),
    remove: Joi.object({
        department: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim(),
        id: Joi.number().required(),
    }),
    edit: Joi.object({
        department: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim(),
        id: Joi.number().required(),
        name: Joi.string().trim(),
        min: Joi.number(),
        max: Joi.number()
    }).or("min", "max", "name")

}