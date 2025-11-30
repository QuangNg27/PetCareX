const { poolRequest } = require('../config/db');

class BranchRepository {
    // Lấy tất cả chi nhánh
    async findAll() {
        try {
            const request = await poolRequest();
            const result = await request.query(`
                SELECT 
                    MaCN as MaChiNhanh,
                    TenCN as TenChiNhanh,
                    DiaChi,
                    SoDT as SoDienThoai,
                    ThoiGianMo as GioMoCua,
                    ThoiGianDong as GioDongCua,
                    QuanLy
                FROM Chi_nhanh
            `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi nhánh theo ID
    async findById(branchId) {
        try {
            const request = await poolRequest();
            request.input('MaChiNhanh', branchId);
            
            const result = await request.query(`
                SELECT 
                    MaCN as MaChiNhanh,
                    TenCN as TenChiNhanh,
                    DiaChi,
                    SoDT as SoDienThoai,
                    ThoiGianMo as GioMoCua,
                    ThoiGianDong as GioDongCua,
                    QuanLy
                FROM Chi_nhanh 
                WHERE MaCN = @MaChiNhanh
            `);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Lấy nhân viên theo chi nhánh
    async findEmployeesByBranch(branchId) {
        try {
            const request = await poolRequest();
            request.input('MaChiNhanh', branchId);
            
            const result = await request.query(`
                SELECT 
                    nv.MaNV as MaNhanVien,
                    nv.HoTen,
                    nv.ChucVu,
                    nv.Luong,
                    nv.NgayVaoLam,
                    ls.NgayBD as NgayBatDau,
                    ls.NgayKT as NgayKetThuc
                FROM Nhan_vien nv
                INNER JOIN Lich_su_nhan_vien ls ON nv.MaNV = ls.MaNV
                WHERE ls.MaCN = @MaChiNhanh
                    AND (ls.NgayKT IS NULL OR ls.NgayKT >= CAST(GETDATE() AS DATE))
            `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Lấy dịch vụ theo chi nhánh
    async findServicesByBranch(branchId) {
        try {
            const request = await poolRequest();
            request.input('MaChiNhanh', branchId);
            
            const result = await request.query(`
                SELECT 
                    dv.MaDV as MaDichVu,
                    dv.TenDV as TenDichVu,
                    (
                        SELECT TOP 1 gdv.SoTien 
                        FROM Gia_dich_vu gdv 
                        WHERE gdv.MaDV = dv.MaDV 
                            AND gdv.NgayApDung <= CAST(GETDATE() AS DATE)
                        ORDER BY gdv.NgayApDung DESC
                    ) as Gia
                FROM Dich_vu dv
                INNER JOIN Dich_vu_chi_nhanh dvcn ON dv.MaDV = dvcn.MaDV
                WHERE dvcn.MaCN = @MaChiNhanh
            `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Tạo chi nhánh mới
    async create(branchData) {
        try {
            const request = await poolRequest();
            const { TenChiNhanh, DiaChi, SoDienThoai, ThoiGianMo, ThoiGianDong } = branchData;
            
            request.input('TenCN', TenChiNhanh);
            request.input('DiaChi', DiaChi);
            request.input('SoDT', SoDienThoai);
            request.input('ThoiGianMo', ThoiGianMo);
            request.input('ThoiGianDong', ThoiGianDong);
            
            const result = await request.query(`
                INSERT INTO Chi_nhanh (TenCN, DiaChi, SoDT, ThoiGianMo, ThoiGianDong)
                OUTPUT inserted.MaCN
                VALUES (@TenCN, @DiaChi, @SoDT, @ThoiGianMo, @ThoiGianDong)
            `);
            
            const newBranchId = result.recordset[0].MaCN;
            return await this.findById(newBranchId);
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật chi nhánh
    async update(branchId, updateData) {
        try {
            const request = await poolRequest();
            const { TenChiNhanh, DiaChi, SoDienThoai, ThoiGianMo, ThoiGianDong } = updateData;
            
            request.input('MaChiNhanh', branchId);
            request.input('TenCN', TenChiNhanh);
            request.input('DiaChi', DiaChi);
            request.input('SoDT', SoDienThoai);
            request.input('ThoiGianMo', ThoiGianMo);
            request.input('ThoiGianDong', ThoiGianDong);
            
            const result = await request.query(`
                UPDATE Chi_nhanh 
                SET TenCN = COALESCE(@TenCN, TenCN),
                    DiaChi = COALESCE(@DiaChi, DiaChi),
                    SoDT = COALESCE(@SoDT, SoDT),
                    ThoiGianMo = COALESCE(@ThoiGianMo, ThoiGianMo),
                    ThoiGianDong = COALESCE(@ThoiGianDong, ThoiGianDong)
                WHERE MaCN = @MaChiNhanh
            `);
            
            // Return updated record
            if (result.rowsAffected[0] > 0) {
                return await this.findById(branchId);
            }
            return null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BranchRepository;