import Joi from "joi"




export const pathValidate = Joi.object(
    {
        name : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{2,30}$')).required().trim()
    }
)

