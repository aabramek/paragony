import {useState, useEffect} from "react"

import { Bar } from "react-chartjs-2"

function TotalPurchases({loadChartData}) {
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
                    text: 'Ilość zakupów w poszczególnych sklepach',
                }
            }
        },

        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Ilość zakupów',
                    data: chartData,
                    backgroundColor: 'green'
                }
            ]
        }
    }

    useEffect(
        () => loadChartData(
                "total_purchases",
                (json) => {
                    setChartData(json.map(e => e.total))
                    setChartLabels(json.map(e => e._id))
                }),
        [])

    return (
        <div className="chart">
            <Bar options={chartParams.options} data={chartParams.data} />
        </div>
    )
}

export default TotalPurchases