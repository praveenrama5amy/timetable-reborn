import { useAppDataContext } from "../context/AppDataContext"
import useAxiosPrivate from "./useAxiosPrivate"

const useAppData = () => {
    const { conflicts, department, departments, loading, profile } = useAppDataContext()
    const axiosPrivate = useAxiosPrivate()
    const fetchDepatments = async () => {
        try {
            const res = await axiosPrivate.get("/department/all")
            departments[1](res.data.departments || [])
            return res.data.departments
        }
        catch (err) {
            console.error(err)
            return err
        }
    }
    const fetchDepatment = async (name: string) => {
        try {
            const res = await axiosPrivate.get(`/department/${name}`)
            department[1](res.data.department || null)
            return res.data.department
        }
        catch (err) {
            console.error(err)
            return err
        }
    }
    const createDepartment = async (name: string) => {
        const res = await axiosPrivate.post("/department/create", { name })
        if (res.data.status) await fetchDepatments()
        return res
    }
    const deleteDepartment = async (name: string) => {
        const res = await axiosPrivate.delete(`/department/${name}`)
        if (res.data.status) await fetchDepatments()
        return res
    }

    return {
        conflicts, department, departments, loading, profile,

        fetchDepatments, fetchDepatment, createDepartment, deleteDepartment

    }
}

export default useAppData;