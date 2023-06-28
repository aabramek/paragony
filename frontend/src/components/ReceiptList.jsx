import {useState, useContext, useEffect} from "react"
import {useParams} from "react-router-dom"
import Product from "./Product"
import AuthContext from "../context/AuthProvider"
import ReceiptListItem from "./ReceiptListItem"
import {FiSearch, FiChevronLeft, FiChevronRight} from "react-icons/fi"

function ReceiptList() {
	const {auth_userid, auth_token} = useContext(AuthContext)
	const [receipts, setReceipts] = useState([])

	const [shopName, setShopName] = useState("")
	const [shopCity, setShopCity] = useState("")
	const [shopStreet, setShopStreet] = useState("")
	const [useRegex, setUseRegex] = useState(false)

	const [dateFrom, setDateFrom] = useState("")
	const [dateTo, setDateTo] = useState("")
	const [timeFrom, setTimeFrom] = useState("")
	const [timeTo, setTimeTo] = useState("")
	const [timeAndDateMutuality, setTimeAndDateMutuality] = useState(false)

	const [currentPage, setCurrentPage] = useState(1)
	const [numberOfPages, setNumberOfPages] = useState(0)

	const [switchPage, setSwitchPage] = useState(false)

	function deleteReceipt(i) {
		if (!window.confirm("Czy na pewno chcesz usunąć ten paragon ?")) {
			return
		}

		const options = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Authorization": "Bearer " + auth_token
			},
			body: JSON.stringify({receipt_id: i})
		}

		fetch(`http://${process.env.REACT_APP_BACKEND_ADDRESS}:${process.env.REACT_APP_BACKEND_PORT}/api/receipt`, options)
			.then(response => response.json())
			.then(json => {if (json === null) console.log("z bazy nic nie usunieto")})
			.catch(error => console.log(error))

		const filteredReceipts = receipts.filter((receipt) => receipt._id != i)

		if (filteredReceipts.length === 0) {
			setCurrentPage(cv => Math.max(cv - 1, 1));
			loadData()
		}
		else {
			setReceipts(filteredReceipts)
		}
	}

	function createQueryString() {
		let query_string = `?page=${switchPage ? currentPage : 1}&pageSize=${process.env.REACT_APP_PAGE_SIZE}`
		if (shopName !== "") {
			query_string += "&shop.name=" + shopName
		}
		if (shopCity !== "") {
			query_string += "&shop.city=" + shopCity
		}
		if (shopStreet !== "") {
			query_string += "&shop.street=" + shopStreet
		}
		if (useRegex) {
			query_string += "&useRegex=true"
		}
		if (dateFrom !== "") {
			query_string += "&dateFrom=" + dateFrom
		}
		if (dateTo !== "") {
			query_string += "&dateTo=" + dateTo
		}
		if (timeFrom !== "") {
			query_string += "&timeFrom=" + timeFrom
		}
		if (timeTo !== "") {
			query_string += "&timeTo=" + timeTo
		}
		if (timeAndDateMutuality) {
			query_string += "&timeAndDateMutuality=true"
		}
		return query_string
	}

	function loadData() {
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + auth_token
			}
		}

		fetch(`http://${process.env.REACT_APP_BACKEND_ADDRESS}:${process.env.REACT_APP_BACKEND_PORT}/api/receipt` + createQueryString(), options)
			.then(response => response.json())
			.then(json => {
				setReceipts(json.receipts)
				if (!switchPage) {
					setCurrentPage(1)
				}
				else {
					setSwitchPage(false)
				}
				setNumberOfPages(json.numberOfPages)
				if (json.receipts.length == 0) {
					alert("Brak wyników, spróbuj zmienić filtry wyszukiwania")
				}
			})
			.catch(error => console.log(error))
	}

	function resetForm(e) {
		e.preventDefault()
		setShopName("")
		setShopCity("")
		setShopStreet("")
		setUseRegex(false)
		setDateFrom("")
		setDateTo("")
		setTimeFrom("")
		setTimeTo("")
		setTimeAndDateMutuality(false)
	}

	useEffect(() => loadData(), [])

	return (
		<div className="receipt-list">
			<form onSubmit={e => {e.preventDefault(); loadData()}}>
				<h2>Filtry wyszukiwania</h2>
				<fieldset>
					<legend>Dane zakupu</legend>

					<p>
						<label htmlFor="shopName">Nazwa sklepu</label>
						<input type="text" name="shopName" id="shopName" value={shopName} onChange={e => setShopName(e.target.value)} />
					</p>

					<p>		
						<label htmlFor="shopCity">Miejscowość</label>
						<input type="text" name="shopCity" id="shopCity" value={shopCity} onChange={e => setShopCity(e.target.value)} />
					</p>

					<p>
						<label htmlFor="shopStreet">Ulica</label>
						<input type="text" name="shopStreet" id="shopStreet" value={shopStreet} onChange={e => setShopStreet(e.target.value)} />
					</p>

					<p>
						<label htmlFor="useRegex">Czy używać wyrażeń regularnych ?</label>
						<input type="checkbox" name="useRegex" id="useRegex" checked={useRegex} onChange={e => setUseRegex(cv => !cv)} />
					</p>

					<p>
						Data			
						<br />
						<label htmlFor="dateFrom">od:</label>
						<input type="date" name="dateFrom" id="dateFrom" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
						
						<label htmlFor="dateTo">do:</label>
						<input type="date" name="dateTo" id="dateTo" value={dateTo} onChange={e => setDateTo(e.target.value)} />
					</p>

					<p>
						Godzina
						<br />
						<label htmlFor="timeFrom">Od:</label>
						<input type="time" name="timeFrom" id="timeFrom" value={timeFrom} onChange={e => setTimeFrom(e.target.value)} />
						
						<label htmlFor="timeTo">Do:</label>
						<input type="time" name="timeTo" id="timeTo" value={timeTo} onChange={e => setTimeTo(e.target.value)} />
					</p>

					<p>
						<label htmlFor="timeAndDateMutuality">Czy traktować datę i godzinę wspólnie ?</label>
						<input type="checkbox" name="timeAndDateMutuality" id="timeAndDateMutuality" value={timeAndDateMutuality} onChange={e => setTimeAndDateMutuality(cv => !cv)} />
					</p>
				</fieldset>

				<div className="search-form-controls">
					<div className="buttons">
						<button className="btn-search" type="submit">Szukaj <FiSearch /></button>
						<button className="btn-edit" type="reset" onClick={resetForm}>Resetuj ustawienia</button>
					</div>

					<div className="pagination-menu">
					 	<button onClick={() => {setCurrentPage(cv => Math.max(cv - 1, 1)); setSwitchPage(true)}} style={{visibility: currentPage > 1 ? "visible" : "hidden"}}><FiChevronLeft /></button>
						<span><b>{currentPage}</b> / {numberOfPages}</span>
						<button onClick={() => {setCurrentPage(cv => Math.min(cv + 1, numberOfPages)); setSwitchPage(true)}} style={{visibility: currentPage < numberOfPages ? "visible" : "hidden"}}><FiChevronRight /></button>
					</div>
				</div>
			</form>
			<h2>Wyniki wyszukiwania</h2>
			{
				receipts.length == 0 ?
				<p>Lista pusta</p>
				:
				receipts.map(receipt => <ReceiptListItem key={receipt._id} receipt={receipt} onDelete={deleteReceipt}/>)
			}
		</div>
	)
}

export default ReceiptList
