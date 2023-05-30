import Product from "./Product"
import {Link} from "react-router-dom"
import {FiEdit, FiTrash2} from "react-icons/fi"

function ReceiptListItem({receipt, onDelete}) {
	return (
		<div className="receipt-list-item">
			<p>
				{receipt.shop.name}
				<br />
				{receipt.shop.city} {receipt.shop.street}
				<br />
				{receipt.datetime}
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
					{receipt.products.map((product) => <Product key={product._id} product={product}/>)}
				</tbody>
			</table>
			<p>
				<Link to={"/receipt/edit/"} state={receipt}><button>Edytuj <FiEdit/></button></Link>
				<button onClick={() => onDelete(receipt._id)}>Usuń<FiTrash2/></button>
			</p>
		</div>
	)
}

export default ReceiptListItem