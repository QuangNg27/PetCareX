import React, { useState } from 'react';
import { 
  StarIcon,
  GiftIcon,
  TrophyIcon,
  ClockIcon,
  CheckIcon,
  ArrowRightIcon
} from '@components/common/icons';
import './LoyaltyView.css';

const LoyaltyView = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Thông tin điểm tích lũy
  const loyaltyData = {
    totalPoints: 1250,
    tier: 'Vàng',
    tierColor: '#FFD700',
    nextTier: 'Bạch Kim',
    pointsToNextTier: 750,
    expiringPoints: 200,
    expiryDate: '31/12/2025'
  };

  // Lịch sử tích điểm
  const pointsHistory = [
    {
      id: 1,
      type: 'earn',
      description: 'Thanh toán dịch vụ tắm rửa',
      points: 150,
      date: '2025-12-01',
      invoiceId: 'INV-2025-001'
    },
    {
      id: 2,
      type: 'earn',
      description: 'Đăng ký gói tiêm phòng',
      points: 300,
      date: '2025-11-28',
      invoiceId: 'INV-2025-002'
    },
    {
      id: 3,
      type: 'redeem',
      description: 'Đổi voucher giảm 50,000đ',
      points: -200,
      date: '2025-11-25',
      voucherId: 'VOU-001'
    },
    {
      id: 4,
      type: 'earn',
      description: 'Thanh toán dịch vụ khám sức khỏe',
      points: 250,
      date: '2025-11-20',
      invoiceId: 'INV-2025-003'
    },
    {
      id: 5,
      type: 'earn',
      description: 'Giới thiệu khách hàng mới',
      points: 500,
      date: '2025-11-15',
      referralId: 'REF-001'
    },
    {
      id: 6,
      type: 'redeem',
      description: 'Đổi quà tặng - Áo thú cưng',
      points: -150,
      date: '2025-11-10',
      giftId: 'GIFT-001'
    }
  ];

  // Phần thưởng có thể đổi
  const rewards = [
    {
      id: 1,
      name: 'Voucher giảm 50,000đ',
      points: 200,
      description: 'Áp dụng cho đơn hàng từ 500,000đ',
      category: 'voucher',
      stock: 'Còn hàng',
      image: '🎟️'
    },
    {
      id: 2,
      name: 'Voucher giảm 100,000đ',
      points: 350,
      description: 'Áp dụng cho đơn hàng từ 1,000,000đ',
      category: 'voucher',
      stock: 'Còn hàng',
      image: '🎟️'
    },
    {
      id: 3,
      name: 'Miễn phí 1 lần tắm rửa',
      points: 300,
      description: 'Dành cho chó dưới 10kg',
      category: 'service',
      stock: 'Còn hàng',
      image: '🛁'
    },
    {
      id: 4,
      name: 'Áo thú cưng cao cấp',
      points: 500,
      description: 'Size S, M, L - nhiều màu sắc',
      category: 'gift',
      stock: 'Còn 5',
      image: '👕'
    },
    {
      id: 5,
      name: 'Bộ đồ chơi cho thú cưng',
      points: 400,
      description: 'Gồm 5 món đồ chơi',
      category: 'gift',
      stock: 'Còn 10',
      image: '🎾'
    },
    {
      id: 6,
      name: 'Miễn phí khám sức khỏe',
      points: 600,
      description: 'Khám tổng quát + tư vấn',
      category: 'service',
      stock: 'Còn hàng',
      image: '🏥'
    }
  ];

  // Hạng thành viên
  const tiers = [
    { name: 'Đồng', minPoints: 0, color: '#CD7F32', benefits: ['Tích điểm cơ bản 1%'] },
    { name: 'Bạc', minPoints: 500, color: '#C0C0C0', benefits: ['Tích điểm 1.5%', 'Ưu tiên đặt lịch'] },
    { name: 'Vàng', minPoints: 1000, color: '#FFD700', benefits: ['Tích điểm 2%', 'Ưu tiên đặt lịch', 'Giảm 5% dịch vụ'] },
    { name: 'Bạch Kim', minPoints: 2000, color: '#E5E4E2', benefits: ['Tích điểm 3%', 'Ưu tiên cao nhất', 'Giảm 10% dịch vụ', 'Quà tặng sinh nhật'] }
  ];

  const calculateProgress = () => {
    const currentTierIndex = tiers.findIndex(t => t.name === loyaltyData.tier);
    const currentTier = tiers[currentTierIndex];
    const nextTier = tiers[currentTierIndex + 1];
    
    if (!nextTier) return 100;
    
    const pointsInCurrentTier = loyaltyData.totalPoints - currentTier.minPoints;
    const pointsNeeded = nextTier.minPoints - currentTier.minPoints;
    return (pointsInCurrentTier / pointsNeeded) * 100;
  };

  return (
    <div className="loyalty-view">
      {/* Header with points summary */}
      <div className="loyalty-header">
        <div className="points-card">
          <div className="points-icon">
            <StarIcon size={40} />
          </div>
          <div className="points-info">
            <h2>{loyaltyData.totalPoints.toLocaleString()}</h2>
            <p>Điểm tích lũy</p>
          </div>
          <div className="tier-badge" style={{ backgroundColor: loyaltyData.tierColor }}>
            <TrophyIcon size={20} />
            <span>{loyaltyData.tier}</span>
          </div>
        </div>

        <div className="tier-progress-card">
          <div className="progress-header">
            <span>Tiến độ lên hạng {loyaltyData.nextTier}</span>
            <span className="points-needed">{loyaltyData.pointsToNextTier} điểm nữa</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className="tier-markers">
            {tiers.map((tier, index) => (
              <div 
                key={tier.name} 
                className={`tier-marker ${loyaltyData.totalPoints >= tier.minPoints ? 'achieved' : ''}`}
                style={{ left: `${(index / (tiers.length - 1)) * 100}%` }}
              >
                <div className="marker-dot" style={{ backgroundColor: tier.color }}></div>
                <span className="marker-label">{tier.name}</span>
              </div>
            ))}
          </div>
        </div>

        {loyaltyData.expiringPoints > 0 && (
          <div className="expiring-alert">
            <ClockIcon size={20} />
            <span>
              <strong>{loyaltyData.expiringPoints} điểm</strong> sẽ hết hạn vào {loyaltyData.expiryDate}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="loyalty-tabs">
        <button 
          className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          <TrophyIcon size={18} />
          Hạng thành viên
        </button>
        <button 
          className={`tab ${selectedTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setSelectedTab('rewards')}
        >
          <GiftIcon size={18} />
          Đổi quà ({rewards.length})
        </button>
        <button 
          className={`tab ${selectedTab === 'history' ? 'active' : ''}`}
          onClick={() => setSelectedTab('history')}
        >
          <ClockIcon size={18} />
          Lịch sử ({pointsHistory.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="loyalty-content">
        {/* Tier Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="tiers-overview">
            <h3>Các hạng thành viên</h3>
            <div className="tiers-grid">
              {tiers.map((tier) => (
                <div 
                  key={tier.name} 
                  className={`tier-card ${loyaltyData.tier === tier.name ? 'current' : ''} ${loyaltyData.totalPoints >= tier.minPoints ? 'achieved' : ''}`}
                >
                  {loyaltyData.tier === tier.name && (
                    <div className="current-badge">
                      <CheckIcon size={16} /> Hạng hiện tại
                    </div>
                  )}
                  <div className="tier-header">
                    <div className="tier-icon" style={{ backgroundColor: tier.color }}>
                      <TrophyIcon size={32} />
                    </div>
                    <h4>{tier.name}</h4>
                    <p className="tier-requirement">Từ {tier.minPoints.toLocaleString()} điểm</p>
                  </div>
                  <div className="tier-benefits">
                    <h5>Quyền lợi:</h5>
                    <ul>
                      {tier.benefits.map((benefit, index) => (
                        <li key={index}>
                          <CheckIcon size={14} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {selectedTab === 'rewards' && (
          <div className="rewards-section">
            <div className="rewards-header">
              <h3>Phần thưởng có thể đổi</h3>
              <p>Bạn có {loyaltyData.totalPoints.toLocaleString()} điểm</p>
            </div>
            <div className="rewards-grid">
              {rewards.map((reward) => (
                <div key={reward.id} className="reward-card">
                  <div className="reward-image">{reward.image}</div>
                  <div className="reward-info">
                    <h4>{reward.name}</h4>
                    <p className="reward-description">{reward.description}</p>
                    <div className="reward-footer">
                      <div className="reward-points">
                        <StarIcon size={16} />
                        <span>{reward.points} điểm</span>
                      </div>
                      <span className="reward-stock">{reward.stock}</span>
                    </div>
                  </div>
                  <button 
                    className="redeem-btn"
                    disabled={loyaltyData.totalPoints < reward.points}
                  >
                    {loyaltyData.totalPoints >= reward.points ? (
                      <>Đổi ngay <ArrowRightIcon size={14} /></>
                    ) : (
                      'Không đủ điểm'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {selectedTab === 'history' && (
          <div className="history-section">
            <h3>Lịch sử tích điểm</h3>
            <div className="history-list">
              {pointsHistory.map((item) => (
                <div key={item.id} className={`history-item ${item.type}`}>
                  <div className="history-icon">
                    {item.type === 'earn' ? (
                      <div className="icon-earn">+</div>
                    ) : (
                      <div className="icon-redeem">−</div>
                    )}
                  </div>
                  <div className="history-details">
                    <h4>{item.description}</h4>
                    <p className="history-date">{new Date(item.date).toLocaleDateString('vi-VN')}</p>
                    {item.invoiceId && <p className="history-ref">Mã: {item.invoiceId}</p>}
                    {item.voucherId && <p className="history-ref">Mã: {item.voucherId}</p>}
                    {item.giftId && <p className="history-ref">Mã: {item.giftId}</p>}
                    {item.referralId && <p className="history-ref">Mã: {item.referralId}</p>}
                  </div>
                  <div className={`history-points ${item.type}`}>
                    {item.points > 0 ? '+' : ''}{item.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyView;
