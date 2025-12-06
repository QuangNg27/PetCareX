import React, { useState } from 'react';
import { 
  StarIcon,
  MessageIcon,
  ThumbsUpIcon,
  ImageIcon,
  SendIcon,
  FilterIcon,
  SearchIcon
} from '@components/common/icons';
import './ReviewsView.css';

const ReviewsView = () => {
  const [activeTab, setActiveTab] = useState('my-reviews');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Đánh giá của tôi
  const myReviews = [
    {
      id: 1,
      serviceName: 'Dịch vụ tắm rửa',
      branch: 'Chi nhánh Quận 1',
      rating: 5,
      comment: 'Dịch vụ rất tốt, nhân viên tận tâm và chuyên nghiệp. Bé cún nhà mình rất thích!',
      date: '2025-12-01',
      images: ['image1.jpg', 'image2.jpg'],
      response: {
        text: 'Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của PetCareX!',
        date: '2025-12-02',
        staff: 'Quản lý'
      },
      helpful: 12
    },
    {
      id: 2,
      serviceName: 'Khám sức khỏe',
      branch: 'Chi nhánh Quận 3',
      rating: 4,
      comment: 'Bác sĩ khám rất kỹ, tư vấn chi tiết. Giá cả hợp lý.',
      date: '2025-11-25',
      images: [],
      response: null,
      helpful: 8
    },
    {
      id: 3,
      serviceName: 'Cắt tỉa lông',
      branch: 'Chi nhánh Quận 1',
      rating: 5,
      comment: 'Cắt đẹp lắm, bé nhà mình đẹp trai hơn hẳn. Sẽ quay lại!',
      date: '2025-11-20',
      images: ['image3.jpg'],
      response: {
        text: 'Rất vui vì bạn hài lòng với dịch vụ. Hẹn gặp lại bạn!',
        date: '2025-11-21',
        staff: 'Nhân viên'
      },
      helpful: 15
    }
  ];

  // Đánh giá của khách hàng khác
  const allReviews = [
    {
      id: 101,
      customerName: 'Nguyễn Văn A',
      serviceName: 'Dịch vụ tắm rửa',
      branch: 'Chi nhánh Quận 1',
      rating: 5,
      comment: 'Dịch vụ tuyệt vời, nhân viên rất nhiệt tình!',
      date: '2025-12-03',
      images: ['image.jpg'],
      helpful: 20,
      verified: true
    },
    {
      id: 102,
      customerName: 'Trần Thị B',
      serviceName: 'Khám sức khỏe',
      branch: 'Chi nhánh Quận 3',
      rating: 4,
      comment: 'Bác sĩ rất chuyên nghiệp, phòng khám sạch sẽ.',
      date: '2025-12-02',
      images: [],
      helpful: 15,
      verified: true
    },
    {
      id: 103,
      customerName: 'Lê Văn C',
      serviceName: 'Tiêm phòng',
      branch: 'Chi nhánh Quận 2',
      rating: 5,
      comment: 'Tiêm xong bé không bị sưng hay đau. Rất hài lòng!',
      date: '2025-12-01',
      images: [],
      helpful: 18,
      verified: true
    },
    {
      id: 104,
      customerName: 'Phạm Thị D',
      serviceName: 'Cắt tỉa lông',
      branch: 'Chi nhánh Quận 1',
      rating: 3,
      comment: 'Dịch vụ ổn nhưng hơi lâu, phải đợi khá nhiều.',
      date: '2025-11-30',
      images: [],
      helpful: 5,
      verified: false
    },
    {
      id: 105,
      customerName: 'Hoàng Văn E',
      serviceName: 'Spa thú cưng',
      branch: 'Chi nhánh Quận 7',
      rating: 5,
      comment: 'Dịch vụ spa tuyệt vời, bé nhà mình rất thích. Sẽ quay lại!',
      date: '2025-11-28',
      images: ['spa1.jpg', 'spa2.jpg'],
      helpful: 25,
      verified: true
    }
  ];

  // Dịch vụ đã sử dụng (có thể đánh giá)
  const servicesForReview = [
    { id: 1, name: 'Dịch vụ tắm rửa - 15/11/2025', canReview: true },
    { id: 2, name: 'Khám sức khỏe - 10/11/2025', canReview: true },
    { id: 3, name: 'Cắt tỉa lông - 05/11/2025', canReview: false }
  ];

  const handleSubmitReview = () => {
    if (rating > 0 && reviewText.trim() && selectedService) {
      console.log('Submit review:', { rating, reviewText, selectedService });
      setShowReviewModal(false);
      // Reset form
      setRating(0);
      setReviewText('');
      setSelectedService('');
    }
  };

  const renderStars = (currentRating, isInteractive = false) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= (isInteractive ? (hoverRating || rating) : currentRating) ? 'filled' : ''}`}
            onClick={() => isInteractive && setRating(star)}
            onMouseEnter={() => isInteractive && setHoverRating(star)}
            onMouseLeave={() => isInteractive && setHoverRating(0)}
            disabled={!isInteractive}
          >
            <StarIcon size={isInteractive ? 32 : 16} />
          </button>
        ))}
      </div>
    );
  };

  const filteredReviews = allReviews.filter(review => {
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    const matchesSearch = review.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const calculateAverageRating = () => {
    const total = allReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / allReviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  return (
    <div className="reviews-view">
      {/* Header */}
      <div className="reviews-header">
        <div className="header-info">
          <h2>Đánh giá dịch vụ</h2>
          <p className="reviews-count">
            {activeTab === 'my-reviews' ? myReviews.length : allReviews.length} đánh giá
          </p>
        </div>
        <button className="write-review-btn" onClick={() => setShowReviewModal(true)}>
          <MessageIcon size={18} />
          Viết đánh giá
        </button>
      </div>

      {/* Stats Summary (for all reviews tab) */}
      {activeTab === 'all-reviews' && (
        <div className="reviews-stats">
          <div className="average-rating">
            <div className="rating-number">{calculateAverageRating()}</div>
            <div className="rating-stars">{renderStars(Math.round(parseFloat(calculateAverageRating())))}</div>
            <div className="rating-count">{allReviews.length} đánh giá</div>
          </div>
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(star => {
              const count = getRatingDistribution()[star];
              const percentage = (count / allReviews.length) * 100;
              return (
                <div key={star} className="distribution-row">
                  <span className="star-label">{star} <StarIcon size={12} /></span>
                  <div className="distribution-bar">
                    <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="count-label">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="reviews-tabs">
        <button
          className={`tab ${activeTab === 'my-reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-reviews')}
        >
          <MessageIcon size={18} />
          Đánh giá của tôi ({myReviews.length})
        </button>
        <button
          className={`tab ${activeTab === 'all-reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('all-reviews')}
        >
          <StarIcon size={18} />
          Tất cả đánh giá ({allReviews.length})
        </button>
      </div>

      {/* Filters (for all reviews tab) */}
      {activeTab === 'all-reviews' && (
        <div className="reviews-filters">
          <div className="search-box">
            <SearchIcon size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm đánh giá..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <FilterIcon size={18} />
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
              <option value="all">Tất cả đánh giá</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-content">
        {activeTab === 'my-reviews' ? (
          <div className="reviews-list">
            {myReviews.length > 0 ? (
              myReviews.map(review => (
                <div key={review.id} className="review-card my-review">
                  <div className="review-header">
                    <div className="service-info">
                      <h4>{review.serviceName}</h4>
                      <p className="branch-name">{review.branch}</p>
                    </div>
                    <div className="review-date">{new Date(review.date).toLocaleDateString('vi-VN')}</div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  {review.images.length > 0 && (
                    <div className="review-images">
                      {review.images.map((img, idx) => (
                        <div key={idx} className="review-image">
                          <ImageIcon size={24} />
                        </div>
                      ))}
                    </div>
                  )}
                  {review.response && (
                    <div className="review-response">
                      <div className="response-header">
                        <strong>Phản hồi từ {review.response.staff}</strong>
                        <span>{new Date(review.response.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <p>{review.response.text}</p>
                    </div>
                  )}
                  <div className="review-footer">
                    <button className="helpful-btn">
                      <ThumbsUpIcon size={16} />
                      Hữu ích ({review.helpful})
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <MessageIcon size={64} />
                <h3>Chưa có đánh giá nào</h3>
                <p>Hãy sử dụng dịch vụ và để lại đánh giá của bạn!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="reviews-list">
            {filteredReviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4>
                        {review.customerName}
                        {review.verified && <span className="verified-badge">✓ Đã xác thực</span>}
                      </h4>
                      <p className="service-name">{review.serviceName} - {review.branch}</p>
                    </div>
                  </div>
                  <div className="review-date">{new Date(review.date).toLocaleDateString('vi-VN')}</div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
                <p className="review-comment">{review.comment}</p>
                {review.images.length > 0 && (
                  <div className="review-images">
                    {review.images.map((img, idx) => (
                      <div key={idx} className="review-image">
                        <ImageIcon size={24} />
                      </div>
                    ))}
                  </div>
                )}
                <div className="review-footer">
                  <button className="helpful-btn">
                    <ThumbsUpIcon size={16} />
                    Hữu ích ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Viết đánh giá</h3>
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Chọn dịch vụ đã sử dụng *</label>
                <select 
                  className="form-input"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">-- Chọn dịch vụ --</option>
                  {servicesForReview.map(service => (
                    <option key={service.id} value={service.id} disabled={!service.canReview}>
                      {service.name} {!service.canReview && '(Đã đánh giá)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Đánh giá của bạn *</label>
                <div className="rating-input">
                  {renderStars(rating, true)}
                  <span className="rating-text">
                    {rating === 0 && 'Chọn số sao'}
                    {rating === 1 && 'Rất tệ'}
                    {rating === 2 && 'Tệ'}
                    {rating === 3 && 'Bình thường'}
                    {rating === 4 && 'Tốt'}
                    {rating === 5 && 'Tuyệt vời'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Nhận xét *</label>
                <textarea
                  className="form-input"
                  rows="5"
                  placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
                <div className="char-count">{reviewText.length}/500</div>
              </div>

              <div className="form-group">
                <label>Thêm hình ảnh (Tùy chọn)</label>
                <div className="image-upload">
                  <button type="button" className="upload-btn">
                    <ImageIcon size={24} />
                    <span>Chọn ảnh</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowReviewModal(false)}>
                Hủy
              </button>
              <button 
                className="submit-btn"
                onClick={handleSubmitReview}
                disabled={!rating || !reviewText.trim() || !selectedService}
              >
                <SendIcon size={18} />
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsView;
