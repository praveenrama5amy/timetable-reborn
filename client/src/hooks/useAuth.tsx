import { useState, useContext, createContext, ReactNode, Dispatch, SetStateAction } from 'react';


interface UserContext {
    user: [boolean, Dispatch<SetStateAction<boolean>>],
}


const UserContext = createContext<UserContext>({
    user: [true, () => { return null }],
})

export const useUserContext = () => {
    return useContext(UserContext)
}


const UserProvider = ({ children }: { children: ReactNode }) => {
    const user = useState<boolean>(true);

    return <UserContext.Provider value={{
        user,
    }}>
        {children}
    </UserContext.Provider>
}


export default UserProvider