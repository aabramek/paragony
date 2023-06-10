import {useState, useContext} from "react"
import {useParams} from "react-router-dom"
import Product from "./Product"
import AuthContext from "../context/AuthProvider"
import ReceiptFormHeader from "./ReceiptFormHeader"
import ReceiptListItem from "./ReceiptListItem"
import {FiSearch} from "react-icons/fi"

function ReceiptList() {
	const {auth_userid, auth_token} = useContext(AuthContext)
	const [receipts, setReceipts] = useState([])

	const [shopName, setShopName] = useState("")
	const [shopCity, setShopCity] = useState("")
	const [shopStreet, setShopStreet] = useState("")
	
	const [datetime, setDatetime] = useState()

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
			.then((response) => response.json())
			.then((json) => {
				if (json === null) {
					console.log("z bazy nic nie usunieto")
					return
				}
			})
			.catch((error) => {
				console.log(error)
				return
			})

		setReceipts(receipts.filter((receipt) => receipt._id != i))
	}

	function createQueryString() {
		let query_string = "?"
		if (shopName !== "") {
			query_string += "shop.name=" + shopName + "&"
		}
		if (shopCity !== "") {
			query_string += "shop.city=" + shopCity + "&"
		}
		if (shopStreet !== "") {
			query_string += "shop.street=" + shopStreet + "&"
		}
		if (datetime !== undefined) {
			query_string += "datetime=" + datetime + "&" 
		}
		return query_string.slice(0, query_string.length - 1)
	}

	function submitForm(e) {
		e.preventDefault()

		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Authorization": "Bearer " + auth_token
			}
		}

		fetch(`http://${process.env.REACT_APP_BACKEND_ADDRESS}:${process.env.REACT_APP_BACKEND_PORT}/api/receipt` + createQueryString(), options)
			.then((response) => response.json())
			.then((docs) => {
				setReceipts(docs)
				if (docs.length === 0) {
					alert("Brak wyników, spróbuj zmienić filtry wyszukiwania")
				}
			})
			.catch((error) => console.log(error))
	}

	return (
		<div className="receipt-list">
			<form onSubmit={submitForm}>
				<h2>Filtry wyszukiwania</h2>
				<ReceiptFormHeader
					shopName={shopName} setShopName={setShopName} 
					shopCity={shopCity} setShopCity={setShopCity}
					shopStreet={shopStreet} setShopStreet={setShopStreet}
					datetime={datetime} setDatetime={setDatetime}
					/>

				<button className="btn-search">Szukaj <FiSearch /></button>
			</form>
			<h2>Wyniki wyszukiwania</h2>
			{
				receipts.length == 0 ?
				<p>Lista pusta</p>
				:
				receipts.map((receipt) => <ReceiptListItem key={receipt._id} receipt={receipt} onDelete={deleteReceipt}/>)
			}
		</div>
	)
}

export default ReceiptList
