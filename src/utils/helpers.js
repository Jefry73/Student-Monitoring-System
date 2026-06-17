export const getRiskColor = (level) => {
if (level === "rendah") return "success";
if (level === "sedang") return "warning";
return "danger";
};
export const getRiskBadgeVariant = (level) => {
return getRiskColor(level);
};
export const formatDate = (dateString) => {
return new Date(dateString).toLocaleDateString("id-ID", {
day: "2-digit", month: "long", year: "numeric"
});
};
export const calculateGPA = (grades) => {
if (!grades?.length) return 0;
const total = grades.reduce((sum, item) => sum + item.score * item.credit, 0);
const credits = grades.reduce((sum, item) => sum + item.credit, 0);
return credits ? (total / credits).toFixed(2) : 0;
};
export const getStatusText = (risk) => {
const map = { rendah: "Aman", sedang: "Perlu Perhatian", tinggi: "Berisiko" };
return map[risk] || "Tidak Diketahui";
};
export const sortByName = (items) => [...items].sort((a, b) => a.name.localeCompare(b.name));
export const sortByIPK = (items) => [...items].sort((a, b) => b.ipk - a.ipk);