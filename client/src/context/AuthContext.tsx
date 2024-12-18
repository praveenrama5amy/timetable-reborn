
import { useState, useContext, createContext, ReactNode, Dispatch, SetStateAction } from 'react';


export interface User {
    id: number,
    name: string,
    email: string,
    avatar: string
}

export interface UserPayload extends User {
    iat: number,
    exp: number
}


interface AuthContext {
    user: [UserPayload | null, Dispatch<SetStateAction<UserPayload | null>>],
    token: [string | null, Dispatch<SetStateAction<string | null>>]
}


const AuthContext = createContext<AuthContext>({
    user: [null, () => { return null }],
    token: [
        null,
        () => { return null }
    ],
})

export const useAuthContext = () => {
    return useContext(AuthContext)
}


const AuthProvider = ({ children }: { children: ReactNode }) => {
    const user = useState<AuthContext['user'][0]>(null);
    const token = useState<AuthContext['token'][0]>("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJQcmF2ZWVuIiwiZW1haWwiOiJwcmF2ZWVucmFtYXNhbXkxMjNAZ21haWwuY29tIiwiYXZhdGFyIjoiIiwiaWF0IjoxNzM0NTQ1MjU1fQ.ZnEQlbYefKQ7mMHCyP3kTaSb6wXArB5kXSBNvDpse8p9M2P4-HExiEThVfgTGVLagrt0kCu7IK41FcatUCWR9_DxRwjOfxCVojdd1tlQ7zx0rk-1B68l71n_hFlckO5pGGCfnEL6QI2HKyA3OywqH7_AfF79aU_jFXB-vYa6tMZ_B9D8UGflAgi2KNeNwadvSBgRnBpW5pvOg39-MDTe8Mye4TIGXjzN53DAhmvMLyjSRUXGg2Yl8Fy6vaKFHswCq5WEEU5smEk6S-7JCwYC_bB53XiuyeJ-Hu_0HgIPaAPxQBEricSmzurJhTwzaKtnIrgF__NXszTlRXOhDWjYlA");


    return <AuthContext.Provider value={{
        user,
        token
    }}>
        {children}
    </AuthContext.Provider>
}


export default AuthProvider