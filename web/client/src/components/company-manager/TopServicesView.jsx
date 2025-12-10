import React, {useState, useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TopServicesView = () => {
  // Mock data - Doanh thu theo loại dịch vụ (6 tháng gần nhất)
  const [monthlyServiceData, setMonthlyServiceData] = useState([]);

  useEffect(() => {
    const fetchMonthlyServiceData = () => {
      fetch("/mock_data/top_service/monthly_service_data.json")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMonthlyServiceData(data);
      }).catch(error => console.log(error))
    };

    fetchMonthlyServiceData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalKhamBenh = monthlyServiceData.reduce((sum, item) => sum + item.khamBenh, 0);
  const totalTiemPhong = monthlyServiceData.reduce((sum, item) => sum + item.tiemPhong, 0);
  const totalBanHang = monthlyServiceData.reduce((sum, item) => sum + item.banHang, 0);
  const totalRevenue = totalKhamBenh + totalTiemPhong + totalBanHang;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Thống kê doanh thu dịch vụ
        </h2>
        <p className="text-sm text-gray-600">
          Dữ liệu 6 tháng gần nhất (07/2024 - 12/2024)
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Tổng doanh thu
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalRevenue)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Khám bệnh
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(totalKhamBenh)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Tiêm phòng
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalTiemPhong)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Bán hàng
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalBanHang)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Biểu đồ doanh thu theo loại dịch vụ
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyServiceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="khamBenh" 
              name="Khám bệnh" 
              stroke="#9333ea" 
              strokeWidth={2}
              dot={{ fill: '#9333ea', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="tiemPhong" 
              name="Tiêm phòng" 
              stroke="#16a34a" 
              strokeWidth={2}
              dot={{ fill: '#16a34a', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="banHang" 
              name="Bán hàng" 
              stroke="#ea580c" 
              strokeWidth={2}
              dot={{ fill: '#ea580c', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopServicesView;
