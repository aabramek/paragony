function displayChart() {
	const data = [
			{shop: "Biedronka", count: 10},
			{shop: "Lidl", count: 15},
			{shop: "Stokrotka", count: 1},
			{shop: "Kaufland", count: 2}
		]

	new Chart(
		document.getElementById("canvas"),
		{
			type: "bar",
			data: {
				labels: data.map(row => row.shop),
				datasets: [
					{
						label: "? nie wiem",
						data: data.map(row => row.count)
					}
				]
			}
		}
	)
}