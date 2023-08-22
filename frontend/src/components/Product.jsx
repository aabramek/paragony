function Product({product}) {

	return (
		<tr>
			<td>{product.name}</td>
			<td>{product.amount}</td>
			<td>{product.price}</td>
			<td>{product.discount ? product.discount : 0}</td>
			<td>{product.taxRate}</td>
		</tr>
	)
}

export default Product