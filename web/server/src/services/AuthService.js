const jwt = require('jsonwebtoken');
const AuthRepository = require('../repositories/AuthRepository');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
    constructor() {
        this.authRepo = new AuthRepository();
    }

    async register(userData, accountData) {        
        try {
            const result = await this.authRepo.createAccount(userData, accountData);
            
            return {
                success: true,
                message: 'Đăng ký tài khoản thành công',
                data: { MaKH: result.MaKH }
            };
        } catch (error) {
            if (error.number === 2627) {
                if (error.message.includes('UQ_KH_SoDT')) {
                    throw new AppError('Số điện thoại đã được sử dụng');
                } else if (error.message.includes('UQ_KH_Email')) {
                    throw new AppError('Email đã được sử dụng');
                } else if (error.message.includes('UQ_KH_CCCD')) {
                    throw new AppError('CCCD đã được sử dụng');
                }
            }
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
        if (MatKhau !== account.MatKhau) {
            throw new AppError('Mật khẩu không đúng', 401);
        }

        // Get employee branch info if this is an employee/manager account
        let branchId = null;
        if (account.MaNV) {
            const employeeInfo = await this.authRepo.getEmployeeBranchInfo(account.MaNV);
            if (employeeInfo) {
                branchId = employeeInfo.MaCN;
            }
        }

        // Generate JWT tokens
        const accessToken = jwt.sign(
            { 
                userId: account.MaTK,
                username: account.TenDangNhap,
                role: account.VaiTro,
                customerId: account.MaKH,
                employeeId: account.MaNV,
                branchId: branchId
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Access token: 24 hours
        );

        const refreshToken = jwt.sign(
            { 
                userId: account.MaTK,
                username: account.TenDangNhap,
                tokenType: 'refresh'
            },
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            { expiresIn: '30d' } // Refresh token: 30 ngày
        );

        return {
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                token: accessToken,
                refreshToken,
                user: {
                    MaTK: account.MaTK,
                    TenDangNhap: account.TenDangNhap,
                    VaiTro: account.VaiTro,
                    MaKH: account.MaKH,
                    MaNV: account.MaNV,
                    MaCN: branchId
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
        if (oldPassword !== account.MatKhau) {
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
                MaKH: account.MaKH,
                MaNV: account.MaNV
            }
        };
    }

    async refreshToken(refreshToken) {
        try {
            // Verify refresh token
            const decoded = jwt.verify(
                refreshToken, 
                process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
            );

            // Check if it's a refresh token
            if (decoded.tokenType !== 'refresh') {
                throw new AppError('Invalid refresh token', 401);
            }

            // Get user info
            const account = await this.authRepo.findAccountByUsername(decoded.username);
            if (!account) {
                throw new AppError('Tài khoản không tồn tại', 404);
            }

            // Generate new access token
            const newAccessToken = jwt.sign(
                { 
                    userId: account.MaTK,
                    username: account.TenDangNhap,
                    role: account.VaiTro,
                    customerId: account.MaKH,
                    employeeId: account.MaNV
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    token: newAccessToken
                }
            };
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                throw new AppError('Invalid or expired refresh token', 401);
            }
            throw error;
        }
    }
}

module.exports = AuthService;