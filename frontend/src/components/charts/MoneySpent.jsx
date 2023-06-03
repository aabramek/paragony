import {useState, useEffect} from "react"

import { Bar } from "react-chartjs-2"

function MoneySpent({loadChartData}) {
    const [chartData, setChartData] = useState([])
    const [chartLabels, setChartLabels] = useState([])

    const chartParams = {
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Wielkość wydatków w poszczególnych miesiącach',
                }
            }
        },

        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Wielkość wydatków',
                    data: chartData,
                    backgroundColor: 'green'
                }
            ]
        }
    }

    const months = new Map()
    months.set("01", "Styczeń")
    months.set("02", "Luty")
    months.set("03", "Marzec")
    months.set("04", "Kwiecień")
    months.set("05", "Maj")
    months.set("06", "Czerwiec")
    months.set("07", "Lipiec")
    months.set("08", "Sierpień")
    months.set("09", "Wrzesień")
    months.set("10", "Październik")
    months.set("11", "Listopad")
    months.set("12", "Grudzień")

    useEffect(
        () => loadChartData(
                "money_spent",
                (json) => {
                    setChartData(json.map(e => e.total))
                    setChartLabels(json.map(e => months.get(e._id)))
                }),
        [])


    return (
        <Bar options={chartParams.options} data={chartParams.data} />
    )
}

export default MoneySpent