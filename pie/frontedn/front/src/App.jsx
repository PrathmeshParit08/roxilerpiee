import React, { useState, useEffect } from 'react';
import TransactionTable from './components/TransactionTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import { fetchCombinedData } from './api/transactionAPI';

const App = () => {
  const [month, setMonth] = useState('03'); // Default March
  const [data, setData] = useState({
    transactions: [],
    statistics: {},
    barChart: [],
    pieChart: [],
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [month, page, search]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await fetchCombinedData(month);
      setData(result);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Transaction Dashboard</h1>

      <div className="mb-4">
        <label className="font-bold">Select Month: </label>
        <select
          className="border border-gray-300 p-2 rounded-md ml-2"
          value={month}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={(index + 1).toString().padStart(2, '0')}>
              {new Date(0, index).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          <TransactionTable
            transactions={data.transactions}
            totalCount={data.totalCount}
            search={search}
            onSearchChange={handleSearchChange}
            page={page}
            setPage={setPage}
          />

          <Statistics
            totalSaleAmount={data.statistics.totalSaleAmount}
            soldItems={data.statistics.soldItems}
            notSoldItems={data.statistics.notSoldItems}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BarChart data={data.barChart} />
            <PieChart data={data.pieChart} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
