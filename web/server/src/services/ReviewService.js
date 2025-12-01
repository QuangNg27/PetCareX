const ReviewRepository = require('../repositories/ReviewRepository');
const { AppError } = require('../middleware/errorHandler');

class ReviewService {
    constructor() {
        this.reviewRepository = new ReviewRepository();
    }

    // Tạo đánh giá mới
    async createReview(data) {
        try {
            const { customerId, branchId, chatLuong, thaiDo, mucDoHaiLong, binhLuan } = data;

            const review = await this.reviewRepository.createReview(
                customerId, branchId, chatLuong, thaiDo, mucDoHaiLong, binhLuan
            );

            return {
                success: true,
                message: 'Tạo đánh giá thành công',
                data: review
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Lỗi khi tạo đánh giá: ' + error.message, 500);
        }
    }

    // Lấy đánh giá của khách hàng
    async getCustomerReviews(customerId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const reviews = await this.reviewRepository.getReviewsByCustomer(customerId, limit, offset);
            
            return {
                success: true,
                data: reviews,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: reviews.length
                }
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy đánh giá khách hàng: ' + error.message, 500);
        }
    }

    // Lấy đánh giá của chi nhánh
    async getBranchReviews(branchId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const reviews = await this.reviewRepository.getReviewsByBranch(branchId, limit, offset);
            
            return {
                success: true,
                data: reviews,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: reviews.length
                }
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy đánh giá chi nhánh: ' + error.message, 500);
        }
    }

    // Lấy thống kê điểm đánh giá trung bình
    async getBranchRatingStats(branchId) {
        try {
            const stats = await this.reviewRepository.getAverageRating(branchId);
            
            if (!stats) {
                return {
                    success: true,
                    message: 'Chưa có đánh giá nào cho chi nhánh này',
                    data: null
                };
            }

            return {
                success: true,
                data: {
                    ...stats,
                    // Tính điểm tổng trung bình
                    DiemTongTB: stats.TongSoDanhGia > 0 ? 
                        ((stats.DiemChatLuongTB + stats.ThaiDoNVTB + stats.MucDoHaiLongTB) / 3).toFixed(2) : 0
                }
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy thống kê đánh giá: ' + error.message, 500);
        }
    }

    // Lấy đánh giá mới nhất
    async getRecentReviews(limit = 5) {
        try {
            const reviews = await this.reviewRepository.getRecentReviews(limit);
            
            return {
                success: true,
                data: reviews
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy đánh giá mới nhất: ' + error.message, 500);
        }
    }
}

module.exports = ReviewService;