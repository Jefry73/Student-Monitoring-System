import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartCard from "./ChartCard";
ChartJS.register(ArcElement, Tooltip, Legend);
const RiskDistributionChart = ({ students }) => {
const counts = { rendah: 0, sedang: 0, tinggi: 0 };
students.forEach((s) => counts[s.riskLevel]++);
const data = {
labels: ["Rendah", "Sedang", "Tinggi"],
datasets: [{ data: [counts.rendah, counts.sedang, counts.tinggi], backgroundColor: ["#198754", "#ffc107", "#dc3545"] }],
};
return <ChartCard title="Distribusi Risiko"><br></br><Pie data={data} /></ChartCard>;
};
export default RiskDistributionChart;