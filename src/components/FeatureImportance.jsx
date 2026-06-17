import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import ChartCard from "./ChartCard";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
const FeatureImportance = ({ featureImportance }) => {
const data = {
labels: featureImportance.map((item) => item.feature),
datasets: [{ label: "Importance", data: featureImportance.map((item) => item.importance), backgroundColor: "#0d6efd" }],
};
const options = { indexAxis: "y", responsive: true, plugins: { legend: { display: false } } };
return <ChartCard title="Feature Importance"><Bar data={data} options={options} /></ChartCard>;
};
export default FeatureImportance;