import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const PetStatisticsView = () => {
  const [viewType, setViewType] = useState('species'); // species, breed
  const [speciesData, setSpeciesData] = useState([]);
  const [dogBreedsData, setDogBreedsData] = useState([]);
  const [catBreedsData, setCatBreedsData] = useState([]);

  useEffect(() => {
    const fetchSpeciesData = () => {
      fetch("/mock_data/pet_stats/species.json")
      .then(response => response.json())
      .then(data => {
        setSpeciesData(data);
      }).catch(error => console.log(error));
    };

    fetchSpeciesData();
  }, []);

  useEffect(() => {
    const fetchCatBreedsData = () => {
      fetch("/mock_data/pet_stats/cat_breeds.json")
      .then(response => response.json())
      .then(data => {
        setCatBreedsData(data);
      }).catch(error => console.log(error));
    };

    fetchCatBreedsData();
  }, []);

  useEffect(() => {
    const fetchDogBreedsData = () => {
      fetch("/mock_data/pet_stats/dog_breeds.json")
      .then(response => response.json())
      .then(data => {
        setDogBreedsData(data);
      }).catch(error => console.log(error));
    };

    fetchDogBreedsData();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const totalPets = speciesData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Tổng số thú cưng
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {totalPets.toLocaleString('vi-VN')}
          </div>
        </div>
        {speciesData.map((species, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-1">
              {species.name}
            </div>
            <div className="text-2xl font-bold text-green-600">
              {species.value.toLocaleString('vi-VN')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {species.percentage}% tổng số
            </div>
          </div>
        ))}
      </div>

      {/* View Type Selector */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('species')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewType === 'species'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Theo loài
          </button>
          <button
            onClick={() => setViewType('breed')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewType === 'breed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Theo giống
          </button>
        </div>
      </div>

      {/* Charts */}
      {viewType === 'species' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân bố theo loài
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={speciesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {speciesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết thống kê
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Loài
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tỷ lệ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {speciesData.map((species, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {species.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {species.value.toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {species.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dog Breeds */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top 10 giống chó phổ biến
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dogBreedsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="breed" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Số lượng" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cat Breeds */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top giống mèo phổ biến
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={catBreedsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="breed" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Số lượng" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetStatisticsView;
