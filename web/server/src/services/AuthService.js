const jwt = require('jsonwebtoken');
const AuthRepository = require('../repositories/AuthRepository');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
    constructor() {
        this.authRepo = new AuthRepository();
    }

    async register(userData, accountData) {
        // Remove redundant checks - let database handle unique constraints
        // Database will throw appropriate errors that we'll translate in error handler
        
        try {
            const result = await this.authRepo.createAccount(userData, accountData);
            
            return {
                success: true,
                message: 'Đăng ký tài khoản thành công',
                data: { MaKH: result.MaKH }
            };
        } catch (error) {
            // Let global error handler translate SQL constraint violations
            throw error;
        }
    }

    async login(credentials) {
        const { TenDangNhap, MatKhau } = credentials;

        // Find account
        const account = await this.authRepo.findAccountByUsername(TenDangNhap);
        if (!account) {
            throw new AppError('Tên đăng nhập không đúng', 401);
        }

        // Verify password
        const isValidPassword = await this.authRepo.verifyPassword(MatKhau, account.MatKhau);
        if (!isValidPassword) {
            throw new AppError('Mật khẩu không đúng', 401);
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: account.MaTK,
                username: account.TenDangNhap,
                role: account.VaiTro,
                customerId: account.MaKH,
                employeeId: account.MaNV
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                token,
                user: {
                    MaTK: account.MaTK,
                    TenDangNhap: account.TenDangNhap,
                    VaiTro: account.VaiTro,
                    HoTen: account.HoTen,
                    ChucVu: account.ChucVu,
                    MaKH: account.MaKH,
                    MaNV: account.MaNV
                }
            }
        };
    }

    async changePassword(username, oldPassword, newPassword) {
        // Find account
        const account = await this.authRepo.findAccountByUsername(username);
        if (!account) {
            throw new AppError('Tài khoản không tồn tại', 404);
        }

        // Verify old password
        const isValidPassword = await this.authRepo.verifyPassword(oldPassword, account.MatKhau);
        if (!isValidPassword) {
            throw new AppError('Mật khẩu cũ không đúng', 400);
        }

        // Update password
        await this.authRepo.changePassword(username, newPassword);

        return {
            success: true,
            message: 'Đổi mật khẩu thành công'
        };
    }

    async getProfile(username) {
        const account = await this.authRepo.findAccountByUsername(username);
        if (!account) {
            throw new AppError('Tài khoản không tồn tại', 404);
        }

        return {
            success: true,
            data: {
                MaTK: account.MaTK,
                TenDangNhap: account.TenDangNhap,
                VaiTro: account.VaiTro,
                HoTen: account.HoTen,
                ChucVu: account.ChucVu,
                MaKH: account.MaKH,
                MaNV: account.MaNV
            }
        };
    }
}

module.exports = AuthService;