import { useEffect } from "react"
import { AxiosPrivate } from "../api/axios"
import { useAuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router"

const useAxiosPrivate = () => {
    const [token, setToken] = useAuthContext().token
    const navigate = useNavigate()

    useEffect(() => {
        AxiosPrivate.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${token}`
            return config
        }, error => {
            Promise.reject(error)
        })
        AxiosPrivate.interceptors.response.use(res => res, err => {
            if (err.response.status === 401) {
                setToken(null)
                navigate("/auth/login")
                return Promise.reject(err)
            }
            return Promise.reject(err)
        })
    }, [token])
    return AxiosPrivate
}

export default useAxiosPrivate