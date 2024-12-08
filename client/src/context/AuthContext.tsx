
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
    const token = useState<AuthContext['token'][0]>("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJQcmF2ZWVuIiwiZW1haWwiOiJwcmF2ZWVucmFtYXNhbXkxMjNAZ21haWwuY29tIiwiYXZhdGFyIjoiIiwiaWF0IjoxNzMzNjQ5Mjg5LCJleHAiOjE3MzQ1MTMyODl9.LAod7w76zjz9_X2e3iaE1DVTWdWy1jD2hQqakj4r4S3GtIGqy-07Ukaa5__2dC_vZTMWq3cXjbf8DWqlR6lauH_NhWwAkO_QGf-Y_yPBrbLQvYhENA_WNvxjNGgveI-gIKPzFCjNtk2n90i37jS0Re3gcqiqaRYScslq78bC5SD-FGNaeTwlwqz8EHxnId8fCS2CvXrWRSukn_F8ckCqXH83TqKwa5wFlo64r1Hx3d8hnWQKtpRtaVVn08KAM5ZqeCosNJ6EWpEL45jHfqfQoCXoHsA52eXu_nayAtCe0h8Ul22YH10JmvOSkRNAnXCXeykptjkHjOaysIzNbti-ew");


    return <AuthContext.Provider value={{
        user,
        token
    }}>
        {children}
    </AuthContext.Provider>
}


export default AuthProvider