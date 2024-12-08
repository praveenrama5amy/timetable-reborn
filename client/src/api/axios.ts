import axios from "axios"


const url = `${location.protocol}//${location.hostname}`

const apiPort = 3000


const Axios = axios.create({
    baseURL: `${url}:${apiPort}`,
})

export const AxiosPrivate = axios.create({
    baseURL: `${url}:${apiPort}`,
})

export default Axios