import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import ChartCard from "./ChartCard";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);
const IPKTrendChart = ({ ipkTrends }) => {
const data = {
labels: ipkTrends.map((item) => item.semester),
datasets: [{ label: "Rata-rata IPK", data: ipkTrends.map((item) => item.average), borderColor: "#0d6efd", backgroundColor: "rgba(13,110,253,0.15)", tension: 0.35, fill: true }],
};
const options = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 4 } } };
return <ChartCard title="Tren IPK per Semester"><br></br><Line data={data} options={options} /></ChartCard>;
};
export default IPKTrendChart;