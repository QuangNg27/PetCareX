const BaseRepository = require('./BaseRepository');

class EmployeeRepository extends BaseRepository {
    async getAllEmployees(branchId = null, role = null) {
        let whereClause = 'WHERE 1=1';
        const params = {};

        if (branchId) {
            whereClause += ' AND ls.MaCN = @MaCN AND ls.NgayBD <= CAST(GETDATE() AS DATE) AND (ls.NgayKT IS NULL OR ls.NgayKT >= CAST(GETDATE() AS DATE))';
            params.MaCN = branchId;
        }

        if (role) {
            whereClause += ' AND nv.ChucVu = @ChucVu';
            params.ChucVu = role;
        }

        const result = await this.execute(`
            SELECT DISTINCT
                nv.MaNV as MaNhanVien,
                nv.HoTen,
                nv.NgaySinh,
                nv.GioiTinh,
                nv.ChucVu,
                nv.Luong,
                nv.NgayVaoLam,
                ls.MaCN as MaChiNhanh,
                cn.TenCN as TenChiNhanh,
                ls.NgayBD as NgayBatDau,
                ls.NgayKT as NgayKetThuc
            FROM Nhan_vien nv
            LEFT JOIN Lich_su_nhan_vien ls ON nv.MaNV = ls.MaNV
            LEFT JOIN Chi_nhanh cn ON ls.MaCN = cn.MaCN
            ${whereClause}
        `, params);

        return result.recordset;
    }

    async getEmployee(employeeId) {
        const result = await this.execute(`
            SELECT 
                nv.MaNV as MaNhanVien,
                nv.HoTen,
                nv.NgaySinh,
                nv.GioiTinh,
                nv.ChucVu,
                nv.Luong,
                nv.NgayVaoLam,
                -- Current branch assignment
                ls.MaCN as MaChiNhanh,
                cn.TenCN as TenChiNhanh
            FROM Nhan_vien nv
            LEFT JOIN Lich_su_nhan_vien ls ON nv.MaNV = ls.MaNV AND ls.NgayKT IS NULL
            LEFT JOIN Chi_nhanh cn ON ls.MaCN = cn.MaCN
            WHERE nv.MaNV = @MaNV
        `, { MaNV: employeeId });

        return result.recordset[0];
    }

    async getEmployeeWorkHistory(employeeId) {
        const result = await this.execute(`
            SELECT 
                ls.MaCN,
                cn.TenCN,
                cn.DiaChi,
                ls.NgayBD,
                ls.NgayKT,
                DATEDIFF(DAY, ls.NgayBD, COALESCE(ls.NgayKT, CAST(GETDATE() AS DATE))) as SoNgayLam
            FROM Lich_su_nhan_vien ls
            JOIN Chi_nhanh cn ON ls.MaCN = cn.MaCN
            WHERE ls.MaNV = @MaNV
            ORDER BY ls.NgayBD DESC
        `, { MaNV: employeeId });

        return result.recordset;
    }

    async createEmployee(employeeData) {
        const { HoTen, GioiTinh, NgaySinh, ChucVu, Luong, NgayVaoLam } = employeeData;
        
        const result = await this.execute(`
            @OutputTable TABLE (MaNV INT);

            INSERT INTO Nhan_vien (HoTen, GioiTinh, NgaySinh, NgayVaoLam, ChucVu, Luong)
            OUTPUT INSERTED.MaNV INTO @OutputTable
            VALUES (@HoTen, @GioiTinh, @NgaySinh, @NgayVaoLam, @ChucVu, @Luong)
        `, {
            HoTen,
            GioiTinh,
            NgaySinh,
            NgayVaoLam,
            ChucVu,
            Luong
        });

        return result.recordset[0];
    }

    async updateEmployee(employeeId, updateData) {
        const { HoTen, NgaySinh, GioiTinh, ChucVu, Luong } = updateData;
        
        const result = await this.execute(`
            UPDATE Nhan_vien 
            SET HoTen = COALESCE(@HoTen, HoTen),
                NgaySinh = COALESCE(@NgaySinh, NgaySinh),
                GioiTinh = COALESCE(@GioiTinh, GioiTinh),
                ChucVu = COALESCE(@ChucVu, ChucVu),
                Luong = COALESCE(@Luong, Luong)
            WHERE MaNV = @MaNV
        `, {
            MaNV: employeeId,
            HoTen,
            NgaySinh,
            GioiTinh,
            ChucVu,
            Luong
        });

        return result.rowsAffected[0] > 0;
    }

    async assignEmployeeToBranch(assignmentData) {
        const { MaNV, MaCN } = assignmentData;
        
        try {
            // Sử dụng stored procedure PhanCong_NhanVienChiNhanh
            await this.execute(`
                EXEC PhanCong_NhanVienChiNhanh 
                    @MaNV = @MaNhanVien,
                    @MaCN = @MaChiNhanh
            `, {
                MaNhanVien: MaNV,
                MaChiNhanh: MaCN
            });
            
            return true;
        } catch (error) {
            throw error;
        }
    }

