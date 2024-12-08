import { useEffect } from "react"
import { useAuthContext } from "../context/AuthContext"
import axios from "../api/axios"

const useAuth = () => {
    const [user, setUser] = useAuthContext().user
    const [token, setToken] = useAuthContext().token
    useEffect(() => {
        if (token == null) return
        axios.get("/user/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data && res.data.user) {
                setUser(res.data.user)
            } else {
                console.log(res.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }, [token])

    return {
        user, setUser, token, setToken

    }
}

export default useAuth