const ProductService = require('../services/ProductService');
const { AppError } = require('../middleware/errorHandler');

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    async getAllProducts(req, res, next) {
        try {
            const { category, search, page, limit } = req.query;
            
            const filters = {
                category,
                search,
                limit: parseInt(limit) || 50,
                offset: ((parseInt(page) || 1) - 1) * (parseInt(limit) || 50)
            };

            const products = await this.productService.getAllProducts(filters);

            res.json({
                success: true,
                data: {
                    products,
                    pagination: {
                        page: parseInt(page) || 1,
                        limit: parseInt(limit) || 50
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getProduct(req, res, next) {
        try {
            const { productId } = req.params;

            const product = await this.productService.getProduct(productId);

            res.json({
                success: true,
                data: { product }
            });
        } catch (error) {
            next(error);
        }
    }

    async getProductInventory(req, res, next) {
        try {
            const { productId } = req.params;
            const { branchId } = req.query;

            const result = await this.productService.getProductInventory(productId, branchId);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProductPrice(req, res, next) {
        try {
            const { productId } = req.params;
            const { price, effectiveDate } = req.body;
            const userRole = req.user.role;

            // Price validation handled by database CHECK constraint

            const result = await this.productService.updateProductPrice(
                productId,
                { price, effectiveDate },
                userRole
            );

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async getProductPriceHistory(req, res, next) {
        try {
            const { productId } = req.params;

            const result = await this.productService.getProductPriceHistory(productId);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateInventory(req, res, next) {
        try {
            const { MaSP, MaCN, SoLuongThayDoi, LoaiGiaoDich, LyDo } = req.body;
            const userRole = req.user.role;

            // Validation handled by Joi schema and database constraints

            const result = await this.productService.updateInventory(
                { MaSP, MaCN, SoLuongThayDoi, LoaiGiaoDich, LyDo },
                userRole
            );

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async getProductCategories(req, res, next) {
        try {
            const categories = await this.productService.getProductCategories();

            res.json({
                success: true,
                data: { categories }
            });
        } catch (error) {
            next(error);
        }
    }

    async getLowStockAlert(req, res, next) {
        try {
            const { branchId, threshold } = req.query;

            const alert = await this.productService.getLowStockAlert(
                branchId, 
                parseInt(threshold) || 10
            );

            res.json({
                success: true,
                data: alert
            });
        } catch (error) {
            next(error);
        }
    }

    async createProduct(req, res, next) {
        try {
            const { MaSP, TenSP, LoaiSP, XuatXu, HanSD, MoTa, GiaGoc } = req.body;
            const userRole = req.user.role;

            const result = await this.productService.createProduct(
                { MaSP, TenSP, LoaiSP, XuatXu, HanSD, MoTa, GiaGoc },
                userRole
            );

            res.status(201).json({
                success: true,
                message: result.message,
                data: { productId: result.productId }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { productId } = req.params;
            const { TenSP, LoaiSP, LoaiVaccine, NgaySX } = req.body;
            const userRole = req.user.role;

            const result = await this.productService.updateProduct(
                productId,
                { TenSP, LoaiSP, LoaiVaccine, NgaySX },
                userRole
            );

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { productId } = req.params;
            const userRole = req.user.role;

            const result = await this.productService.deleteProduct(productId, userRole);

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async bulkUpdateInventory(req, res, next) {
        try {
            const { updates } = req.body; // Array of inventory updates
            const userRole = req.user.role;

            if (!Array.isArray(updates) || updates.length === 0) {
                throw new AppError('Danh sách cập nhật không hợp lệ', 400);
            }

            const results = [];
            for (const update of updates) {
                try {
                    const result = await this.productService.updateInventory(update, userRole);
                    results.push({ ...update, success: true });
                } catch (error) {
                    results.push({ ...update, success: false, error: error.message });
                }
            }

            const successCount = results.filter(r => r.success).length;
            const failureCount = results.length - successCount;

            res.json({
                success: true,
                message: `Cập nhật hoàn tất: ${successCount} thành công, ${failureCount} thất bại`,
                data: {
                    results,
                    summary: {
                        total: results.length,
                        successful: successCount,
                        failed: failureCount
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;