import {FiTrash2} from "react-icons/fi"

function ProductEditable(props) {

	return (
		<tr>
			<td>
				<input type="text" value={props.product.name} onChange={(e) => props.onProductUpdate(props.product._id ? props.product._id : props.product.id, "name", e.target.value)}/>
			</td>
			<td>
				<input type="text" value={props.product.amount} onChange={(e) => props.onProductUpdate(props.product._id ? props.product._id : props.product.id, "amount", e.target.value)}/>
			</td>
			<td>
				<input type="text" value={props.product.price} onChange={(e) => props.onProductUpdate(props.product._id ? props.product._id : props.product.id, "price", e.target.value)}/>
			</td>
			<td>
				<input type="text" value={props.product.discount} onChange={(e) => props.onProductUpdate(props.product._id ? props.product._id : props.product.id, "discount", e.target.value)}/>
			</td>
			<td>
				<select value={props.product.taxRate} onChange={(e) => props.onProductUpdate(props.product._id ? props.product._id : props.product.id, "taxRate", e.target.value)}>
					<option value="D">D - 0%</option>
					<option value="B">B - 8%</option>
					<option value="A">A - 23%</option>
				</select>
			</td>
			<td>
				<button type="button" className="btn-delete" onClick={() => props.onProductDelete(props.product._id ? props.product._id : props.product.id)}>Usuń <FiTrash2 /></button>
			</td>
		</tr>
	)
}

export default ProductEditable