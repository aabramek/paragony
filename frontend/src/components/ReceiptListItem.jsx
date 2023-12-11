import Product from "./Product"
import {Link} from "react-router-dom"
import {FiEdit, FiTrash2} from "react-icons/fi"

var Decimal = require("decimal.js-light")

function ReceiptListItem({receipt, onDelete}) {
	return (
		<div className="receipt-list-item">
			<p>
				{receipt.shop.name}
				<br />
				{receipt.shop.city} {receipt.shop.street}
				<br />
				{receipt.date} {receipt.time}
			</p>
			<table>
				<thead>
					<tr>
						<th>Nazwa produktu</th>
						<th>Ilość</th>
						<th>Cena</th>
						<th>Zniżka</th>
						<th>Stawka vat</th>
					</tr>
				</thead>
				<tbody>
					{receipt.products.map(product => <Product key={product._id} product={product} />)}
				</tbody>
				<tfoot>
					<tr>
						<td colSpan="4">Łączny koszt</td>
						<td>{new Decimal(receipt.total).toFixed(2).toString()}</td>
					</tr>
				</tfoot>
			</table>
			<p>
				<Link to={"/receipt/edit/"} state={receipt}><button className="btn-edit">Edytuj <FiEdit/></button></Link>
				<button className="btn-delete" onClick={() => onDelete(receipt._id)}>Usuń <FiTrash2/></button>
			</p>
		</div>
	)
}

export default ReceiptListItem