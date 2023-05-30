function ReceiptFormHeader(props) {
	return (
		<fieldset>
			<legend>Dane zakupu</legend>

			<table>
				<tbody>
					<tr>
						<td>Nazwa sklepu</td>
						<td><input type="text" name="shopName" id="shopName" value={props.shopName} onChange={(e) => {props.setShopName(e.target.value)}}/></td>
					</tr>
					<tr>
						<td>Miejscowość</td>
						<td><input type="text" name="shopCity" id="shopCity" value={props.shopCity} onChange={(e) => {props.setShopCity(e.target.value)}}/></td>
					</tr>
					<tr>
						<td>Ulica</td>
						<td><input type="text" name="shopStreet" id="shopStreet" value={props.shopStreet} onChange={(e) => {props.setShopStreet(e.target.value)}}/></td>
					</tr>
					<tr>
						<td>Data i godzina</td>
						<td><input type="datetime-local" name="datetime" id="datetime" value={props.datetime} onChange={(e) => {props.setDatetime(e.target.value)}}/></td>
					</tr>
				</tbody>
			</table>
		</fieldset>
	)
}

export default ReceiptFormHeader