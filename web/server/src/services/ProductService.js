const ProductRepository = require('../repositories/ProductRepository');
const { AppError } = require('../middleware/errorHandler');

class ProductService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(filters = {}) {
        const products = await this.productRepository.getAllProducts(filters);
        
        return products.map(product => ({
            ...product,
            TrangThaiTonKho: this.getStockStatus(product.TongTonKho),
            TrangThaiHanSuDung: this.getExpiryStatus(product.HanSD)
        }));
    }

    async getProduct(productId) {
        const product = await this.productRepository.getProduct(productId);
        
        if (!product) {
            throw new AppError('Không tìm thấy sản phẩm', 404);
        }

        // Get inventory across all branches
        const inventory = await this.productRepository.getProductInventory(productId);
        
        return {
            ...product,
            inventory,
            TrangThaiHanSuDung: this.getExpiryStatus(product.HanSD)
        };
    }

    async getProductInventory(productId, branchId = null) {
        const product = await this.productRepository.getProduct(productId);
        if (!product) {
            throw new AppError('Không tìm thấy sản phẩm', 404);
        }

        const inventory = await this.productRepository.getProductInventory(productId, branchId);
        
        return {
            product,
            inventory
        };
    }

    async updateProductPrice(productId, priceData, userRole) {
        // Only company managers can update prices
        if (userRole !== 'Quản lý công ty') {
            throw new AppError('Bạn không có quyền cập nhật giá sản phẩm', 403);
        }

        const { price, effectiveDate } = priceData;
        
        // Validate product exists
        const product = await this.productRepository.getProduct(productId);
        if (!product) {
            throw new AppError('Không tìm thấy sản phẩm', 404);
        }

        const result = await this.productRepository.updateProductPrice(productId, price, effectiveDate);
        
        return {
            success: true,
            message: 'Cập nhật giá sản phẩm thành công'
        };
    }

    async getProductPriceHistory(productId) {
        const product = await this.productRepository.getProduct(productId);
        if (!product) {
            throw new AppError('Không tìm thấy sản phẩm', 404);
        }

        const history = await this.productRepository.getProductPriceHistory(productId);
        
        return {
            product,
            priceHistory: history
        };
    }

    async updateInventory(inventoryData, userRole) {
        // Only staff can update inventory
        if (userRole === 'Khách hàng') {
            throw new AppError('Bạn không có quyền cập nhật kho hàng', 403);
        }

        const { MaSP, MaCN, SoLuongThayDoi } = inventoryData;

        // Validate product and branch exist
        const product = await this.productRepository.getProduct(MaSP);
        if (!product) {
            throw new AppError('Không tìm thấy sản phẩm', 404);
        }

        // Inventory validation will be handled by database constraints

        const result = await this.productRepository.updateInventory({
            MaSP,
            MaCN,
            SoLuongThayDoi
        });

        return {
            success: true,
            message: `Cập nhật kho hàng thành công`
        };
    }

    async getProductsByCategory(category) {
        if (!category) {
            throw new AppError('Loại sản phẩm không được để trống', 400);
        }
        
        const products = await this.productRepository.getProductsByCategory(category);
        return products;
    }

    async getLowStockAlert(branchId = null, threshold = 10) {
        const lowStockProducts = await this.productRepository.getLowStockProducts(branchId, threshold);
        
        return {
            threshold,
            lowStockCount: lowStockProducts.length,
            products: lowStockProducts
        };
    }

    async createProduct(productData, userRole) {
        // Only company managers can create products
        if (userRole !== 'Quản lý công ty') {
            throw new AppError('Bạn không có quyền tạo sản phẩm mới', 403);
        }

        const { MaSP, TenSP, LoaiSP, XuatXu, HanSD, MoTa, GiaGoc } = productData;

        // Expiry date validation handled by business logic if needed

        const result = await this.productRepository.createProduct({
            MaSP,
            TenSP,
            LoaiSP,
            XuatXu,
            HanSD,
            MoTa,
            GiaGoc
        });

        return {
            success: true,
            message: 'Tạo sản phẩm thành công',
            productId: result.MaSP
        };
    }

    async updateProduct(productId, updateData, userRole) {
        // Only company managers can update products
        if (userRole !== 'Quản lý công ty') {
            throw new AppError('Bạn không có quyền cập nhật sản phẩm', 403);
        }


        // Expiry date validation handled by business logic if needed

        const result = await this.productRepository.updateProduct(productId, updateData);
        
        if (!result) {
            throw new AppError('Cập nhật sản phẩm thất bại', 500);
        }

        return {
            success: true,
            message: 'Cập nhật sản phẩm thành công'
        };
    }

    async deleteProduct(productId, userRole) {
        // Only company managers can delete products
        if (userRole !== 'Quản lý công ty') {
            throw new AppError('Bạn không có quyền xóa sản phẩm', 403);
        }

        try {
            const result = await this.productRepository.deleteProduct(productId);
            
            if (!result) {
                throw new AppError('Xóa sản phẩm thất bại', 500);
            }

            return {
                success: true,
                message: 'Xóa sản phẩm thành công'
            };
        } catch (error) {
            if (error.message.includes('đã được sử dụng')) {
                throw new AppError(error.message, 400);
            }
            throw error;
        }
    }

    // Helper methods
    getStockStatus(quantity) {
        if (quantity <= 0) return 'Hết hàng';
        if (quantity <= 10) return 'Sắp hết';
        if (quantity <= 50) return 'Ít';
        return 'Đủ';
    }

    getExpiryStatus(expiryDate) {
        if (!expiryDate) return 'Không có hạn sử dụng';
        
        const now = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 0) return 'Đã hết hạn';
        if (daysUntilExpiry <= 7) return 'Sắp hết hạn';
        if (daysUntilExpiry <= 30) return 'Gần hết hạn';
        return 'Còn hạn';
    }
}

module.exports = ProductService;