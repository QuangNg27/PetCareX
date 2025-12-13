const BaseRepository = require('./BaseRepository');

class ReportRepository extends BaseRepository {
    // Thống kê số lượng khách hàng theo cấp độ
    async getCustomerCountByLevel() {
        const result = await this.execute(`
            SELECT 
                ctv.TenCapDo,
                COUNT(kh.MaKH) as SoLuongKhachHang
            FROM Khach_hang kh
            JOIN Cap_thanh_vien ctv ON kh.CapDo = ctv.MaCap
            GROUP BY ctv.CapDo, ctv.TenCapDo
        `);
        return result.recordset;
    }

    // Thống kê số lượng khách hàng
    async getCustomerCount(branchId = null) {
        const params = {};
        
        if (branchId) {
            params.BranchId = branchId;
            const result = await this.execute(`
                SELECT 
                    COUNT(DISTINCT kh.MaKH) as TongSoKhachHang
                FROM Khach_hang kh
                INNER JOIN Hoa_don hd ON kh.MaKH = hd.MaKH
                WHERE hd.MaCN = @BranchId
            `, params);
            return result.recordset[0];
        } else {
            const result = await this.execute(`
                SELECT 
                    COUNT(*) as TongSoKhachHang
                FROM Khach_hang kh
            `);
            return result.recordset[0];
        }
    }

    // Thống kê số khách hàng đã lâu chưa quay lại
    async getInactiveCustomerCount(monthsInactive = 6, branchId = null) {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - monthsInactive);
        
        const params = {
            MonthsInactive: monthsInactive,
            CutoffDate: cutoffDate.toISOString().split('T')[0]
        };
        
