import { ClassType, SubjectType } from "../context/AppDataContext"
import useAppData from "./useAppData"
import useAxiosPrivate from "./useAxiosPrivate"

const useTimetable = () => {
    const axiosPrivate = useAxiosPrivate()
    const [profile] = useAppData().profile

    const assign = async (classId: ClassType['id'], subjectId: SubjectType['id'], day: number, hour: number) => {
        const res = await axiosPrivate.put("/timetable/assign", { name: profile, classId, subjectId, day, hour })
        return res.data
    }
    const unassign = async (classId: ClassType['id'], day: number, hour: number) => {
        const res = await axiosPrivate.delete("/timetable/assign", { data: { name: profile, classId, day, hour } })
        return res.data
    }
    const autoGenerate = (data: { classId: ClassType['id'], day: number, hour: number }[]) => {
        return axiosPrivate.put("/timetable/autogenerate", { name: profile, hours: data })
    }
    return { assign, unassign, autoGenerate }
}

export default useTimetable