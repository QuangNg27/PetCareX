const BaseRepository = require('./BaseRepository');
const bcrypt = require('bcryptjs');

class AuthRepository extends BaseRepository {
    async createAccount(userData, accountData) {
        const { HoTen, SoDT, Email, CCCD, GioiTinh, NgaySinh } = userData;
        const { TenDangNhap, MatKhau } = accountData;

        // Hash password
        const hashedPassword = await bcrypt.hash(MatKhau, 12);

        const result = await this.execute(`
            BEGIN TRY
                BEGIN TRANSACTION;
                
                -- Insert customer
                INSERT INTO Khach_hang (HoTen, SoDT, Email, CCCD, GioiTinh, NgaySinh)
                VALUES (@HoTen, @SoDT, @Email, @CCCD, @GioiTinh, @NgaySinh);
                
                DECLARE @MaKH INT = SCOPE_IDENTITY();
                
                -- Create account using stored procedure
                EXEC Create_TaiKhoan 
                    @TenDangNhap = @TenDangNhap,
                    @MatKhau = @MatKhau,
                    @MaKH = @MaKH,
                    @MaNV = NULL,
                    @VaiTro = N'Khách hàng';
                
                SELECT @MaKH AS MaKH;
                
                COMMIT TRANSACTION;
            END TRY
            BEGIN CATCH
                IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
                THROW;
            END CATCH
        `, {
            HoTen,
            SoDT,
            Email,
            CCCD,
            GioiTinh,
            NgaySinh,
            TenDangNhap,
            MatKhau: hashedPassword
        });

        return result.recordset[0];
    }

    async findAccountByUsername(username) {
        const result = await this.execute(`
            SELECT 
                tk.MaTK,
                tk.TenDangNhap,
                tk.MatKhau,
                tk.VaiTro,
                tk.MaKH,
                tk.MaNV
            FROM Tai_khoan tk
            WHERE tk.TenDangNhap = @TenDangNhap
        `, { TenDangNhap: username });

        return result.recordset[0];
    }

    async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async changePassword(username, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        const result = await this.execute(`
            UPDATE Tai_khoan 
            SET MatKhau = @MatKhau 
            WHERE TenDangNhap = @TenDangNhap
        `, {
            MatKhau: hashedPassword,
            TenDangNhap: username
        });

        return result.rowsAffected[0] > 0;
    }
}

module.exports = AuthRepository;