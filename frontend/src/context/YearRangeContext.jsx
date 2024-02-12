import { createContext, useState, useEffect, useContext } from "react"
import AuthContext from "./AuthProvider"

const YearRangeContext = createContext()

export function YearRangeProvider({ children }) {
	const [minYear, setMinYear] = useState(0)
	const [maxYear, setMaxYear] = useState(0)
	const { auth_token, auth_userid } = useContext(AuthContext)

	function loadYearRange() {
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + auth_token
			}
		}

		fetch(`http://${process.env.REACT_APP_ADDRESS}/api/statistic/purchases_years`, options)
			.then(response => response.json())
			.then(json => {
				setMinYear(parseInt(json[0]))
				setMaxYear(parseInt(json[1]))
			})
			.catch(error => console.log(error))		
	}

	useEffect(loadYearRange, [])

	return (
		<YearRangeContext.Provider value={ { minYear, maxYear } }>
			{ children }
		</YearRangeContext.Provider>
	)
}

export default YearRangeContext
