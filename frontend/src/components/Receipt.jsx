import {useParams} from "react-router-dom"
import {useContext} from "react"
import AuthContext from "../context/AuthProvider"

function Receipt() {
	const {id} = useParams()

	return (
		<h1>Paragon {id}</h1>
	)
}

export default Receipt