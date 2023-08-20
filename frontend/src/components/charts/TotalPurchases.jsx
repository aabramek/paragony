import {useState, useEffect} from "react"
import {FiSearch} from "react-icons/fi"
import { Bar } from "react-chartjs-2"
import months from "./months_list.js"

function TotalPurchases({loadChartData}) {
    const [chartData, setChartData] = useState([])
    const [chartLabels, setChartLabels] = useState([])
    const [year, setYear] = useState("")
    const [month, setMonth] = useState("")
    const [chartSubtitle, setChartSubtitle] = useState("Wszystkie lata, wszystkie miesiące")

    const chartParams = {
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Ilość zakupów w poszczególnych sklepach'
                },
                subtitle: {
                    display: true,
                    text: chartSubtitle
                }
            }
        },

        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: "Ilość zakupów",
                    data: chartData,
                    backgroundColor: "rgba(248, 173, 5, 0.7)",
                    borderColor: "#b37d06",
                    borderWidth: 3
                }
            ]
        }
    }

    function updateChart() {
        loadChartData(
            "total_purchases",

            json => {
                setChartData(json.map(e => e.total))
                setChartLabels(json.map(e => e._id))
                let sub_title = (year ? `Rok ${year}, ` : "Wszystkie lata, ") + (month ? `miesiąc ${months[parseInt(month) - 1]}` : "wszsytkie miesiące")
                setChartSubtitle(sub_title)
            },

            `year=${year}&month=${month}`
        )
    }

    useEffect(updateChart, [])

    function submitForm(e) {
        e.preventDefault()
        updateChart()
    }

    return (
        <div className="chart">
            <Bar options={chartParams.options} data={chartParams.data} />
            <div className="chart-controls">
            <h3>Filtruj dane</h3>
            <form onSubmit={submitForm}>
                 <p>
                    <label for="total_purchases_year">Wybierz rok:</label> 
                    <select id="total_purchases_year" value={year} onChange={e => setYear(e.target.value)}>
                        <option value="">Wszystkie lata</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                    </select>
                </p>

                <p>
                    <label for="total_purchases_month">Wybierz miesiąc:</label>
                    <select id="total_purchases_month" value={month} onChange={e => setMonth(e.target.value)}>
                        <option value="">Wszystkie miesące</option>
                        <option value="01">Styczeń</option>
                        <option value="02">Luty</option>
                        <option value="03">Marzec</option>
                        <option value="04">Kwiecień</option>
                        <option value="05">Maj</option>
                        <option value="06">Czerwiec</option>
                        <option value="07">Lipiec</option>
                        <option value="08">Sierpień</option>
                        <option value="09">Wrzesień</option>
                        <option value="10">Październik</option>
                        <option value="11">Listopad</option>
                        <option value="12">Grudzień</option>
                    </select>
                </p>
                <button className="btn-edit" type="button" onClick={() => {setYear(""); setMonth("")}}>Resetuj ustawienia</button>
                <button className="btn-search">Filtruj <FiSearch /></button>
            </form>
            </div>
        </div>
    )
}

export default TotalPurchases