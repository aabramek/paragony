import {useState, useContext} from "react"
import {useNavigate} from "react-router-dom"
import AuthContext from "../context/AuthProvider"

function Login({action}) {
	const {setAuthToken, setAuthUserID} = useContext(AuthContext)

	const navigate = useNavigate()

	if (action === "logout") {
		setAuthToken("")
		navigate("/")
	}

	const [username, setLogin] = useState("")
	const [password, setPassword] = useState("")	

	function handle_login(json) {
		if (json.message !== "Logged in successfully") {
			window.alert("Nie udało się zalogować")
			return
		}
		setAuthToken(json.token)
		setAuthUserID(json.user_id)
		navigate("/", {replace: true})
	} 

	function handle_register(json) {
		if (json.message !== "User created successfully") {
			window.alert("Nie udało się zarejestrować")
			return
		}

		navigate("/login")
	}

	function submitForm(e) {
		e.preventDefault()

		const options = {
			method: "POST",
			
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			},
			
			body: JSON.stringify({
				username: username,
				password: password
			})
		}

		fetch("http://127.0.0.1:8080/api/user/" + (action === "login" ? "login" : "register"), options)
			.then((response) => response.json())
			.then((json) => {
				if (action === "login") {
					handle_login(json)
				}
				else {
					handle_register("json")
				}
			})
			.catch((error) => console.log(error))
	}

	return (
		<div className="login">
			<form onSubmit={submitForm}>
				<input type="text" name="username" placeholder="Login" value={username} onChange={(e) => setLogin(e.target.value)} />
				<input type="password" name="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
				<input type="submit" value={action === "login" ? "Zaloguj się" : "Zarejestruj się"}/>
			</form>
		</div>
	)
}

export default Login