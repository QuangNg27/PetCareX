const BaseRepository = require('./BaseRepository');

class ReviewRepository extends BaseRepository {
    // Tạo đánh giá mới
    async createReview(customerId, branchId, chatLuong, thaiDo, mucDoHaiLong, binhLuan) {
        try {
            const query = `
                INSERT INTO Danh_gia (MaKH, MaCN, DiemChatLuong, ThaiDoNV, MucDoHaiLong, BinhLuan, NgayDG)
                OUTPUT INSERTED.MaDG
                VALUES (@MaKH, @MaCN, @DiemChatLuong, @ThaiDoNV, @MucDoHaiLong, @BinhLuan, @NgayDG)
            `;
            
            const params = {
                MaKH: customerId,
                MaCN: branchId,
                DiemChatLuong: chatLuong,
                ThaiDoNV: thaiDo,
                MucDoHaiLong: mucDoHaiLong,
                BinhLuan: binhLuan,
                NgayDG: new Date()
            };

            const result = await this.execute(query, params);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Lấy đánh giá theo khách hàng
    async getReviewsByCustomer(customerId, limit = 10, offset = 0) {
        try {
            const query = `
                SELECT 
                    dg.MaDG,
                    dg.MaCN,
                    dg.DiemChatLuong,
                    dg.ThaiDoNV,
                    dg.MucDoHaiLong,
                    dg.BinhLuan,
                    dg.NgayDG
                FROM Danh_gia dg
                WHERE dg.MaKH = @MaKH
                ORDER BY dg.NgayDG DESC
                OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY
            `;

            const params = { MaKH: customerId, Limit: limit, Offset: offset };
            const result = await this.execute(query, params);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Lấy đánh giá theo chi nhánh
    async getReviewsByBranch(branchId, limit = 10, offset = 0) {
        try {
            const query = `
                SELECT 
                    dg.MaDG,
                    dg.MaKH,
                    kh.HoTen as TenKhachHang,
                    dg.DiemChatLuong,
                    dg.ThaiDoNV,
                    dg.MucDoHaiLong,
                    dg.BinhLuan,
                    dg.NgayDG
                FROM Danh_gia dg
                INNER JOIN Khach_hang kh ON dg.MaKH = kh.MaKH
                WHERE dg.MaCN = @MaCN
                ORDER BY dg.NgayDG DESC
                OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY
            `;

            const params = { MaCN: branchId, Limit: limit, Offset: offset };
            const result = await this.execute(query, params);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Lấy điểm đánh giá trung bình cho chi nhánh
    async getAverageRating(branchId) {
        try {
            const query = `
                SELECT 
                    AVG(CAST(DiemChatLuong AS DECIMAL(3,2))) as DiemChatLuongTB,
                    AVG(CAST(ThaiDoNV AS DECIMAL(3,2))) as ThaiDoNVTB,
                    AVG(CAST(MucDoHaiLong AS DECIMAL(3,2))) as MucDoHaiLongTB,
                    COUNT(*) as TongSoDanhGia,
                    -- Phân bố điểm chất lượng
                    COUNT(CASE WHEN DiemChatLuong = 5 THEN 1 END) as ChatLuong5Sao,
                    COUNT(CASE WHEN DiemChatLuong = 4 THEN 1 END) as ChatLuong4Sao,
                    COUNT(CASE WHEN DiemChatLuong = 3 THEN 1 END) as ChatLuong3Sao,
                    COUNT(CASE WHEN DiemChatLuong = 2 THEN 1 END) as ChatLuong2Sao,
                    COUNT(CASE WHEN DiemChatLuong = 1 THEN 1 END) as ChatLuong1Sao,
                    -- Phân bố thái độ nhân viên
                    COUNT(CASE WHEN ThaiDoNV = 5 THEN 1 END) as ThaiDo5Sao,
                    COUNT(CASE WHEN ThaiDoNV = 4 THEN 1 END) as ThaiDo4Sao,
                    COUNT(CASE WHEN ThaiDoNV = 3 THEN 1 END) as ThaiDo3Sao,
                    COUNT(CASE WHEN ThaiDoNV = 2 THEN 1 END) as ThaiDo2Sao,
                    COUNT(CASE WHEN ThaiDoNV = 1 THEN 1 END) as ThaiDo1Sao,
                    -- Phân bố mức độ hài lòng
                    COUNT(CASE WHEN MucDoHaiLong = 5 THEN 1 END) as HaiLong5Sao,
                    COUNT(CASE WHEN MucDoHaiLong = 4 THEN 1 END) as HaiLong4Sao,
                    COUNT(CASE WHEN MucDoHaiLong = 3 THEN 1 END) as HaiLong3Sao,
                    COUNT(CASE WHEN MucDoHaiLong = 2 THEN 1 END) as HaiLong2Sao,
                    COUNT(CASE WHEN MucDoHaiLong = 1 THEN 1 END) as HaiLong1Sao
                FROM Danh_gia
                WHERE MaCN = @MaCN
            `;

            const params = { MaCN: branchId };
            const result = await this.execute(query, params);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Lấy đánh giá mới nhất
    async getRecentReviews(limit = 5) {
        try {
            const query = `
                SELECT
                    dg.MaDG,
                    dg.MaKH,
                    kh.HoTen as TenKhachHang,
                    dg.MaCN,
                    cn.TenCN as TenChiNhanh,
                    dg.DiemChatLuong,
                    dg.ThaiDoNV,
                    dg.MucDoHaiLong,
                    dg.BinhLuan,
                    dg.NgayDG
                FROM Danh_gia dg
                INNER JOIN Khach_hang kh ON dg.MaKH = kh.MaKH
                INNER JOIN Chi_nhanh cn ON dg.MaCN = cn.MaCN
                ORDER BY dg.NgayDG DESC
            `;

            const result = await this.execute(query);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Lấy tất cả đánh giá
    async getAllReviews(limit = 0, offset = 0) {
        try {
            let query = `
                SELECT 
                    dg.MaDG,
                    dg.MaKH,
                    kh.HoTen as TenKhachHang,
                    dg.MaCN,
                    cn.TenCN as TenChiNhanh,
                    dg.DiemChatLuong,
                    dg.ThaiDoNV,
                    dg.MucDoHaiLong,
                    dg.BinhLuan,
                    dg.NgayDG
                FROM Danh_gia dg
                INNER JOIN Khach_hang kh ON dg.MaKH = kh.MaKH
                INNER JOIN Chi_nhanh cn ON dg.MaCN = cn.MaCN
                ORDER BY dg.NgayDG DESC
            `;

            let params = {};
            
            // Only add pagination if limit > 0
            if (limit > 0) {
                query += ' OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY';
                params = { Limit: limit, Offset: offset };
            }

            const result = await this.execute(query, params);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ReviewRepository;