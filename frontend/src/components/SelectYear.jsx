import {useState, useContext} from "react"
import YearRangeContext from "../context/YearRangeContext"

function SelectYear({onChange}) {
	const { minYear, maxYear } = useContext(YearRangeContext)
	const years = Array.from({length: (maxYear - minYear) + 1}, (value, index) => minYear + index)

	return (
		<select onChange={e => onChange(e)}>
			<option value="">Wszystkie lata</option>
			{
				years.map(element => <option value={element}>{element}</option>)
			}
		</select>
	)
}

export default SelectYear