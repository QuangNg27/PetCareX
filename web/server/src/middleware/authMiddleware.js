const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const pool = require('../config/db');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : null;

        if (!token) {
            return next(new AppError('Không có token xác thực', 401));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user info from database
        const request = (await pool).request();
        request.input('TenDangNhap', decoded.username);
        
        const result = await request.query(`
            SELECT 
                tk.MaTK,
                tk.TenDangNhap,
                tk.VaiTro,
                tk.MaKH,
                tk.MaNV,
                CASE 
                    WHEN tk.MaKH IS NOT NULL THEN kh.HoTen
                    WHEN tk.MaNV IS NOT NULL THEN nv.HoTen
                    ELSE NULL
                END AS HoTen,
                CASE 
                    WHEN tk.MaNV IS NOT NULL THEN nv.ChucVu
                    ELSE NULL
                END AS ChucVu
            FROM Tai_khoan tk
            LEFT JOIN Khach_hang kh ON tk.MaKH = kh.MaKH
            LEFT JOIN Nhan_vien nv ON tk.MaNV = nv.MaNV
            WHERE tk.TenDangNhap = @TenDangNhap
        `);

        if (result.recordset.length === 0) {
            return next(new AppError('Tài khoản không tồn tại', 401));
        }

        // Add user info to request
        req.user = result.recordset[0];
        next();

    } catch (error) {
        next(error);
    }
};

// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Unauthorized', 401));
        }

        if (!roles.includes(req.user.VaiTro)) {
            return next(new AppError('Không có quyền truy cập', 403));
        }

        next();
    };
};

// Branch access control for staff
const checkBranchAccess = async (req, res, next) => {
    try {
        if (req.user.VaiTro === 'Khách hàng' || req.user.VaiTro === 'Quản lý công ty') {
            return next();
        }

        const branchId = req.params.branchId || req.body.MaCN;
        if (!branchId) {
            return next();
        }

        const request = (await pool).request();
        request.input('MaNV', req.user.MaNV);
        request.input('MaCN', branchId);

        const result = await request.query(`
            SELECT 1 FROM Lich_su_nhan_vien 
            WHERE MaNV = @MaNV 
            AND MaCN = @MaCN 
            AND NgayBD <= CAST(GETDATE() AS DATE)
            AND (NgayKT IS NULL OR NgayKT >= CAST(GETDATE() AS DATE))
        `);

        if (result.recordset.length === 0) {
            return next(new AppError('Không có quyền truy cập chi nhánh này', 403));
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authMiddleware,
    authorize,
    checkBranchAccess
};