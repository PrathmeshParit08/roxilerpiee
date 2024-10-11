// TransactionTable.jsx
const TransactionTable = ({ transactions = [], totalCount, search, onSearchChange, page, setPage }) => {
  const handleNextPage = () => setPage(page + 1);
  const handlePreviousPage = () => setPage(page > 1 ? page - 1 : 1);

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Transactions</h2>
      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={onSearchChange}
        className="border p-2 rounded-md mb-4 w-full"
      />
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Sold</th>
            <th className="border p-2">Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="border p-2">{transaction.title}</td>
                <td className="border p-2">{transaction.description}</td>
                <td className="border p-2">${transaction.price}</td>
                <td className="border p-2">{transaction.sold ? 'Yes' : 'No'}</td>
                <td className="border p-2">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border p-2 text-center">No transactions available</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination buttons here */}
    </div>
  );
};

export default TransactionTable;
