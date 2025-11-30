const express = require('express');
const ReviewController = require('../controllers/ReviewController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();
const reviewController = new ReviewController();

// Middleware xác thực cho tất cả routes
router.use(authMiddleware);

// Routes cho khách hàng
router.post('/', authorizeRoles(['Khách hàng']), reviewController.createReview);
router.get('/my-reviews', authorizeRoles(['Khách hàng']), reviewController.getMyReviews);

// Routes cho admin/manager
router.get('/recent', authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']), reviewController.getRecentReviews);
router.get('/customer/:customerId', authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']), reviewController.getCustomerReviews);

// Routes cho chi nhánh (có thể xem được bởi nhân viên chi nhánh)
router.get('/branch/:branchId', authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty', 'Tiếp tân']), reviewController.getBranchReviews);
router.get('/branch/:branchId/stats', authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']), reviewController.getBranchRatingStats);

// Route xem chi tiết đánh giá
router.get('/:reviewId', authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty', 'Khách hàng']), reviewController.getReviewById);

module.exports = router;