    async terminateEmployeeAssignment(employeeId, branchId, endDate) {
        const result = await this.execute(`
            UPDATE Lich_su_nhan_vien 
            SET NgayKT = @NgayKT
            WHERE MaNV = @MaNV AND MaCN = @MaCN AND NgayKT IS NULL
        `, {
            MaNV: employeeId,
            MaCN: branchId,
            NgayKT: endDate
        });

        return result.rowsAffected[0] > 0;
    }

    async updateSalary(employeeId, newSalary) {
        // Update salary directly in Nhan_vien table
        const result = await this.execute(`
            UPDATE Nhan_vien 
            SET Luong = @Luong
            WHERE MaNV = @MaNV
        `, {
            MaNV: employeeId,
            Luong: newSalary
        });

        return result.rowsAffected[0] > 0;
    }

    async getEmployeeRoles() {
        const result = await this.execute(`
            SELECT DISTINCT ChucVu
            FROM Nhan_vien
            WHERE ChucVu IS NOT NULL
        `);

        return result.recordset.map(row => row.ChucVu);
    }

    async getEmployeeSchedule(employeeId, date) {
        const result = await this.execute(`
            SELECT 
                kb.NgayKham as ThoiGian,
                tc.Ten as TenThuCung,
                kh.HoTen as TenKhachHang,
                kh.SoDT as SDTKhachHang,
                dv.TenDV
            FROM Kham_benh kb
            JOIN Thu_cung tc ON kb.MaTC = tc.MaTC
            JOIN Khach_hang kh ON tc.MaKH = kh.MaKH
            JOIN Dich_vu dv ON kb.MaDV = dv.MaDV
            WHERE kb.MaNV = @MaNV 
            AND kb.NgayKham = @NgayKham
            
            UNION ALL
            
            SELECT
                tp.NgayTiem as ThoiGian,
                tc.Ten as TenThuCung,
                kh.HoTen as TenKhachHang,
                kh.SoDT as SDTKhachHang,
                dv.TenDV
            FROM Tiem_phong tp
            JOIN Thu_cung tc ON tp.MaTC = tc.MaTC
            JOIN Khach_hang kh ON tc.MaKH = kh.MaKH
            JOIN Dich_vu dv ON tp.MaDV = dv.MaDV
            WHERE tp.MaNV = @MaNV
            AND tp.NgayTiem = @NgayKham
            
        `, { MaNV: employeeId, NgayKham: date });

        return result.recordset;
    }

    // Phân công nhân viên vào chi nhánh (sử dụng stored procedure)
    async assignToBranch(employeeId, branchId) {
        try {
            // Sử dụng stored procedure PhanCong_NhanVienChiNhanh
            await this.execute(`
                EXEC PhanCong_NhanVienChiNhanh 
                    @MaNV = @MaNhanVien,
                    @MaCN = @MaChiNhanh
            `, {
                MaNhanVien: employeeId,
                MaChiNhanh: branchId
            });
            
            // Lấy thông tin phân công mới nhất
            const result = await this.execute(`
                SELECT TOP 1 
                    ls.MaNV,
                    ls.MaCN,
                    cn.TenCN,
                    ls.NgayBD,
                    ls.NgayKT
                FROM Lich_su_nhan_vien ls
                INNER JOIN Chi_nhanh cn ON ls.MaCN = cn.MaCN
                WHERE ls.MaNV = @MaNhanVien
                ORDER BY ls.NgayBD DESC
            `, { MaNhanVien: employeeId });
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Lấy lịch sử phân công của nhân viên
    async getAssignmentHistory(employeeId) {
        try {
            const result = await this.execute(`
                SELECT 
                    ls.MaNV as MaNhanVien,
                    ls.MaCN as MaChiNhanh,
                    cn.TenCN as TenChiNhanh,
                    ls.NgayBD as NgayBatDau,
                    ls.NgayKT as NgayKetThuc,
                    CASE 
                        WHEN ls.NgayKT IS NULL THEN N'Đang hoạt động'
                        ELSE N'Đã kết thúc'
                    END as TrangThai
                FROM Lich_su_nhan_vien ls
                INNER JOIN Chi_nhanh cn ON ls.MaCN = cn.MaCN
                WHERE ls.MaNV = @MaNhanVien
                ORDER BY ls.NgayBD DESC
            `, { MaNhanVien: employeeId });
            
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi nhánh hiện tại của nhân viên
    async getCurrentBranch(employeeId) {
        try {
            const result = await this.execute(`
                SELECT 
                    ls.MaCN as MaChiNhanh,
                    cn.TenCN as TenChiNhanh,
                    cn.DiaChi,
                    ls.NgayBD as NgayBatDau
                FROM Lich_su_nhan_vien ls
                INNER JOIN Chi_nhanh cn ON ls.MaCN = cn.MaCN
                WHERE ls.MaNV = @MaNhanVien 
                    AND ls.NgayKT IS NULL
            `, { MaNhanVien: employeeId });
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = EmployeeRepository;