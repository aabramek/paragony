import {useState, useContext} from "react"
import {useLocation} from "react-router-dom"
import Product from "./Product"
import ProductEditable from "./ProductEditable"
import AuthContext from "../context/AuthProvider"
import {FiPlusCircle, FiFilePlus, FiTrash2} from "react-icons/fi"
import {nanoid} from "nanoid"

var Decimal = require("decimal.js-light")

function AddOrEditReceipt() {
	const {auth_userid, auth_token} = useContext(AuthContext)

	const {state} = useLocation()

	const [shopName, setShopName] = useState(state ? state.shop.name : "")
	const [shopCity, setShopCity] = useState(state ? state.shop.city : "")
	const [shopStreet, setShopStreet] = useState(state ? state.shop.street : "")
	
	const [date, setDate] = useState(state ? state.date : "")
	const [time, setTime] = useState(state ? state.time : "")

	const [products, setProducts] = useState(state ? state.products : [])

	const [productName, setProductName] = useState("")
	const [productAmount, setProductAmount] = useState("")
	const [productPrice, setProductPrice] = useState("")
	const [productDiscount, setProductDiscount] = useState("")
	const [productTaxRate, setProductTaxRate] = useState("D")

	function addProduct() {
		if (!(productName && productAmount && productPrice)) {
			alert("Podaj wszysztkie dane!")
			return
		}

		const newProduct = {
			name: productName,
			amount: productAmount,
			price: productPrice,
			discount: productDiscount,
			taxRate: productTaxRate,
			id: nanoid()
		}

		setProducts(currentValue => [...currentValue, newProduct])

		setProductName("")
		setProductAmount("")
		setProductPrice("")
		setProductDiscount("")
		setProductTaxRate("D")
	}

	function updateProduct(id, property, value) {
		const p = products.map(product => {
			if (product.id == id || product._id == id) {
				switch (property) {
					case "name": product.name = value; break;
					case "amount": product.amount = value; break;
					case "price": product.price = value; break;
					case "discount": product.discount = value; break;
					case "taxRate": product.taxRate = value; break; 
				}
			}
			return product
		})
		setProducts(p)
	}

	function deleteProduct(id) {
		setProducts(products.filter(product => product.id != id && product._id != id))
	}

	function submitForm(e) {
		e.preventDefault();

		const receipt = {
			shop: {
				name: shopName,
				city: shopCity,
				street: shopStreet
			},
			date: date,
			time: time,
			products: products.map(product => {
				if (product.id) {
					delete product.id
				}
				product.amount = new Decimal(product.amount ? product.amount : 0)
				product.price = new Decimal(product.price ? product.price : 0)
				product.discount = new Decimal(product.discount ? product.discount : 0)
				return product
			}),
			total: products.reduce((acc, product) => acc.plus(product.price.times(product.amount)).minus(product.discount), new Decimal(0)).toDecimalPlaces(2).toString(),
			user_id: auth_userid
		}

		if (state) {
			receipt._id = state._id
		}

		const options = {
			method: state ? "PUT" : "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + auth_token
			},
			body: JSON.stringify(receipt)
		}

		fetch(`http://${process.env.REACT_APP_BACKEND_ADDRESS}:${process.env.REACT_APP_BACKEND_PORT}/api/receipt`, options)
			.then(response => response.json())
			.then(json => {
				if (json.message) {
					alert(json.message)
				}
				else {
					resetForm()
				}
			})
			.catch(error => console.log(error))
	}

	function resetForm() {
		setShopName("")
		setShopCity("")
		setShopStreet("")
		setDate("")
		setTime("")
		setProductName("")
		setProductAmount("")
		setProductPrice("")
		setProductDiscount("")
		setProductTaxRate("D")
		setProducts([])
	}

	return (
		<div className="AddReceipt">
		<h2>Wprowadź dane</h2>			
			<form onSubmit={submitForm} onReset={resetForm}>
				<fieldset>
					<legend>Dane zakupu</legend>
					<p>
						<label htmlFor="shopName">Nazwa sklepu</label>
						<input type="text" name="shopName" id="shopName" value={shopName} onChange={e => setShopName(e.target.value)} required={true} />
					</p>

					<p>		
						<label htmlFor="shopCity">Miejscowość</label>
						<input type="text" name="shopCity" id="shopCity" value={shopCity} onChange={e => setShopCity(e.target.value)} required={true} />
					</p>

					<p>
						<label htmlFor="shopStreet">Ulica</label>
						<input type="text" name="shopStreet" id="shopStreet" value={shopStreet} onChange={e => setShopStreet(e.target.value)} required={true} />
					</p>

					<p>
						<label htmlFor="date">Data</label>
						<input type="date" name="date" id="date" value={date} onChange={e => {setDate(e.target.value)}} required={true} />
					</p>

					<p>
						<label htmlFor="time">Godzina</label>
						<input type="time" name="time" id="time" value={time} onChange={e => {setTime(e.target.value)}} required={true} />
					</p>
				</fieldset>

				<fieldset>
					<legend>Lista produktów</legend>
						{products.length === 0 ? <p>Lista jest pusta</p> : ""}
						<table className="products">
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
								{
									products.map(product => <ProductEditable
										key={product._id ? product._id : product.id} 
										product={product}
										onProductUpdate={updateProduct}
										onProductDelete={deleteProduct}
									/>)
								}
							</tbody>
							<tfoot>
								<tr className="new-product">
									<td><input type="text" id="productName" name="productName" onChange={e => setProductName(e.target.value)} value={productName} /></td>
									<td><input type="number" min="1" id="productAmount" name="productAmount" onChange={e => setProductAmount(e.target.value)} value={productAmount}  /></td>
									<td><input type="number" id="productPrice" name="productPrice" onChange={e => setProductPrice(e.target.value)} value={productPrice} /></td>
									<td><input type="number" id="productDiscount" name="productDiscount" onChange={e => setProductDiscount(e.target.value)} value={productDiscount} /></td>
									<td>
										<select id="productTaxRate" name="productTaxRate" onChange={e => setProductTaxRate(e.target.value)} value={productTaxRate}>
											<option value="D">D - 0%</option>
											<option value="C">C - 0%</option>
											<option value="B">B - 8%</option>
											<option value="A">A - 23%</option>
										</select>
									</td>
									<td>
										<button type="button" className="btn-edit" onClick={addProduct}>Dodaj produkt <FiPlusCircle /></button>
									</td>
								</tr>
							</tfoot>
						</table>
				</fieldset>

				<button type="submit" className="btn-accept">{state ? "Zatwierdź zmiany" : "Dodaj paragon"} <FiFilePlus /></button>
				<button type="reset" className="btn-delete">Wyczyść formularz <FiTrash2 /></button>
			</form>
		</div>
	)
}

export default AddOrEditReceipt