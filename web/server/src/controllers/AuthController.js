const AuthService = require('../services/AuthService');
const { AppError } = require('../middleware/errorHandler');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    register = async (req, res, next) => {
        try {
            const { TenDangNhap, MatKhau, ...userData } = req.body;
            
            const result = await this.authService.register(
                userData, 
                { TenDangNhap, MatKhau }
            );

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const { TenDangNhap, MatKhau } = req.body;
            
            const result = await this.authService.login({ TenDangNhap, MatKhau });

            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    changePassword = async (req, res, next) => {
        try {
            const { MatKhauCu, MatKhauMoi } = req.body;
            const username = req.user.TenDangNhap;
            
            const result = await this.authService.changePassword(username, MatKhauCu, MatKhauMoi);

            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    getProfile = async (req, res, next) => {
        try {
            const username = req.user.TenDangNhap;
            
            const result = await this.authService.getProfile(username);

            res.json(result);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = AuthController;