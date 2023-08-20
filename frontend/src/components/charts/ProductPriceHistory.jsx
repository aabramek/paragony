import {useState, useContext} from "react"
import {FiSearch} from "react-icons/fi"
import { Line } from "react-chartjs-2"
import AuthContext from "../../context/AuthProvider"

function ProductPriceHistory({loadChartData}) {
    const [chartData, setChartData] = useState([])
    const [chartLabels, setChartLabels] = useState([])
    const [chartSubtitle, setChartSubtitle] = useState("Nieokreślono produktu")
    const [productName, setProductName] = useState("")
    const [products, setProducts] = useState([])
    const {auth_token} = useContext(AuthContext)
   
    const chartParams = {
        options: {
            responsive: true,
            
            plugins: {
                legend: {
                    position: "bottom",
                },
                title: {
                    display: true,
                    text: "Historia cen produktu",
                },
                subtitle: {
                    display: true,
                    text: chartSubtitle
                }
            },
            
            scales: {
                y: {
                    beginAtZero: true
                }
            },

            elements: {
                point: {
                    radius: 6,
                    hoverRadius: 8,
                    backgroundColor: "rgb(179, 125, 6)"
                },

                line: {
                    borderColor: "rgb(248, 173, 5)"
                }
            }
        },

        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Cena produktu',
                    data: chartData
                }
            ]
        }
    }

    function updateChart() {
        loadChartData(
            "product_price_history",

            json => {
                setChartSubtitle(productName)
                setChartData(json.map(entry => entry.price))
                setChartLabels(json.map(entry => entry.date))
            },

            `productName=${productName}`
        )
    }

    //useEffect(updateChart, [])

    function submitForm(e) {
        e.preventDefault()
        updateChart()
    }

    function onChange(e) {
        const product_name = e.target.value

        setProductName(product_name)
        
        if (product_name === "") {
            setProducts([])
            return
        }
        
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + auth_token
            }
        }

        fetch(`http://${process.env.REACT_APP_BACKEND_ADDRESS}:${process.env.REACT_APP_BACKEND_PORT}/api/statistic/products?productName=${product_name}`, options)
            .then(response => response.json())
            .then(json => setProducts(json))
            .catch(error => console.log(error))
    }

    function onClick(e) {
        setProductName(e.target.innerText)
        setProducts([])
    }

    return (
        <div className="chart">
            <Line options={chartParams.options} data={chartParams.data} />
            <div className="chart-controls">
                <h3>Filtruj dane</h3>
                <form onSubmit={submitForm}>
                    <label for="productName">
                        Podaj nazwę produktu
                    </label>
                    <div className="prompt-search">
                        <input id="productName" type="text" value={productName} onChange={onChange}/>
                        <ul>
                            {products.map(product => <li key={product} onClick={onClick}>{product}</li>)}
                        </ul>
                    </div>
                    <button className="btn-search">Filtruj <FiSearch /></button>
                </form>
            </div>
        </div>
    )
}

export default ProductPriceHistory