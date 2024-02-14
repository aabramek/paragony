import {useState, useEffect} from "react"
import {FiSearch} from "react-icons/fi"
import { Line } from "react-chartjs-2"
import SelectYear from "./../SelectYear"
import months from "./months_list.js"

function MoneySpent({loadChartData}) {
    const [chartData, setChartData] = useState([])
    const [chartLabels, setChartLabels] = useState([])
    const [chartSubtitle, setChartSubtitle] = useState("Wszystkie lata")
    const [year, setYear] = useState("")

    const chartParams = {
        options: {
            responsive: true,
            
            plugins: {
                legend: {
                    position: "bottom",
                },
                title: {
                    display: true,
                    text: "Wielkość wydatków w poszczególnych miesiącach ",
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
                    label: 'Wielkość wydatków',
                    data: chartData
                }
            ]
        }
    }

    function updateChart() {
        loadChartData(
            "money_spent",

            json => {
                const values = Array(12).fill(0)
                
                json.forEach(function (element) {
                    values[element._id - 1] = element.total
                })

                setChartData(values)
                setChartLabels(months)
                setChartSubtitle(year ? `Rok ${year}` : "Wszystkie lata")
            },

            `year=${year}`
        )
    }

    useEffect(updateChart, [])

    function submitForm(e) {
        e.preventDefault()
        updateChart()
    }

    return (
        <div className="chart">
            <Line options={chartParams.options} data={chartParams.data} />
            <div className="chart-controls">
                <h3>Filtruj dane</h3>
                <form onSubmit={submitForm}>
                    <p>
                        <label for="money-spent-year">Wybierz rok</label>
                        <SelectYear onChange={e => {setYear(e.target.value)}} />
                     </p>
                     <button type="button" className="btn-edit" onClick={() => setYear("")}>Resetuj ustawienia</button>
                     <button className="btn-search">Filtruj <FiSearch /></button>
                </form>
            </div>
        </div>
    )
}

export default MoneySpent