const colors = ["#d1e7dd", "#fff3cd", "#f8d7da", "#cfe2ff"];
const ConfusionMatrix = ({ matrix, labels }) => (
<div className="table-responsive">
<table className="table table-bordered text-center align-middle">
<thead><tr><th></th>{labels.map((label) => <th key={label}>{label}</th>)}</tr></thead>
<tbody>{matrix.map((row, i) => (<tr key={labels[i]}><th>{labels[i]}</th>{row.map((cell, j) => <td key={j} style={{ background: colors[(i + j) % colors.length] }}>{cell}</td>)}</tr>))}</tbody>
</table>
</div>
);
export default ConfusionMatrix;