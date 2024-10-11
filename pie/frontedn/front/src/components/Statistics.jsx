import React from 'react';
import PropTypes from 'prop-types';

const Statistics = ({ totalSaleAmount, soldItems, notSoldItems }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-blue-100 p-4 rounded-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold">Total Sale Amount</h3>
        <p className="text-2xl font-bold">${totalSaleAmount}</p>
      </div>
      <div className="bg-green-100 p-4 rounded-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold">Sold Items</h3>
        <p className="text-2xl font-bold">{soldItems}</p>
      </div>
      <div className="bg-red-100 p-4 rounded-md hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-lg font-semibold">Not Sold Items</h3>
        <p className="text-2xl font-bold">{notSoldItems}</p>
      </div>
    </div>
  );
};

Statistics.propTypes = {
  totalSaleAmount: PropTypes.number.isRequired,
  soldItems: PropTypes.number.isRequired,
  notSoldItems: PropTypes.number.isRequired,
};

export default Statistics;
