import {useContext} from "react"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    SubTitle,
    Tooltip,
    Legend
} from "chart.js"

import AuthContext from "../context/AuthProvider"
import TotalPurchases from "./charts/TotalPurchases"
import MoneySpent from "./charts/MoneySpent"
import ProductPriceHistory from "./charts/ProductPriceHistory"

function Statistics() {
    const {auth_token} = useContext(AuthContext)

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        LineElement,
        PointElement,
        Title,
        SubTitle,
        Tooltip,
        Legend
    )

    ChartJS.defaults.color = "white"
    ChartJS.defaults.borderColor = "white"
    ChartJS.defaults.plugins.title.font = {size: 24}
    ChartJS.defaults.plugins.legend.labels.font = {size: 16}
    ChartJS.defaults.plugins.subtitle.font = {size: 18}

    function loadChartData(method, callback, query) {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + auth_token
            }
        }

        fetch(`http://${process.env.REACT_APP_BACKEND_ADDRESS}:${process.env.REACT_APP_BACKEND_PORT}/api/statistic/${method}/?${query}`, options)
            .then(response => response.json())
            .then(json => {
                callback(json)
            })
            .catch(error => console.log(error))
    }

    return (
        <div className="statistics">
        	<TotalPurchases  loadChartData={loadChartData} />
            <MoneySpent loadChartData={loadChartData} />
            <ProductPriceHistory loadChartData={loadChartData} />
    	</div>
    )
}

export default Statistics