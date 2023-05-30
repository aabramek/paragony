import {useState, useContext} from "react"
import {useLocation} from "react-router-dom"
import Product from "./Product"
import AuthContext from "../context/AuthProvider"
import ReceiptFormHeader from "./ReceiptFormHeader"

function AddOrEditReceipt() {
	const {auth_userid, auth_token} = useContext(AuthContext)

	const {state} = useLocation()

	const [shopName, setShopName] = useState(state ? state.shop.name : "")
	const [shopCity, setShopCity] = useState(state ? state.shop.city : "")
	const [shopStreet, setShopStreet] = useState(state ? state.shop.street : "")
	
	const [datetime, setDatetime] = useState(state ? state.datetime : "")

	const [products, setProducts] = useState(state ? state.products : [])

	const [productName, setProductName] = useState("")
	const [productAmount, setProductAmount] = useState("")
	const [productPrice, setProductPrice] = useState("")
	const [productDiscount, setProductDiscount] = useState("")
	const [productTaxRate, setProductTaxRate] = useState("D")

	function addProduct() {
		const newProduct = {
			name: productName,
			amount: productAmount,
			price: productPrice,
			discount: productDiscount,
			taxRate: productTaxRate
		}

		if (productName && productAmount && productPrice) {
			setProducts([...products, newProduct])

			setProductName("")
			setProductAmount("")
			setProductPrice("")
			setProductDiscount("")
			setProductTaxRate("D")
		}
		else {
			alert("Podaj wszysztkie dane!")
		}
		
	}

	function submitForm(e) {
		e.preventDefault();

		const receipt = {
			shop: {
				name: shopName,
				city: shopCity,
				street: shopStreet
			},

			datetime: datetime,
			products: products,
			user_id: auth_userid
		}

		if (state) {
			receipt._id = state._id
		}

		const options = {
			method: state ? "PUT" : "POST",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Authorization": "Bearer " + auth_token
			},
			body: JSON.stringify(receipt)
		}

		fetch("http://127.0.0.1:8080/api/receipt", options)
			.then((response) => response.text())
			.then((str) => {
				resetForm()
			})
			.catch((error) => console.log(error))
	}

	function resetForm() {
		setShopName("")
		setShopCity("")
		setShopStreet("")
		setDatetime("")
		setProductName("")
		setProductAmount("")
		setProductPrice("")
		setProductDiscount("")
		setProductTaxRate("")
		setProducts([])
	}

	return (
		<div className="AddReceipt">
			<h1>Dodaj paragon</h1>
			
			<form onSubmit={submitForm} onReset={resetForm}>
				<ReceiptFormHeader
					shopName={shopName} setShopName={setShopName} 
					shopCity={shopCity} setShopCity={setShopCity}
					shopStreet={shopStreet} setShopStreet={setShopStreet}
					datetime={datetime} setDatetime={setDatetime}
					/>

				<fieldset>
					<legend>Lista produktów</legend>
						{products.length === 0 ? <p>Lista jest pusta</p> : ""}
						<table>
							<thead>
								<tr>
									<th>Produkt</th>
									<th>Ilość</th>
									<th>Cena</th>
									<th>Rabat</th>
									<th>Stawka VAT</th>
								</tr>
							</thead>
							<tbody>
								{products.map((product) => <Product product={product}/>)}
								<tr>
									<td><input type="text" id="productName" name="productName" onChange={(e) => setProductName(e.target.value)} value={productName} /></td>
									<td><input type="text" id="productAmount" name="productAmount" onChange={(e) => setProductAmount(e.target.value)} value={productAmount}  /></td>
									<td><input type="text" id="productPrice" name="productPrice" onChange={(e) => setProductPrice(e.target.value)} value={productPrice} /></td>
									<td><input type="text" id="productDiscount" name="productDiscount" onChange={(e) => setProductDiscount(e.target.value)} value={productDiscount} /></td>
									<td>
										<select type="text" id="productTaxRate" name="productTaxRate" onChange={(e) => setProductTaxRate(e.target.value)} value={productTaxRate}>
											<option value="D">D - 0%</option>
											<option value="B">B - 8%</option>
											<option value="A">A - 23%</option>
										</select>
									</td>
									<td>
										<button type="button" onClick={addProduct}>Dodaj produkt</button>
									</td>
								</tr>
							</tbody>
						</table>
				</fieldset>

				<input type="submit" value={state ? "Edytuj paragon" : "Dodaj paragon"} />
				<input type="reset" value="Wyczyść formularz" />
			</form>
		</div>
	)
}

export default AddOrEditReceipt