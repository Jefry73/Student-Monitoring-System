export const students = [
{ id: 1, nim: "2021001", name: "Andi Pratama", semester: 5, ipk: 3.71, sks: 120, attendance: 96, riskLevel: "rendah", lastUpdate: "2026-06-01" },
{ id: 2, nim: "2021002", name: "Siti Aisyah", semester: 5, ipk: 3.52, sks: 118, attendance: 93, riskLevel: "rendah", lastUpdate: "2026-06-02" },
{ id: 3, nim: "2021003", name: "Budi Santoso", semester: 4, ipk: 2.91, sks: 94, attendance: 86, riskLevel: "sedang", lastUpdate: "2026-06-02" },
{ id: 4, nim: "2021004", name: "Dewi Lestari", semester: 6, ipk: 3.84, sks: 138, attendance: 98, riskLevel: "rendah", lastUpdate: "2026-06-03" },
{ id: 5, nim: "2021005", name: "Fajar Hidayat", semester: 3, ipk: 2.48, sks: 72, attendance: 79, riskLevel: "tinggi", lastUpdate: "2026-06-03" },
{ id: 6, nim: "2021006", name: "Nadia Putri", semester: 5, ipk: 3.15, sks: 110, attendance: 91, riskLevel: "sedang", lastUpdate: "2026-06-04" },
{ id: 7, nim: "2021007", name: "Rizky Maulana", semester: 6, ipk: 2.67, sks: 99, attendance: 83, riskLevel: "sedang", lastUpdate: "2026-06-04" },
{ id: 8, nim: "2021008", name: "Lina Marlina", semester: 4, ipk: 3.67, sks: 101, attendance: 95, riskLevel: "rendah", lastUpdate: "2026-06-04" },
{ id: 9, nim: "2021009", name: "Agus Saputra", semester: 2, ipk: 2.22, sks: 40, attendance: 74, riskLevel: "tinggi", lastUpdate: "2026-06-05" },
{ id: 10, nim: "2021010", name: "Maya Sari", semester: 7, ipk: 3.41, sks: 142, attendance: 97, riskLevel: "rendah", lastUpdate: "2026-06-05" },
{ id: 11, nim: "2021011", name: "Dimas Akbar", semester: 6, ipk: 2.95, sks: 112, attendance: 88, riskLevel: "sedang", lastUpdate: "2026-06-06" },
{ id: 12, nim: "2021012", name: "Kania Dewi", semester: 3, ipk: 3.28, sks: 78, attendance: 92, riskLevel: "rendah", lastUpdate: "2026-06-06" },
{ id: 13, nim: "2021013", name: "Tegar Nugroho", semester: 4, ipk: 2.56, sks: 88, attendance: 80, riskLevel: "tinggi", lastUpdate: "2026-06-07" },
{ id: 14, nim: "2021014", name: "Rani Permata", semester: 5, ipk: 3.76, sks: 123, attendance: 99, riskLevel: "rendah", lastUpdate: "2026-06-07" },
{ id: 15, nim: "2021015", name: "Yoga Pradana", semester: 8, ipk: 3.09, sks: 150, attendance: 90, riskLevel: "sedang", lastUpdate: "2026-06-08" },
{ id: 16, nim: "2021016", name: "Intan Puspita", semester: 2, ipk: 3.49, sks: 36, attendance: 94, riskLevel: "rendah", lastUpdate: "2026-06-08" },
{ id: 17, nim: "2021017", name: "Wahyu Setiawan", semester: 7, ipk: 2.74, sks: 130, attendance: 84, riskLevel: "sedang", lastUpdate: "2026-06-09" },
{ id: 18, nim: "2021018", name: "Putri Handayani", semester: 6, ipk: 3.88, sks: 144, attendance: 98, riskLevel: "rendah", lastUpdate: "2026-06-09" },
{ id: 19, nim: "2021019", name: "Arif Rahman", semester: 3, ipk: 2.41, sks: 66, attendance: 77, riskLevel: "tinggi", lastUpdate: "2026-06-10" },
{ id: 20, nim: "2021020", name: "Salsa Amelia", semester: 5, ipk: 3.22, sks: 109, attendance: 89, riskLevel: "sedang", lastUpdate: "2026-06-10" },
];
export const dosenWali = [
  { id: 1, nip: "198501012010121001", name: "Dr. Ahmad Fauzi, M.Kom", email: "ahmad.fauzi@univ.ac.id" },
  { id: 2, nip: "198703152012122002", name: "Dr. Siti Nurhaliza, M.T", email: "siti.nurhaliza@univ.ac.id" },
];

// Relasi Dosen Wali dengan Mahasiswa Bimbingan
export const dosenMahasiswaRelation = {
  1: [1, 2, 3, 6, 11, 12], // Dosen ID 1 membimbing mahasiswa dengan ID ini
  2: [4, 5, 7, 8, 9, 10, 13, 14, 15, 16, 17, 18, 19, 20],
};

// Helper function untuk get mahasiswa by dosen
export const getMahasiswaByDosen = (dosenId) => {
  const mahasiswaIds = dosenMahasiswaRelation[dosenId] || [];
  return students.filter(s => mahasiswaIds.includes(s.id));
};
export const ipkTrends = [
{ semester: "1", average: 2.84 },
{ semester: "2", average: 2.96 },
{ semester: "3", average: 3.05 },
{ semester: "4", average: 3.11 },
{ semester: "5", average: 3.18 },
{ semester: "6", average: 3.24 },
{ semester: "7", average: 3.29 },
{ semester: "8", average: 3.33 },
];
export const modelMetrics = [
{ model: "Random Forest", accuracy: 0.91, precision: 0.89, recall: 0.9, f1: 0.89 },
{ model: "SVM", accuracy: 0.87, precision: 0.85, recall: 0.84, f1: 0.84 },
{ model: "Neural Network", accuracy: 0.93, precision: 0.92, recall: 0.91, f1: 0.91 },
];
export const confusionMatrices = {
"Random Forest": [[58, 4, 1], [3, 44, 5], [0, 6, 39]],
SVM: [[55, 6, 2], [4, 41, 7], [1, 8, 36]],
"Neural Network": [[60, 2, 1], [2, 46, 4], [0, 4, 41]],
};
export const featureImportance = [
{ feature: "IPK", importance: 0.31 },
{ feature: "Attendance", importance: 0.24 },
{ feature: "SKS", importance: 0.17 },
{ feature: "Nilai Tugas", importance: 0.15 },
{ feature: "Kehadiran UTS/UAS", importance: 0.13 },
];