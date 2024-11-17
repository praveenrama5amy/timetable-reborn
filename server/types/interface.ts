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