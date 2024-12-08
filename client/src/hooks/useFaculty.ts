import { FacultyType } from "../context/AppDataContext"
import useAppData from "./useAppData"
import useAxiosPrivate from "./useAxiosPrivate"

const useFaculty = () => {
    const axiosPrivate = useAxiosPrivate()
    const [profile] = useAppData().profile
    const add = async (faculty: { name: FacultyType['name'], min: FacultyType['min'], max: FacultyType['max'] }) => {
        const res = await axiosPrivate.post("/faculty/", { department: profile, faculty })
        return res.data
    }
    const remove = async (id: FacultyType['id']) => {
        const res = await axiosPrivate.delete("/faculty/", {
            data: {
                department: profile,
                id
            }
        })
        return res.data
    }
    const edit = async (id: FacultyType['id'], faculty: {
        name?: FacultyType['name'],
        min?: FacultyType['min'],
        max?: FacultyType['max'],
        busy?: FacultyType['busy'],
    }) => {
        const res = await axiosPrivate.put("/faculty/", { ...faculty, department: profile, id })
        return res.data
    }

    return { add, remove, edit }
}

export default useFaculty