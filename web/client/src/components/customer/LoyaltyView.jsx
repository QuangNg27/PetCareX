import React, { useMemo } from 'react';
import { 
  StarIcon,
  TrophyIcon,
  ClockIcon,
  CheckIcon
} from '@components/common/icons';

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
  yearlySpending: 6500000, // Chi tiêu trong năm
  spendingToNextTier: 5500000, // Số tiền cần chi thêm để lên hạng
  spendingToMaintain: 3000000 // Số tiền cần chi để giữ hạng
};

const LoyaltyView = () => {
  const loyaltyData = MOCK_LOYALTY_DATA;

  const calculateProgress = useMemo(() => {
    const currentTierIndex = TIERS.findIndex(t => t.name === loyaltyData.tier);
    const currentTier = TIERS[currentTierIndex];
    const nextTier = TIERS[currentTierIndex + 1];
    
    if (!nextTier) return 100;
    
    const spendingInCurrentTier = loyaltyData.yearlySpending - currentTier.minSpending;
    const spendingNeeded = nextTier.minSpending - currentTier.minSpending;
    return (spendingInCurrentTier / spendingNeeded) * 100;
  }, [loyaltyData.tier, loyaltyData.yearlySpending]);

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
                leftPosition = '4%'; // Cơ bản
              } else if (index === TIERS.length - 1) {
                leftPosition = '96%'; // VIP
              } else {
                leftPosition = '50%'; // Thân thiết - ở giữa
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
      </div>
  );
};

export default LoyaltyView;
