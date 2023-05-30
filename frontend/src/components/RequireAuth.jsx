import {useContext} from "react"
import {Navigate} from "react-router-dom"
import AuthContext from "../context/AuthProvider"

function RequireAuth({children}) {
	const {auth_token} = useContext(AuthContext)
	
	return (
		auth_token === "" ? <Navigate to="/login" /> : children
	)
}

export default RequireAuth