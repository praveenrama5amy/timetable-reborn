import { useEffect } from "react"
import { useAppDataContext } from "../context/AppDataContext"
import useAppData from "./useAppData"
import useAxiosPrivate from "./useAxiosPrivate"

const useConflict = () => {
    const axiosPrivate = useAxiosPrivate()
    const [profile] = useAppData().profile
    const [department, setDepartment] = useAppDataContext().department
    const [conflicts, setConflicts] = useAppDataContext().conflicts

    useEffect(() => {
        getConflict().then(data => {
            if (data.conflicts) {
                setConflicts(data.conflicts)
            }
        })
    }, [department])

    const getConflict = async () => {
        const res = await axiosPrivate.get(`/conflict/${profile}`)
        return res.data
    }

    return { getConflict }
}

export default useConflict