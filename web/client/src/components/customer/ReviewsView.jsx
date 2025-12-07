import React, { useState, useMemo } from 'react';
import { 
  StarIcon,
  MessageIcon,
  SendIcon,
  FilterIcon,
  SearchIcon,
  XIcon
} from '@components/common/icons';

// Mock data
const MOCK_MY_REVIEWS = [
  {
    id: 1, serviceName: 'Dịch vụ tắm rửa', branch: 'Chi nhánh Quận 1', rating: 5,
    comment: 'Dịch vụ rất tốt, nhân viên tận tâm và chuyên nghiệp. Bé cún nhà mình rất thích!',
    date: '2025-12-01', images: ['image1.jpg', 'image2.jpg'],
    response: { text: 'Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của PetCareX!', date: '2025-12-02', staff: 'Quản lý' },
    helpful: 12
  },
  {
    id: 2, serviceName: 'Khám sức khỏe', branch: 'Chi nhánh Quận 3', rating: 4,
    comment: 'Bác sĩ khám rất kỹ, tư vấn chi tiết. Giá cả hợp lý.', date: '2025-11-25', images: [],
    response: null, helpful: 8
  },
  {
    id: 3, serviceName: 'Cắt tỉa lông', branch: 'Chi nhánh Quận 1', rating: 5,
    comment: 'Cắt đẹp lắm, bé nhà mình đẹp trai hơn hẳn. Sẽ quay lại!', date: '2025-11-20', images: ['image3.jpg'],
    response: { text: 'Rất vui vì bạn hài lòng với dịch vụ. Hẹn gặp lại bạn!', date: '2025-11-21', staff: 'Nhân viên' },
    helpful: 15
  }
];

const MOCK_ALL_REVIEWS = [
  { id: 101, customerName: 'Nguyễn Văn A', serviceName: 'Dịch vụ tắm rửa', branch: 'Chi nhánh Quận 1', rating: 5, comment: 'Dịch vụ tuyệt vời, nhân viên rất nhiệt tình!', date: '2025-12-03', images: ['image.jpg'], helpful: 20, verified: true },
  { id: 102, customerName: 'Trần Thị B', serviceName: 'Khám sức khỏe', branch: 'Chi nhánh Quận 3', rating: 4, comment: 'Bác sĩ rất chuyên nghiệp, phòng khám sạch sẽ.', date: '2025-12-02', images: [], helpful: 15, verified: true },
  { id: 103, customerName: 'Lê Văn C', serviceName: 'Tiêm phòng', branch: 'Chi nhánh Quận 2', rating: 5, comment: 'Tiêm xong bé không bị sưng hay đau. Rất hài lòng!', date: '2025-12-01', images: [], helpful: 18, verified: true },
  { id: 104, customerName: 'Phạm Thị D', serviceName: 'Cắt tỉa lông', branch: 'Chi nhánh Quận 1', rating: 3, comment: 'Dịch vụ ổn nhưng hơi lâu, phải đợi khá nhiều.', date: '2025-11-30', images: [], helpful: 5, verified: false },
  { id: 105, customerName: 'Hoàng Văn E', serviceName: 'Spa thú cưng', branch: 'Chi nhánh Quận 7', rating: 5, comment: 'Dịch vụ spa tuyệt vời, bé nhà mình rất thích. Sẽ quay lại!', date: '2025-11-28', images: ['spa1.jpg', 'spa2.jpg'], helpful: 25, verified: true }
];

const SERVICES_FOR_REVIEW = [
  { id: 1, name: 'Dịch vụ tắm rửa - 15/11/2025', canReview: true },
  { id: 2, name: 'Khám sức khỏe - 10/11/2025', canReview: true },
  { id: 3, name: 'Cắt tỉa lông - 05/11/2025', canReview: false }
];

