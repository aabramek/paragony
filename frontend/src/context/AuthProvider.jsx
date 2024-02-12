import { createContext, useState } from "react"

const AuthContext = createContext("")

export function AuthProvider({ children }) {
	const [auth_token, setAuthToken] = useState("")
	const [auth_userid, setAuthUserID] = useState("")

	return (
		<AuthContext.Provider value={{ auth_token, setAuthToken, auth_userid, setAuthUserID }}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContext