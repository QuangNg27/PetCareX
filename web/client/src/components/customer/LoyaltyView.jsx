import React, { useState, useEffect, useMemo } from 'react';
import { 
  StarIcon,
  TrophyIcon,
  ClockIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon
} from '@components/common/icons';
import { customerService } from '@services/customerService';

// Constants
const TIERS = [
  { 
    name: 'Cơ bản', 
    minSpending: 0, 
    maintainSpending: 0,
    color: '#9CA3AF', 
    benefits: ['Tích điểm cơ bản', 'Hỗ trợ khách hàng 24/7'] 
  },
  { 
    name: 'Thân thiết', 
    minSpending: 5000000, 
    maintainSpending: 3000000,
    color: '#3B82F6', 
    benefits: ['Tích điểm ưu đãi', 'Ưu tiên đặt lịch', 'Giảm 5% dịch vụ', 'Tư vấn miễn phí'] 
  },
  { 
    name: 'VIP', 
    minSpending: 12000000, 
    maintainSpending: 8000000,
    color: '#FFD700', 
    benefits: ['Tích điểm cao cấp', 'Ưu tiên cao nhất', 'Giảm 10% dịch vụ', 'Quà tặng sinh nhật', 'Dịch vụ tận nhà miễn phí'] 
  }
];

const MOCK_LOYALTY_DATA = {
  totalPoints: 1250,
  tier: 'Thân thiết',
  tierColor: '#3B82F6',
  nextTier: 'VIP',
  yearlySpending: 6500000,
  spendingToNextTier: 5500000,
  spendingToMaintain: 3000000
};

