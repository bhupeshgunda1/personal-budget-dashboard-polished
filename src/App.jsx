
import React, { useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

function App() {
  const [transactions, setTransactions] = useState([
    { date: "2025-09-10", category: "Food", amount: 50, desc: "Lunch" },
    { date: "2025-09-09", category: "Bills", amount: 100, desc: "Internet" },
    { date: "2025-09-08", category: "Transport", amount: 30, desc: "Gas" },
  ]);

  const [filter, setFilter] = useState("All");
  const [formData, setFormData] = useState({ date: "", category: "", amount: "", desc: "" });

  const income = 5000;
  const totalExpenses = transactions.reduce((acc, t) => acc + t.amount, 0);
  const savings = income - totalExpenses;

  const displayedTransactions =
    filter === "All" ? transactions : transactions.filter((t) => t.category === filter);

  const expenseCategories = {};
  transactions.forEach((t) => {
    expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
  });

  const pieData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(expenseCategories),
        backgroundColor: ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa", "#f472b6"],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      { label: "Income", data: [5000, 5000, 5000, 5000, 5000], borderColor: "#60a5fa", tension: 0.3, fill: false },
      { label: "Expenses", data: [3200, 3500, 3000, 3600, 3200], borderColor: "#f87171", tension: 0.3, fill: false },
    ],
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTransaction = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.category || !formData.amount) return;
    setTransactions([
      ...transactions,
      {
        date: formData.date,
        category: formData.category,
        amount: parseFloat(formData.amount),
        desc: formData.desc,
      },
    ]);
    setFormData({ date: "", category: "", amount: "", desc: "" });
  };

  const savingsGoal = 2000;
  const goalProgress = Math.min((savings / savingsGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">💰 Personal Budget Dashboard</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[{ title: "Income", value: income, color: "bg-blue-500" },
          { title: "Expenses", value: totalExpenses, color: "bg-red-500" },
          { title: "Savings", value: savings, color: "bg-green-500" },
          { title: "Budget Remaining", value: income - totalExpenses, color: "bg-yellow-500" }].map((card, idx) => (
          <div key={idx} className={`p-6 rounded-xl shadow-md text-white ${card.color} hover:scale-105 transform transition`}>
            <h2 className="text-gray-100 font-semibold mb-2">{card.title}</h2>
            <p className="text-2xl font-bold">${card.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Expense Distribution</h2>
          <Pie data={pieData} />
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Income vs Expenses</h2>
          <Line data={lineData} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-2">Savings Goal: ${savingsGoal}</h2>
        <div className="w-full bg-gray-200 rounded-full h-6">
          <div className="bg-green-500 h-6 rounded-full text-center text-white font-bold" style={{ width: `${goalProgress}%` }}>{goalProgress.toFixed(0)}%</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4" onSubmit={addTransaction}>
          <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          <input type="text" name="desc" placeholder="Description" value={formData.desc} onChange={handleInputChange} className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">Add</button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex items-center gap-4">
        <span className="font-semibold">Filter by Category:</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="All">All</option>
          {Object.keys(expenseCategories).map((cat, idx) => (<option key={idx} value={cat}>{cat}</option>))}
        </select>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">{["Date","Category","Amount","Description"].map((th, idx)=>(<th key={idx} className="p-3 border-b text-gray-700">{th}</th>))}</tr>
            </thead>
            <tbody>
              {displayedTransactions.map((t, idx)=>(
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b">{t.date}</td>
                  <td className="p-3 border-b">{t.category}</td>
                  <td className="p-3 border-b">${t.amount}</td>
                  <td className="p-3 border-b">{t.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
