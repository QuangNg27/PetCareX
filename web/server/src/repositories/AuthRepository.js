const BaseRepository = require('./BaseRepository');

class AuthRepository extends BaseRepository {
    async createAccount(userData, accountData) {
        const { HoTen, SoDT, Email, CCCD, GioiTinh, NgaySinh } = userData;
        const { TenDangNhap, MatKhau } = accountData;

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
            MatKhau
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

    async changePassword(username, newPassword) {
        const result = await this.execute(`
            UPDATE Tai_khoan 
            SET MatKhau = @MatKhau 
            WHERE TenDangNhap = @TenDangNhap
        `, {
            MatKhau: newPassword,
            TenDangNhap: username
        });

        return result.rowsAffected[0] > 0;
    }
}

module.exports = AuthRepository;