        if (branchId) {
            params.BranchId = branchId;
            const result = await this.execute(`
                SELECT 
                    COUNT(DISTINCT kh.MaKH) as SoKhachHangKhongHoatDong
                FROM Khach_hang kh
                WHERE EXISTS (
                    SELECT 1 FROM Hoa_don hd WHERE hd.MaKH = kh.MaKH AND hd.MaCN = @BranchId
                )
                AND NOT EXISTS (
                    SELECT 1
                    FROM Hoa_don hd
                    WHERE hd.MaKH = kh.MaKH
                    AND hd.MaCN = @BranchId
                    AND hd.NgayLap >= @CutoffDate
                )
            `, params);
            return result.recordset[0];
        } else {
            const result = await this.execute(`
                SELECT 
                    COUNT(*) as SoKhachHangKhongHoatDong
                FROM Khach_hang kh
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM Hoa_don hd
                    WHERE hd.MaKH = kh.MaKH
                    AND hd.NgayLap >= @CutoffDate
                )
            `);
            return result.recordset[0];
        }
    }

    // Thống kê vaccine phổ biến
    async getPopularVaccines(branchId = null, limit = 10) {
        let whereClause = 'WHERE sp.LoaiSP = \'Vaccine\'';
        const params = {};
        
        if (branchId) {
            whereClause = 'WHERE sp.LoaiSP = \'Vaccine\' AND tp.MaCN = @BranchId';
            params.BranchId = branchId;
        }
        
        const result = await this.execute(`
            SELECT TOP (@Limit)
                sp.MaSP as MaVacXin,
                sp.TenSP as TenVacXin,
                COUNT(cttp.MaSP) as SoLuongDat
            FROM San_pham sp
            INNER JOIN Chi_tiet_tiem_phong cttp ON sp.MaSP = cttp.MaSP
            INNER JOIN Tiem_phong tp ON cttp.MaTP = tp.MaTP
            ${whereClause}
            GROUP BY sp.MaSP, sp.TenSP
            ORDER BY SoLuongDat DESC
        `, { ...params, Limit: limit });
        
        return result.recordset;
    }
    
    // Báo cáo doanh thu khám bệnh
    async getExaminationRevenue(startDate, endDate, branchId = null) {
        const params = {
            StartDate: startDate,
            EndDate: endDate
        };
        
        let whereClause = '';
        if (branchId) {
            params.BranchId = branchId;
            whereClause = 'AND hd.MaCN = @BranchId';
        }
        
        const result = await this.execute(`
            SELECT
                YEAR(hd.NgayLap) as Nam,
                MONTH(hd.NgayLap) as Thang,
                ISNULL(SUM(ctdv.GiaApDung), 0) as TongDoanhThu,
            FROM Dich_vu dv
            INNER JOIN Chi_tiet_hoa_don_DV ctdv ON dv.MaDV = ctdv.MaDV
            INNER JOIN Hoa_don hd ON ctdv.MaHD = hd.MaHD
            WHERE hd.NgayLap BETWEEN @StartDate AND @EndDate
            AND dv.TenDV = N'Khám bệnh'
            ${whereClause}
            GROUP BY YEAR(hd.NgayLap), MONTH(hd.NgayLap)
            ORDER BY YEAR(hd.NgayLap), MONTH(hd.NgayLap)
        `, params);
        
        return result.recordset;
    }

    // Báo cáo doanh thu tiêm phòng
    async getVaccinationRevenue(startDate, endDate, branchId = null) {
        const params = {
            StartDate: startDate,
            EndDate: endDate
        };
        
        let whereClause = '';
        if (branchId) {
            params.BranchId = branchId;
            whereClause = 'AND hd.MaCN = @BranchId';
        }
        
        const result = await this.execute(`
            SELECT
                YEAR(hd.NgayLap) as Nam,
                MONTH(hd.NgayLap) as Thang,
                ISNULL(SUM(ctdv.GiaApDung), 0) as TongDoanhThu,
            FROM Dich_vu dv
            INNER JOIN Chi_tiet_hoa_don_DV ctdv ON dv.MaDV = ctdv.MaDV
            INNER JOIN Hoa_don hd ON ctdv.MaHD = hd.MaHD
            WHERE hd.NgayLap BETWEEN @StartDate AND @EndDate
            AND dv.TenDV = N'Tiêm phòng'
            ${whereClause}
            GROUP BY YEAR(hd.NgayLap), MONTH(hd.NgayLap)
            ORDER BY YEAR(hd.NgayLap), MONTH(hd.NgayLap)
        `, params);
        
        return result.recordset;
    }

    // Báo cáo doanh thu bán hàng
    async getProductSalesRevenue(startDate, endDate, branchId = null) {
        const params = {
            StartDate: startDate,
            EndDate: endDate
        };
        
        let whereClause = '';
        if (branchId) {
            params.BranchId = branchId;
            whereClause = 'AND hd.MaCN = @BranchId';
        }
        
        const result = await this.execute(`
            SELECT
                YEAR(hd.NgayLap) as Nam,
                MONTH(hd.NgayLap) as Thang,
                ISNULL(SUM(ctsp.SoLuong * ctsp.GiaApDung), 0) as TongDoanhThu,
            FROM Chi_tiet_hoa_don_SP ctsp
            INNER JOIN Hoa_don hd ON ctsp.MaHD = hd.MaHD
            WHERE hd.NgayLap BETWEEN @StartDate AND @EndDate
            ${whereClause}
            GROUP BY YEAR(hd.NgayLap), MONTH(hd.NgayLap)
            ORDER BY YEAR(hd.NgayLap), MONTH(hd.NgayLap)
        `, params);
        
        return result.recordset;
    }

    // Báo cáo hiệu suất nhân viên chi tiết
    async getEmployeePerformanceDetailed(employeeId, startDate = null, endDate = null) {
        const params = {
            MaNV: employeeId
        };
        
        let dateFilter = '';
        if (startDate) {
            dateFilter += ' AND hd.NgayLap >= @StartDate';
            params.StartDate = startDate;
        }
        if (endDate) {
            dateFilter += ' AND hd.NgayLap <= @EndDate';
            params.EndDate = endDate;
        }
        
        const result = await this.execute(`
            SELECT 
                nv.MaNV as MaNhanVien,
                nv.HoTen,
                nv.ChucVu,
                COUNT(DISTINCT hd.MaHD) as SoHoaDon,
                ISNULL(SUM(hd.TongTien), 0) as TongDoanhThu,
                ISNULL(AVG(hd.TongTien), 0) as TrungBinhHoaDon,
                COUNT(DISTINCT kb.MaKB) as SoLanKham,
                COUNT(DISTINCT tp.MaTP) as SoLanTiem
            FROM Nhan_vien nv
            LEFT JOIN Hoa_don hd ON nv.MaNV = hd.MaNV ${dateFilter}
            LEFT JOIN Kham_benh kb ON nv.MaNV = kb.MaNV
                ${dateFilter ? dateFilter.replace('hd.NgayLap', 'kb.NgayKham') : ''}
            LEFT JOIN Tiem_phong tp ON nv.MaNV = tp.MaNV
                ${dateFilter ? dateFilter.replace('hd.NgayLap', 'tp.NgayTiem') : ''}
            WHERE nv.MaNV = @MaNV
            GROUP BY nv.MaNV, nv.HoTen, nv.ChucVu
        `, params);
        
        return result.recordset[0] || {
            MaNhanVien: employeeId,
            HoTen: null,
            ChucVu: null,
            SoHoaDon: 0,
            TongDoanhThu: 0,
            TrungBinhHoaDon: 0,
            SoLanKham: 0,
            SoLanTiem: 0
        };
    }

    // Thống kê doanh thu theo ngày
    async getRevenueByDay(startDate, endDate, branchId = null) {
        const params = {
            StartDate: startDate,
            EndDate: endDate
        };
        
        let whereClause = '';
        if (branchId) {
            params.BranchId = branchId;
            whereClause = 'AND hd.MaCN = @BranchId';
        }
        
        const result = await this.execute(`
            SELECT 
                hd.NgayLap as Ngay,
                SUM(hd.TongTien) as DoanhThu,
                AVG(hd.TongTien) as DoanhThuTrungBinh
            FROM Hoa_don hd
            WHERE hd.NgayLap BETWEEN @StartDate AND @EndDate
            ${whereClause}
            GROUP BY hd.NgayLap
            ORDER BY hd.NgayLap
        `, params);
        
        return result.recordset;
    }

    // Thống kê doanh thu theo tháng
    async getRevenueByMonth(year, branchId = null) {
        const NgayBD = `${year}-01-01`;
        const NgayKT = `${year}-12-31`;
        const params = {
            NgayBD: NgayBD,
            NgayKT: NgayKT
        };
        
        let whereClause = '';
        if (branchId) {
            params.BranchId = branchId;
            whereClause = 'AND hd.MaCN = @BranchId';
        }
        
        const result = await this.execute(`
            SELECT 
                MONTH(hd.NgayLap) as Thang,
                YEAR(hd.NgayLap) as Nam,
                SUM(hd.TongTien) as DoanhThu,
                AVG(hd.TongTien) as DoanhThuTrungBinh
            FROM Hoa_don hd
            WHERE hd.NgayLap BETWEEN @NgayBD AND @NgayKT
            ${whereClause}
            GROUP BY MONTH(hd.NgayLap), YEAR(hd.NgayLap)
            ORDER BY YEAR(hd.NgayLap), MONTH(hd.NgayLap)
        `, params);
        
        return result.recordset;
    }

    // Thống kê doanh thu theo quý
    async getRevenueByQuarter(year, branchId = null) {
        const NgayBD = `${year}-01-01`;
        const NgayKT = `${year}-12-31`;
        const params = {
            NgayBD: NgayBD,
            NgayKT: NgayKT
        };
        
        let whereClause = '';
        if (branchId) {
            params.BranchId = branchId;
            whereClause = 'AND hd.MaCN = @BranchId';
        }
        
        const result = await this.execute(`
            SELECT 
                DATEPART(QUARTER, hd.NgayLap) as Quy,
                YEAR(hd.NgayLap) as Nam,
                CONCAT('Q', DATEPART(QUARTER, hd.NgayLap), '-', YEAR(hd.NgayLap)) as QuyFormat,
                CASE DATEPART(QUARTER, hd.NgayLap)
                    WHEN 1 THEN N'Quý I'
                    WHEN 2 THEN N'Quý II'
                    WHEN 3 THEN N'Quý III'
                    WHEN 4 THEN N'Quý IV'
                END as TenQuy,
                SUM(hd.TongTien) as DoanhThu,
                AVG(hd.TongTien) as DoanhThuTrungBinh
            FROM Hoa_don hd
            WHERE hd.NgayLap BETWEEN @NgayBD AND @NgayKT
            ${whereClause}
            GROUP BY DATEPART(QUARTER, hd.NgayLap), YEAR(hd.NgayLap)
            ORDER BY YEAR(hd.NgayLap), DATEPART(QUARTER, hd.NgayLap)
        `, params);
        
        return result.recordset;
    }

    // Thống kê doanh thu theo năm
    async getRevenueByYear(startYear, endYear, branchId = null) {
        const startDate = `${startYear}-01-01`;
        const endDate = `${endYear}-12-31`;
        const params = {
            StartYear: startDate,
            EndYear: endDate
        };
        
        let whereClause = '';
        if (branchId) {
            params.BranchId = branchId;
            whereClause = 'AND hd.MaCN = @BranchId';
        }
        
        const result = await this.execute(`
            SELECT 
                YEAR(hd.NgayLap) as Nam,
                SUM(hd.TongTien) as DoanhThu,
                AVG(hd.TongTien) as DoanhThuTrungBinh
            FROM Hoa_don hd
            WHERE hd.NgayLap BETWEEN @StartYear AND @EndYear
            ${whereClause}
            GROUP BY YEAR(hd.NgayLap)
            ORDER BY YEAR(hd.NgayLap)
        `, params);
        
        return result.recordset;
    }

    // Thống kê doanh thu
    async getRevenueSummary(branchId = null) {
        const params = {};
        let whereClause = '';
        
        if (branchId) {
            params.BranchId = branchId;
            whereClause = 'WHERE hd.MaCN = @BranchId';
        }
        
        const result = await this.execute(`
            SELECT 
                ISNULL(SUM(hd.TongTien), 0) as TongDoanhThu,
                ISNULL(AVG(hd.TongTien), 0) as DoanhThuTrungBinh,
            FROM Hoa_don hd
            ${whereClause}
        `, params);
        
        return result.recordset[0];
    }      

    // Thống kê số lượng thú cưng theo loài
    async getPetCountBySpecies(branchId = null) {
        const params = {};
        let whereClause = '';
        
        if (branchId) {
            params.BranchId = branchId;
            whereClause = 'WHERE tc.MaCN = @BranchId';
        }
        
        const result = await this.execute(`
            SELECT 
                tc.Loai as LoaiThuCung,
                COUNT(tc.MaTC) as SoLuongThuCung
            FROM Thu_cung tc
            ${whereClause}
            GROUP BY tc.Loai
            ORDER BY COUNT(tc.MaTC) DESC
        `, params);
        
        return result.recordset;
    }

    // Thống kê số lượng thú cưng theo giống
    async getPetCountByBreed(branchId = null) {
        const params = {};
        let whereClause = '';
        
        if (branchId) {
            params.BranchId = branchId;
            whereClause = 'WHERE tc.MaCN = @BranchId';
        }
        
        const result = await this.execute(`
            SELECT 
                tc.Giong as GiongThuCung,
                COUNT(tc.MaTC) as SoLuongThuCung
            FROM Thu_cung tc
            ${whereClause}
            GROUP BY tc.Giong
            ORDER BY COUNT(tc.MaTC) DESC
        `, params);
        
        return result.recordset;
    }

    // Danh sách thú cưng được tiêm phòng trong khoảng thời gian
    async getVaccinatedPets(branchId, startDate, endDate) {
        const params = {
            BranchId: branchId,
            StartDate: startDate,
            EndDate: endDate
        };
        
        const result = await this.execute(`
            SELECT 
                tc.MaTC,
                tc.Ten as TenTC,
                tc.Loai,
                tc.Giong,
                tc.NgaySinh,
                kh.HoTen as TenChuSoHuu,
                tp.NgayTiem,
                tp.MaTP,
                sp.TenSP as TenVaccine,
                sp.MaSP,
                nv.HoTen as NhanVienThucHien
            FROM Thu_cung tc
            JOIN Khach_hang kh ON tc.MaKH = kh.MaKH
            JOIN Tiem_phong tp ON tc.MaTC = tp.MaTC
            JOIN Chi_tiet_tiem_phong cttp ON tp.MaTP = cttp.MaTP
            JOIN San_pham sp ON cttp.MaSP = sp.MaSP
            JOIN Nhan_vien nv ON tp.MaNV = nv.MaNV
            WHERE tp.MaCN = @BranchId
            AND tp.NgayTiem BETWEEN @StartDate AND @EndDate
            ORDER BY tp.NgayTiem DESC, tc.MaTC
        `, params);
        
        return result.recordset;
    }

    // Thống kê khách hàng theo chi nhánh
    async getCustomerStatsByBranch(branchId, inactiveDays = 90) {
        const params = {
            BranchId: branchId,
            InactiveDays: inactiveDays
        };
        
        // Tổng số khách hàng có giao dịch tại chi nhánh
        const totalResult = await this.execute(`
            SELECT COUNT(DISTINCT kh.MaKH) as Total
            FROM Khach_hang kh
            INNER JOIN Hoa_don hd ON kh.MaKH = hd.MaKH
            WHERE hd.MaCN = @BranchId
        `, params);
        
        // Khách hàng active (có giao dịch trong inactiveDays gần đây)
        const activeResult = await this.execute(`
            SELECT COUNT(DISTINCT kh.MaKH) as Active
            FROM Khach_hang kh
            INNER JOIN Hoa_don hd ON kh.MaKH = hd.MaKH
            WHERE hd.MaCN = @BranchId
            AND hd.NgayLap >= DATEADD(DAY, -@InactiveDays, GETDATE())
        `, params);
        
        // Khách hàng theo cấp độ (chỉ những khách đã có giao dịch tại chi nhánh)
        const levelResult = await this.execute(`
            SELECT 
                ctv.TenCapDo,
                COUNT(DISTINCT Khach_hang.MaKH) as SoLuong
            FROM Khach_hang
            INNER JOIN Hoa_don ON Khach_hang.MaKH = Hoa_don.MaKH
            INNER JOIN Cap_thanh_vien ctv ON Khach_hang.CapDo = ctv.MaCap
            WHERE Hoa_don.MaCN = @BranchId
            GROUP BY ctv.MaCap, ctv.TenCapDo
            ORDER BY ctv.MaCap
        `, params);
        
        // Danh sách khách hàng không hoạt động tại chi nhánh này
        const inactiveListResult = await this.execute(`
            SELECT 
                Khach_hang.MaKH,
                Khach_hang.HoTen,
                Khach_hang.SoDT,
                Khach_hang.Email,
                ctv.TenCapDo,
                MAX(Hoa_don.NgayLap) as LanCuoi,
                DATEDIFF(DAY, MAX(Hoa_don.NgayLap), GETDATE()) as SoNgay
            FROM Khach_hang
            INNER JOIN Hoa_don ON Khach_hang.MaKH = Hoa_don.MaKH
            LEFT JOIN Cap_thanh_vien ctv ON Khach_hang.CapDo = ctv.MaCap
            WHERE Hoa_don.MaCN = @BranchId
            GROUP BY Khach_hang.MaKH, Khach_hang.HoTen, Khach_hang.SoDT, Khach_hang.Email, ctv.TenCapDo
            HAVING MAX(Hoa_don.NgayLap) < DATEADD(DAY, -@InactiveDays, GETDATE())
            ORDER BY SoNgay DESC
        `, params);
        
        return {
            totalCustomers: totalResult.recordset[0].Total,
            activeCustomers: activeResult.recordset[0].Active,
            inactiveCustomers: totalResult.recordset[0].Total - activeResult.recordset[0].Active,
            customersByLevel: levelResult.recordset,
            inactiveCustomersList: inactiveListResult.recordset
        };
    }

    // Hiệu suất nhân viên theo chi nhánh
    async getEmployeePerformanceSummary(branchId, employeeId = null) {
        const params = {
            BranchId: branchId
        };
        
        let employeeFilter = '';
        if (employeeId) {
            params.EmployeeId = employeeId;
            employeeFilter = 'AND nv.MaNV = @EmployeeId';
        }
        
        const result = await this.execute(`
            SELECT 
                nv.MaNV,
                nv.HoTen,
                nv.ChucVu,
                COUNT(DISTINCT kb.MaKB) as SoLuotKhamBenh,
                COUNT(DISTINCT tp.MaTP) as SoLuotTiemPhong,
                COUNT(DISTINCT hd.MaHD) as SoDonHang
            FROM Nhan_vien nv
            JOIN Lich_su_nhan_vien ls ON nv.MaNV = ls.MaNV
            LEFT JOIN Kham_benh kb ON nv.MaNV = kb.MaNV
            LEFT JOIN Tiem_phong tp ON nv.MaNV = tp.MaNV
            LEFT JOIN Hoa_don hd ON nv.MaNV = hd.MaNV
            WHERE ls.MaCN = @BranchId
            AND (ls.NgayKT IS NULL OR ls.NgayKT >= GETDATE())
            ${employeeFilter}
            GROUP BY nv.MaNV, nv.HoTen, nv.ChucVu
            ORDER BY nv.HoTen
        `, params);
        
        return result.recordset;
    }
}

module.exports = ReportRepository;