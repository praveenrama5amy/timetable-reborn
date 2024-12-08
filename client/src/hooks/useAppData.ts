
import { useEffect } from "react"
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
            department[1](res.data.department || [])
            return res.data.department
        }
        catch (err) {
            console.error(err)
            return err
        }
    }
    const fetchConflicts = (name: string) => {

    }

    return {
        conflicts, department, departments, loading, profile,

        fetchDepatments, fetchDepatment, fetchConflicts

    }
}

export default useAppData;