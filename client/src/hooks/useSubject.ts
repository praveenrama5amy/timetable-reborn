import { SubjectType } from "../context/AppDataContext"
import useAppData from "./useAppData"
import useAxiosPrivate from "./useAxiosPrivate"

const useSubject = () => {
    const axiosPrivate = useAxiosPrivate()
    const [profile] = useAppData().profile
    const add = async (subject: {
        name: SubjectType['name'],
        hoursPerWeek: SubjectType['hoursPerWeek'],
        consecutive: SubjectType['consecutive'],
        priority: SubjectType['priority'],
        before?: SubjectType['before'],
        after?: SubjectType['after']
    }) => {
        const res = await axiosPrivate.post("/subject/", { department: profile, subject })
        return res.data
    }
    const remove = async (id: SubjectType['id']) => {
        const res = await axiosPrivate.delete("/subject/", {
            data: {
                department: profile,
                id
            }
        })
        return res.data
    }
    const edit = async (id: SubjectType['id'], subject: {
        name?: SubjectType['name'],
        min?: SubjectType['after'],
        max?: SubjectType['before'],
        consecutive?: SubjectType['consecutive'],
        hoursPerWeek?: SubjectType['hoursPerWeek'],
        priority?: SubjectType['priority'],
    }) => {
        const res = await axiosPrivate.put("/subject/", { ...subject, department: profile, id })
        return res.data
    }

    return { add, remove, edit }
}

export default useSubject