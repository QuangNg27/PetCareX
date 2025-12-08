const ReviewService = require('../services/ReviewService');

class ReviewController {
    constructor() {
        this.reviewService = new ReviewService();
    }

    // Tạo đánh giá mới
    createReview = async (req, res, next) => {
        try {
            const { branchId, chatLuong, thaiDo, mucDoHaiLong, binhLuan } = req.body;
            const customerId = req.user.MaKH; // Lấy từ middleware auth

            const result = await this.reviewService.createReview({
                customerId,
                branchId,
                chatLuong,
                thaiDo,
                mucDoHaiLong,
                binhLuan
            });

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lấy đánh giá của khách hàng hiện tại
    getMyReviews = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await this.reviewService.getCustomerReviews(customerId, page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lấy đánh giá của khách hàng cụ thể (admin/manager)
    getCustomerReviews = async (req, res, next) => {
        try {
            const { customerId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const result = await this.reviewService.getCustomerReviews(customerId, page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lấy đánh giá của chi nhánh
    getBranchReviews = async (req, res, next) => {
        try {
            const { branchId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const result = await this.reviewService.getBranchReviews(branchId, page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lấy thống kê điểm đánh giá chi nhánh
    getBranchRatingStats = async (req, res, next) => {
        try {
            const { branchId } = req.params;

            const result = await this.reviewService.getBranchRatingStats(branchId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lấy đánh giá mới nhất (dashboard)
    getRecentReviews = async (req, res, next) => {
        try {
            const { limit = 5 } = req.query;

            const result = await this.reviewService.getRecentReviews(limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lấy tất cả đánh giá
    getAllReviews = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 0; // 0 = get all

            const result = await this.reviewService.getAllReviews(page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lấy đánh giá theo ID
    getReviewById = async (req, res, next) => {
        try {
            const { reviewId } = req.params;

            const result = await this.reviewService.getReviewById(reviewId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = ReviewController;