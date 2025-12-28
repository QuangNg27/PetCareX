import React, { useState } from 'react';
import { branchManagerService } from '@services/branchManagerService';
import { SearchIcon, ClockIcon, FileTextIcon } from '@components/common/icons';
import { useAuth } from '@context/AuthContext';

const PetHistoryView = () => {
  const { user } = useAuth();
  const branchId = user?.MaCN;
  const [petId, setPetId] = useState('');
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedVaccRows, setExpandedVaccRows] = useState(new Set());
  const [expandedMedRows, setExpandedMedRows] = useState(new Set());

  const toggleVaccRow = (index) => {
    const newExpanded = new Set(expandedVaccRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedVaccRows(newExpanded);
  };

  const toggleMedRow = (index) => {
    const newExpanded = new Set(expandedMedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedMedRows(newExpanded);
  };

  const handleSearch = async () => {
    if (!petId) {
      setError('Vui lòng nhập mã thú cưng');
      return;
    }

    if (!branchId) {
      setError('Không xác định được chi nhánh');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const [medicalData, vaccinationData] = await Promise.all([
        branchManagerService.getPetMedicalHistory(petId, branchId),
        branchManagerService.getPetVaccinationHistory(petId, branchId)
      ]);
      
      setMedicalHistory(medicalData.data || []);
      setVaccinationHistory(vaccinationData.data || []);
      
      if (medicalData.data.length === 0 && vaccinationData.data.length === 0) {
        setError('Không tìm thấy lịch sử khám hoặc tiêm phòng tại chi nhánh này');
      }
    } catch (err) {
      setError('Không tìm thấy thông tin thú cưng tại chi nhánh này');
      setMedicalHistory([]);
      setVaccinationHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lịch sử khám & tiêm chủng thú cưng</h2>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập mã thú cưng..."
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Đang tìm...' : 'Tra cứu'}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Medical History */}
      {(medicalHistory.length > 0 || vaccinationHistory.length > 0) && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                Lịch sử khám bệnh tại chi nhánh
              </h3>
            </div>
            {medicalHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày khám
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Triệu chứng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chẩn đoán
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bác sĩ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số thuốc
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medicalHistory.map((record, index) => (
                      <React.Fragment key={index}>
                        <tr 
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => toggleMedRow(index)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <svg 
                              className={`h-5 w-5 transform transition-transform ${expandedMedRows.has(index) ? 'rotate-90' : ''}`}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(record.NgayKham).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {record.TrieuChung || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {record.ChanDoan || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.TenBacSi || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {record.ThuocDaDung?.length || 0} loại
                            </span>
                          </td>
                        </tr>
                        {expandedMedRows.has(index) && (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 bg-green-50">
                              <div className="pl-12">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Danh sách thuốc đã dùng:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {record.ThuocDaDung && record.ThuocDaDung.length > 0 ? 
                                    record.ThuocDaDung.map((thuoc, tIdx) => (
                                      <span 
                                        key={tIdx}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                                      >
                                        {thuoc.TenThuoc}
                                      </span>
                                    )) : 
                                    <span className="text-sm text-gray-500">Không có thuốc</span>
                                  }
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Chưa có lịch sử khám bệnh tại chi nhánh này</p>
              </div>
            )}
          </div>

          {/* Vaccination History */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                Lịch sử tiêm chủng tại chi nhánh
              </h3>
            </div>
            {vaccinationHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tiêm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số vắc-xin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bác sĩ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chi nhánh
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vaccinationHistory.map((record, index) => (
                      <React.Fragment key={index}>
                        <tr 
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => toggleVaccRow(index)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <svg 
                              className={`h-5 w-5 transform transition-transform ${expandedVaccRows.has(index) ? 'rotate-90' : ''}`}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(record.NgayTiem).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {record.Vaccines?.length || 0} loại
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.TenBacSi || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.TenCN || 'N/A'}
                          </td>
                        </tr>
                        {expandedVaccRows.has(index) && (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 bg-blue-50">
                              <div className="pl-12">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Danh sách vắc-xin đã tiêm:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {record.Vaccines && record.Vaccines.length > 0 ? 
                                    record.Vaccines.map((vac, vIdx) => (
                                      <span 
                                        key={vIdx}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                                      >
                                        {vac.TenVaccine}
                                      </span>
                                    )) : 
                                    <span className="text-sm text-gray-500">Không có thông tin</span>
                                  }
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Chưa có lịch sử tiêm chủng tại chi nhánh này</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PetHistoryView;
