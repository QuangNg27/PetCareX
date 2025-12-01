const express = require('express');
const ProductController = require('../controllers/ProductController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();
const productController = new ProductController();

// Product catalog endpoints (all authenticated users can view)
router.get('/', authMiddleware, productController.getAllProducts);

router.get('/categories', authMiddleware, productController.getProductCategories);

router.get('/:productId', authMiddleware, productController.getProduct);

router.get('/:productId/inventory', authMiddleware, productController.getProductInventory);

router.get('/:productId/price-history', authMiddleware, productController.getProductPriceHistory);

// Product management (managers only)
router.post('/',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    productController.createProduct
);

router.put('/:productId',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    productController.updateProduct
);

router.delete('/:productId',
    authMiddleware,
    authorizeRoles(['Quản lý công ty']),
    productController.deleteProduct
);

// Price management (managers only)
router.put('/:productId/price',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    productController.updateProductPrice
);

// Inventory management (staff only)
router.post('/inventory/update',
    authMiddleware,
    authorizeRoles(['Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    productController.updateInventory
);

router.post('/inventory/bulk-update',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    productController.bulkUpdateInventory
);

// Alert endpoints (staff only)
router.get('/alerts/low-stock',
    authMiddleware,
    authorizeRoles(['Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    productController.getLowStockAlert
);

module.exports = router;