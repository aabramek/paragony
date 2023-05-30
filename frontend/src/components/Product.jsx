import {useState} from "react"

function Product({product}) {

	return (
		<tr>
			<td>{product.name}</td>
			<td>{product.amount}</td>
			<td>{product.price}</td>
			<td>{product.discount}</td>
			<td>{product.taxRate}</td>
		</tr>
	)
}

export default Product