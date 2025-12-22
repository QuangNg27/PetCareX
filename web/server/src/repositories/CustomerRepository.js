const BaseRepository = require('./BaseRepository');

class CustomerRepository extends BaseRepository {
    async getCustomerProfile(customerId) {
        const result = await this.execute(`
            SELECT 
                kh.MaKH,
                kh.HoTen,
                kh.SoDT,
                kh.Email,
                kh.CCCD,
                kh.GioiTinh,
                kh.NgaySinh,
                kh.DiemLoyalty,
                ctv.TenCapDo
            FROM Khach_hang kh
            LEFT JOIN Cap_thanh_vien ctv ON kh.CapDo = ctv.MaCap
            WHERE kh.MaKH = @MaKH
        `, { MaKH: customerId });

        return result.recordset[0];
    }

    async updateCustomerProfile(customerId, profileData) {
        const { HoTen, SoDT, Email, CCCD, GioiTinh, NgaySinh } = profileData;
        
        const result = await this.execute(`
            UPDATE Khach_hang 
            SET HoTen = COALESCE(@HoTen, HoTen),
                SoDT = COALESCE(@SoDT, SoDT),
                Email = COALESCE(@Email, Email),
                CCCD = COALESCE(@CCCD, CCCD),
                GioiTinh = COALESCE(@GioiTinh, GioiTinh),
                NgaySinh = COALESCE(@NgaySinh, NgaySinh)
            WHERE MaKH = @MaKH
        `, {
            HoTen,
            SoDT,
            Email,
            CCCD,
            GioiTinh,
            NgaySinh,
            MaKH: customerId
        });

        return result.rowsAffected[0] > 0;
    }

    async getCustomerSpending(customerId) {
        const result = await this.execute(`
            SELECT 
                ct.SoTien as ChiTieuNam,
                ct.Nam
            FROM Chi_tieu ct
            WHERE ct.MaKH = @MaKH
                AND ct.Nam = YEAR(GETDATE())
        `, { 
            MaKH: customerId
        });

        return result.recordset[0];
    }

    async getMembershipDiscount(customerId) {
        const result = await this.execute(`
            SELECT 
                TiLeKM
            FROM Cap_thanh_vien
            JOIN Khach_hang kh ON kh.CapDo = Cap_thanh_vien.MaCap
            WHERE kh.MaKH = @MaKH
        `, { 
            MaKH: customerId
        });

        return result.recordset;
    }

    async getLoyaltyHistory(customerId) {
        const result = await this.execute(`
            SELECT
                hd.MaHD,
                hd.NgayLap,
                hd.TongTien,
                FLOOR(hd.TongTien / 50000.0) as DiemTichLuy,
                cn.TenCN
            FROM Hoa_don hd
            JOIN Chi_nhanh cn ON hd.MaCN = cn.MaCN
            WHERE hd.MaKH = @MaKH
            ORDER BY hd.NgayLap DESC
        `, { 
            MaKH: customerId
        });

        return result.recordset;
    }

    async createCustomer(customerData) {
        const { HoTen, SoDT, Email, CCCD, GioiTinh, NgaySinh } = customerData;

        const result = await this.execute(`
            INSERT INTO Khach_hang (HoTen, SoDT, Email, CCCD, GioiTinh, NgaySinh)
            OUTPUT INSERTED.MaKH
            VALUES (@HoTen, @SoDT, @Email, @CCCD, @GioiTinh, @NgaySinh)
        `, {
            HoTen,
            SoDT,
            Email,
            CCCD,
            GioiTinh,
            NgaySinh
        });

        return result.recordset[0];
    }

    async searchCustomers(searchTerm) {
        const result = await this.execute(`
            SELECT
                kh.MaKH,
                kh.HoTen,
                kh.SoDT,
                kh.Email,
                kh.CCCD,
                kh.GioiTinh,
                kh.NgaySinh,
                ctv.TenCapDo,
                kh.DiemLoyalty
            FROM Khach_hang kh
            LEFT JOIN Cap_thanh_vien ctv ON kh.CapDo = ctv.MaCap
            WHERE kh.HoTen LIKE @SearchTerm
                OR kh.SoDT LIKE @SearchTerm
                OR kh.Email LIKE @SearchTerm
                OR kh.CCCD LIKE @SearchTerm
        `, { 
            SearchTerm: `%${searchTerm}%`
        });

        return result.recordset;
    }

    async UpdatePassword(customerId, oldPassword, newPassword) {
        const isMatch = await this.execute(`
            SELECT 1
            FROM Tai_khoan
            WHERE MaKH = @MaKH AND MatKhau = @OldMatKhau
        `, {
            MaKH: customerId,
            OldMatKhau: oldPassword
        });

        if (isMatch.recordset.length === 0) {
            return false;
        }

        const result = await this.execute(`
            UPDATE Tai_khoan
            SET MatKhau = @MatKhau
            WHERE MaKH = @MaKH
        `, {
            MatKhau: newPassword,
            MaKH: customerId
        });
        return result.rowsAffected[0] > 0;
    }
}

module.exports = CustomerRepository;