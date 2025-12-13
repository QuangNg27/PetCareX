const express = require('express');
const ProductController = require('../controllers/ProductController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();
const productController = new ProductController();

// Product catalog endpoints (all authenticated users can view)
router.get('/', authMiddleware, productController.getAllProducts.bind(productController));

router.get('/by-branch', authMiddleware, productController.getProductsByBranch.bind(productController));

router.get('/categories', authMiddleware, productController.getProductCategories.bind(productController));

router.get('/:productId', authMiddleware, productController.getProduct.bind(productController));

router.get('/:productId/inventory', authMiddleware, productController.getProductInventory.bind(productController));

router.get('/:productId/price-history', authMiddleware, productController.getProductPriceHistory.bind(productController));

// Product management (managers only)
router.post('/',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    productController.createProduct.bind(productController)
);

router.put('/:productId',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    productController.updateProduct.bind(productController)
);

router.delete('/:productId',
    authMiddleware,
    authorizeRoles(['Quản lý công ty']),
    productController.deleteProduct.bind(productController)
);

// Price management (managers only)
router.put('/:productId/price',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    productController.updateProductPrice.bind(productController)
);

// Inventory management (staff only)
router.post('/inventory/update',
    authMiddleware,
    authorizeRoles(['Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    productController.updateInventory.bind(productController)
);

router.post('/inventory/bulk-update',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    productController.bulkUpdateInventory.bind(productController)
);

// Alert endpoints (staff only)
router.get('/alerts/low-stock',
    authMiddleware,
    authorizeRoles(['Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    productController.getLowStockAlert.bind(productController)
);

module.exports = router;