const ReviewsView = () => {
  const [activeTab, setActiveTab] = useState('my-reviews');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [serviceQualityRating, setServiceQualityRating] = useState(0);
  const [staffAttitudeRating, setStaffAttitudeRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [hoverServiceQuality, setHoverServiceQuality] = useState(0);
  const [hoverStaffAttitude, setHoverStaffAttitude] = useState(0);
  const [hoverOverall, setHoverOverall] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const myReviews = MOCK_MY_REVIEWS;
  const allReviews = MOCK_ALL_REVIEWS;

  const handleSubmitReview = () => {
    if (serviceQualityRating > 0 && staffAttitudeRating > 0 && overallRating > 0 && reviewText.trim() && selectedService) {
      // TODO: Call API to submit review
      setShowReviewModal(false);
      setServiceQualityRating(0);
      setStaffAttitudeRating(0);
      setOverallRating(0);
      setReviewText('');
      setSelectedService('');
    }
  };

  const renderStars = (currentRating, isInteractive = false, ratingType = null) => {
    let hoverValue = 0;
    let setRatingFunc = null;
    let setHoverFunc = null;
    
    if (isInteractive && ratingType) {
      if (ratingType === 'service') {
        hoverValue = hoverServiceQuality;
        setRatingFunc = setServiceQualityRating;
        setHoverFunc = setHoverServiceQuality;
      } else if (ratingType === 'staff') {
        hoverValue = hoverStaffAttitude;
        setRatingFunc = setStaffAttitudeRating;
        setHoverFunc = setHoverStaffAttitude;
      } else if (ratingType === 'overall') {
        hoverValue = hoverOverall;
        setRatingFunc = setOverallRating;
        setHoverFunc = setHoverOverall;
      }
    }
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`transition-colors ${star <= (isInteractive ? (hoverValue || currentRating) : currentRating) ? 'text-warning-500' : 'text-gray-300'} ${isInteractive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            onClick={() => isInteractive && setRatingFunc && setRatingFunc(star)}
            onMouseEnter={() => isInteractive && setHoverFunc && setHoverFunc(star)}
            onMouseLeave={() => isInteractive && setHoverFunc && setHoverFunc(0)}
            disabled={!isInteractive}
          >
            <StarIcon size={isInteractive ? 28 : 16} />
          </button>
        ))}
      </div>
    );
  };

  const filteredReviews = useMemo(() => 
    allReviews.filter(review => {
      const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
      const matchesSearch = review.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            review.comment.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRating && matchesSearch;
    }),
    [filterRating, searchQuery]
  );

  const averageRating = useMemo(() => {
    const total = allReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / allReviews.length).toFixed(1);
  }, []);

  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(review => distribution[review.rating]++);
    return distribution;
  }, []);

  const ratingLabels = { 0: 'Chọn số sao', 1: 'Rất tệ', 2: 'Tệ', 3: 'Bình thường', 4: 'Tốt', 5: 'Tuyệt vời' };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-0.5">Đánh giá dịch vụ</h2>
          <p className="text-sm text-gray-600">
            {activeTab === 'my-reviews' ? myReviews.length : allReviews.length} đánh giá
          </p>
        </div>
        <button 
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg"
          onClick={() => setShowReviewModal(true)}
        >
          <MessageIcon size={18} />
          Viết đánh giá
        </button>
      </div>

      {/* Stats Summary (for all reviews tab) */}
      {activeTab === 'all-reviews' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex gap-8">
          <div className="flex flex-col items-center justify-center border-r border-gray-200 pr-8">
            <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
            <div className="mb-2">{renderStars(Math.round(parseFloat(averageRating)))}</div>
            <div className="text-sm text-gray-600">{allReviews.length} đánh giá</div>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingDistribution[star];
              const percentage = (count / allReviews.length) * 100;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1 w-12">
                    {star} <StarIcon size={12} />
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-warning-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'my-reviews' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('my-reviews')}
        >
          <MessageIcon size={18} />
          Đánh giá của tôi ({myReviews.length})
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'all-reviews' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('all-reviews')}
        >
          <StarIcon size={18} />
          Tất cả đánh giá ({allReviews.length})
        </button>
      </div>

      {/* Filters (for all reviews tab) */}
      {activeTab === 'all-reviews' && (
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đánh giá..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white">
            <FilterIcon size={18} className="text-gray-600" />
            <select 
              className="text-sm font-medium text-gray-700 outline-none bg-transparent cursor-pointer"
              value={filterRating} 
              onChange={(e) => setFilterRating(e.target.value)}
            >
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
      <div className="space-y-4">
        {activeTab === 'my-reviews' ? (
          myReviews.length > 0 ? (
            myReviews.map(review => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{review.serviceName}</h4>
                    <p className="text-sm text-gray-600">{review.branch}</p>
                  </div>
                  <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('vi-VN')}</div>
                </div>
                <div className="mb-3">{renderStars(review.rating)}</div>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MessageIcon size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có đánh giá nào</h3>
              <p className="text-gray-600">Hãy sử dụng dịch vụ và để lại đánh giá của bạn!</p>
            </div>
          )
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      {review.customerName}
                      {review.verified && <span className="px-2 py-0.5 bg-success-100 text-success-700 text-xs font-bold rounded">✓ Đã xác thực</span>}
                    </h4>
                    <p className="text-xs text-gray-600">{review.serviceName} - {review.branch}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('vi-VN')}</div>
              </div>
              <div className="mb-3">{renderStars(review.rating)}</div>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5" onClick={() => setShowReviewModal(false)}>
          <div className="bg-white rounded-xl max-h-[90vh] overflow-y-auto shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Viết đánh giá</h3>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => setShowReviewModal(false)}
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Chọn dịch vụ đã sử dụng *</label>
                <select 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">-- Chọn dịch vụ --</option>
                  {SERVICES_FOR_REVIEW.map(service => (
                    <option key={service.id} value={service.id} disabled={!service.canReview}>
                      {service.name} {!service.canReview && '(Đã đánh giá)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Đánh giá chi tiết *</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chất lượng dịch vụ</label>
                    <div className="flex items-center gap-4">
                      {renderStars(serviceQualityRating, true, 'service')}
                      <span className="text-sm font-medium text-gray-700">
                        {ratingLabels[serviceQualityRating]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thái độ nhân viên</label>
                    <div className="flex items-center gap-4">
                      {renderStars(staffAttitudeRating, true, 'staff')}
                      <span className="text-sm font-medium text-gray-700">
                        {ratingLabels[staffAttitudeRating]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá tổng quát</label>
                    <div className="flex items-center gap-4">
                      {renderStars(overallRating, true, 'overall')}
                      <span className="text-sm font-medium text-gray-700">
                        {ratingLabels[overallRating]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Nhận xét *</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows="5"
                  placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={500}
                ></textarea>
                <div className="text-xs text-gray-500 mt-1 text-right">{reviewText.length}/500</div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button 
                className="px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                onClick={() => setShowReviewModal(false)}
              >
                Hủy
              </button>
              <button 
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmitReview}
                disabled={!serviceQualityRating || !staffAttitudeRating || !overallRating || !reviewText.trim() || !selectedService}
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