const LoyaltyView = () => {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loyaltyHistory, setLoyaltyHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  // Fetch loyalty data and history
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      setIsLoadingHistory(true);
      setError(null);
      
      try {
        const [spendingData, historyData] = await Promise.all([
          customerService.getSpending(),
          customerService.getLoyaltyHistory()
        ]);
        
        // Map spending data to loyalty data format
        setLoyaltyData({
          totalPoints: spendingData.DiemTichLuy || 0,
          tier: spendingData.HangThanhVien || 'Cơ bản',
          tierColor: getTierColor(spendingData.HangThanhVien),
          nextTier: getNextTier(spendingData.HangThanhVien),
          yearlySpending: spendingData.ChiTieuNam || 0,
          spendingToNextTier: calculateSpendingToNextTier(spendingData.ChiTieuNam, spendingData.HangThanhVien),
          spendingToMaintain: getMaintainSpending(spendingData.HangThanhVien)
        });
        
        setLoyaltyHistory(historyData);
      } catch (err) {
        console.error('Error fetching loyalty data:', err);
        setError('Không thể tải dữ liệu tích điểm');
        // Fallback to mock data
        setLoyaltyData(MOCK_LOYALTY_DATA);
      } finally {
        setIsLoadingData(false);
        setIsLoadingHistory(false);
      }
    };

    fetchData();
  }, []);

  const getTierColor = (tier) => {
    const tierColors = {
      'Cơ bản': '#9CA3AF',
      'Thân thiết': '#3B82F6',
      'VIP': '#FFD700'
    };
    return tierColors[tier] || '#9CA3AF';
  };

  const getNextTier = (currentTier) => {
    const tierOrder = ['Cơ bản', 'Thân thiết', 'VIP'];
    const currentIndex = tierOrder.indexOf(currentTier);
    return currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null;
  };

  const getMaintainSpending = (tier) => {
    const tierData = TIERS.find(t => t.name === tier);
    return tierData?.maintainSpending || 0;
  };

  const calculateSpendingToNextTier = (currentSpending, currentTier) => {
    const nextTier = getNextTier(currentTier);
    if (!nextTier) return 0;
    
    const nextTierData = TIERS.find(t => t.name === nextTier);
    return Math.max(0, nextTierData.minSpending - currentSpending);
  };

  const calculateProgress = useMemo(() => {
    if (!loyaltyData) return 0;
    
    const currentTierIndex = TIERS.findIndex(t => t.name === loyaltyData.tier);
    const currentTier = TIERS[currentTierIndex];
    const nextTier = TIERS[currentTierIndex + 1];
    
    if (!nextTier) return 100;
    
    const spendingInCurrentTier = loyaltyData.yearlySpending - currentTier.minSpending;
    const spendingNeeded = nextTier.minSpending - currentTier.minSpending;
    return (spendingInCurrentTier / spendingNeeded) * 100;
  }, [loyaltyData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error && !loyaltyData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header with points summary */}
      <div className="flex flex-col gap-4">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <StarIcon size={40} />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-1">{loyaltyData.totalPoints.toLocaleString()}</h2>
              <p className="text-primary-100 text-sm font-medium">Điểm tích lũy</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold" style={{ backgroundColor: loyaltyData.tierColor }}>
            <TrophyIcon size={20} />
            <span>{loyaltyData.tier}</span>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-900 block mb-1">
                Tiến độ lên hạng {loyaltyData.nextTier || 'tối đa'}
              </span>
              <span className="text-xs text-gray-600">
                Chi tiêu trong năm: <strong className="text-primary-600">{loyaltyData.yearlySpending.toLocaleString()} VNĐ</strong>
              </span>
            </div>
            {loyaltyData.nextTier && (
              <span className="text-sm font-bold text-primary-600">
                Còn {loyaltyData.spendingToNextTier.toLocaleString()} VNĐ
              </span>
            )}
          </div>
          
          {loyaltyData.nextTier && (
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 rounded-full"
                style={{ width: `${calculateProgress}%` }}
              ></div>
            </div>
          )}
          
          {/* Tier Markers */}
          <div className="relative h-20 mt-2 px-2">
            {TIERS.map((tier, index) => {
              let leftPosition;
              if (index === 0) {
                leftPosition = '4%';
              } else if (index === TIERS.length - 1) {
                leftPosition = '96%';
              } else {
                leftPosition = '50%';
              }
              
              return (
                <div 
                  key={tier.name} 
                  className="absolute transform -translate-x-1/2 flex flex-col items-center gap-1"
                  style={{ left: leftPosition }}
                >
                  <div 
                    className={`w-3 h-3 rounded-full border-2 ${loyaltyData.yearlySpending >= tier.minSpending ? 'border-white' : 'border-gray-300 bg-white'}`}
                    style={{ backgroundColor: loyaltyData.yearlySpending >= tier.minSpending ? tier.color : undefined }}
                  ></div>
                  <span className={`text-xs font-medium whitespace-nowrap ${loyaltyData.yearlySpending >= tier.minSpending ? 'text-gray-900' : 'text-gray-400'}`}>
                    {tier.name}
                  </span>
                  <span className={`text-xs whitespace-nowrap ${loyaltyData.yearlySpending >= tier.minSpending ? 'text-gray-600' : 'text-gray-400'}`}>
                    {tier.minSpending > 0 ? `≥${(tier.minSpending / 1000000).toFixed(1)}tr` : '0đ'}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Maintain tier info */}
          {loyaltyData.tier !== 'Cơ bản' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-700">
                💡 <strong>Giữ hạng {loyaltyData.tier}:</strong> Cần chi tiêu tối thiểu{' '}
                <strong className="text-blue-600">{loyaltyData.spendingToMaintain.toLocaleString()} VNĐ/năm</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tier Overview */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-5">Các hạng thành viên</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div 
              key={tier.name} 
              className={`relative bg-white border-2 rounded-xl p-5 transition-all ${
                loyaltyData.tier === tier.name 
                  ? 'border-primary-500 shadow-lg shadow-primary-500/20' 
                  : loyaltyData.yearlySpending >= tier.minSpending
                  ? 'border-gray-300'
                  : 'border-gray-200 opacity-60'
              }`}
            >
              {loyaltyData.tier === tier.name && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded flex items-center gap-1">
                  <CheckIcon size={12} /> Hiện tại
                </div>
              )}
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-3" style={{ backgroundColor: tier.color }}>
                  <TrophyIcon size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{tier.name}</h4>
                <p className="text-xs text-gray-600 mb-1">
                  {tier.minSpending > 0 
                    ? `Đạt: ≥ ${(tier.minSpending / 1000000).toFixed(1)} triệu VNĐ/năm`
                    : 'Hạng mặc định'
                  }
                </p>
                {tier.maintainSpending > 0 && (
                  <p className="text-xs text-blue-600">
                    Giữ hạng: ≥ {(tier.maintainSpending / 1000000).toFixed(1)} triệu VNĐ/năm
                  </p>
                )}
              </div>
              <div>
                <h5 className="text-sm font-bold text-gray-900 mb-2">Quyền lợi:</h5>
                <ul className="space-y-1.5">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckIcon size={14} className="text-success-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loyalty History */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-5">Lịch sử tích điểm</h3>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          ) : loyaltyHistory.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Chưa có lịch sử tích điểm</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Loại giao dịch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Điểm
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Số dư
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loyaltyHistory.map((history, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <ClockIcon size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {formatDate(history.NgayGiaoDich || history.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          history.LoaiGiaoDich === 'Tích điểm' || history.DiemThayDoi > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {history.LoaiGiaoDich || (history.DiemThayDoi > 0 ? 'Tích điểm' : 'Sử dụng điểm')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {history.MoTa || history.description || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          {(history.DiemThayDoi || history.pointsChanged) > 0 ? (
                            <>
                              <PlusIcon size={16} className="text-green-600" />
                              <span className="text-sm font-semibold text-green-600">
                                {Math.abs(history.DiemThayDoi || history.pointsChanged)}
                              </span>
                            </>
                          ) : (
                            <>
                              <MinusIcon size={16} className="text-red-600" />
                              <span className="text-sm font-semibold text-red-600">
                                {Math.abs(history.DiemThayDoi || history.pointsChanged)}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-medium text-gray-900">
                          {(history.DiemConLai || history.remainingPoints || 0).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyView;
