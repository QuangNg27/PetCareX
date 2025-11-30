const express = require('express');
const ProductController = require('../controllers/ProductController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const validateRequest = require('../middleware/validateRequest');
const productValidation = require('../utils/productValidation');

const router = express.Router();
const productController = new ProductController();

// Product catalog endpoints (all authenticated users can view)
router.get('/',
    auth,
    productController.getAllProducts.bind(productController)
);

router.get('/categories',
    auth,
    productController.getProductCategories.bind(productController)
);

router.get('/:productId',
    auth,
    productController.getProduct.bind(productController)
);

router.get('/:productId/inventory',
    auth,
    productController.getProductInventory.bind(productController)
);

router.get('/:productId/price-history',
    auth,
    productController.getProductPriceHistory.bind(productController)
);

// Product management (managers only)
router.post('/',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(productValidation.createProductSchema),
    productController.createProduct.bind(productController)
);

router.put('/:productId',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(productValidation.updateProductSchema),
    productController.updateProduct.bind(productController)
);

router.delete('/:productId',
    auth,
    authorizeRoles(['Quản lý công ty']),
    productController.deleteProduct.bind(productController)
);

// Price management (managers only)
router.put('/:productId/price',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(productValidation.updatePriceSchema),
    productController.updateProductPrice.bind(productController)
);

// Inventory management (staff only)
router.post('/inventory/update',
    auth,
    authorizeRoles(['Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(productValidation.updateInventorySchema),
    productController.updateInventory.bind(productController)
);

router.post('/inventory/bulk-update',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(productValidation.bulkUpdateInventorySchema),
    productController.bulkUpdateInventory.bind(productController)
);

// Alert endpoints (staff only)
router.get('/alerts/low-stock',
    auth,
    authorizeRoles(['Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    productController.getLowStockAlert.bind(productController)
);

module.exports = router;