import { useState, useContext, createContext, ReactNode, Dispatch, SetStateAction } from 'react';


interface UserContext {
    loading: [boolean, Dispatch<SetStateAction<boolean>>],
}


const UserContext = createContext<UserContext>({
    loading: [true, () => { return null }],
})

export const useUserContext = () => {
    return useContext(UserContext)
}


const UserProvider = ({ children }: { children: ReactNode }) => {
    const loading = useState<boolean>(true);

    return <UserContext.Provider value={{
        loading,
    }}>
        {children}
    </UserContext.Provider>
}


export default UserProvider