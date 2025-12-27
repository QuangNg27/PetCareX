const { query } = require("../config/db");
const BaseRepository = require("./BaseRepository");

class CompanyRepository extends BaseRepository {

    // Lấy doanh thu theo chi nhánh trong năm
    async getRevenueByBranch(year) {
        try {
            const result_cur_year = await this.execute(`
                SELECT 
                    c.TenCN,
                    SUM(h.TongTien) AS TotalRevenue
                FROM Chi_nhanh c
                JOIN Hoa_don h ON h.MaCN = c.MaCN
                WHERE h.NgayLap >= DATEFROMPARTS(@year, 1, 1) AND h.NgayLap < DATEFROMPARTS(@year + 1, 1, 1)
                GROUP BY c.MaCN, c.TenCN
            `, {year});
            const result_prev_year = await this.execute(`
                SELECT 
                    c.TenCN,
                    SUM(h.TongTien) AS TotalRevenue
                FROM Chi_nhanh c
                JOIN Hoa_don h ON h.MaCN = c.MaCN
                WHERE h.NgayLap >= DATEFROMPARTS(@year - 1, 1, 1) AND h.NgayLap < DATEFROMPARTS(@year, 1, 1)
                GROUP BY c.MaCN, c.TenCN
                `, {year: year - 1});
            
            const data = result_cur_year.recordset.map(cur => {
                const prev = result_prev_year.recordset.find(p => p.TenCN === cur.TenCN);
                const prevRevenue = prev ? parseFloat(prev.TotalRevenue) : 0;
                const curRevenue = parseFloat(cur.TotalRevenue);
                const growthRate = prevRevenue === 0 ? 100 : ((curRevenue - prevRevenue) / prevRevenue) * 100;
                return {
                    branch: cur.TenCN,
                    revenue: curRevenue,
                    growthRate: growthRate.toFixed(2)
                };
            });

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Lấy tổng doanh thu theo tháng trong năm
    async getTotalRevenueByYear(year) {
        try {
            const result = await this.execute(`
                SELECT 
                    MONTH(h.NgayLap) AS month,
                    SUM(h.TongTien) AS revenue
                FROM Hoa_don h
                WHERE h.NgayLap >= DATEFROMPARTS(@year, 1, 1) AND h.NgayLap < DATEFROMPARTS(@year + 1, 1, 1)
                GROUP BY MONTH(h.NgayLap)
                ORDER BY Month
            `, {year});

            return result.recordset;    
        } catch (error) {
            throw error;
        }
    }

    // Lấy doanh thu theo dịch vụ trong 6 tháng gần nhất
    async getRevenueByServicesW6M() {
        try {
            const result_products = await this.execute(`
                SELECT 
                    N'Sản phẩm' AS LoaiHoaDon,
                    YEAR(hd.NgayLap) AS Nam,
                    MONTH(hd.NgayLap) AS Thang,
                    SUM(ct.GiaApDung * ct.SoLuong) AS DoanhThu
                FROM Chi_tiet_hoa_don_SP ct
                JOIN Hoa_don hd ON hd.MaHD = ct.MaHD
                WHERE hd.NgayLap >= DATEADD(MONTH, -6, CAST(GETDATE() AS DATE))
                GROUP BY YEAR(hd.NgayLap), MONTH(hd.NgayLap)
                `);
            
            const result_injections = await this.execute(`
                SELECT 
                    N'Tiêm phòng' AS LoaiHoaDon,
                    YEAR(hd.NgayLap) AS Nam,
                    MONTH(hd.NgayLap) AS Thang,
                    SUM(ct.GiaApDung) AS DoanhThu
                FROM Chi_tiet_hoa_don_DV ct
                JOIN Hoa_don hd ON hd.MaHD = ct.MaHD
                WHERE ct.MaTP IS NOT NULL
                AND hd.NgayLap >= DATEADD(MONTH, -6, CAST(GETDATE() AS DATE))
                GROUP BY YEAR(hd.NgayLap), MONTH(hd.NgayLap)
                `);

            const result_visits = await this.execute(`
                SELECT 
                    N'Khám bệnh' AS LoaiHoaDon,
                    YEAR(hd.NgayLap) AS Nam,
                    MONTH(hd.NgayLap) AS Thang,
                    SUM(ct.GiaApDung) AS DoanhThu
                FROM Chi_tiet_hoa_don_DV ct
                JOIN Hoa_don hd ON hd.MaHD = ct.MaHD
                WHERE ct.MaKB IS NOT NULL
                AND hd.NgayLap >= DATEADD(MONTH, -6, CAST(GETDATE() AS DATE))
                GROUP BY YEAR(hd.NgayLap), MONTH(hd.NgayLap)
                `);

            const now = new Date();
            const currentMonth = now.getMonth() + 1; 

            const months = Array.from({ length: 6 }, (_, i) => ((currentMonth - 5 + i + 11) % 12) + 1);

            const result = months.map(m => ({
                month: m,
                khamBenh: result_products.recordset.find(r => r.Thang === m)?.DoanhThu || 0,
                tiemPhong: result_injections.recordset.find(r => r.Thang === m)?.DoanhThu || 0,
                banHang: result_visits.recordset.find(r => r.Thang === m)?.DoanhThu || 0,
            }));

            return result;
        } catch (error) {
            throw error;
        }
    }

    // Lấy thống kê tất cả thú cưng
    async getAllPetsStats() {
        try {
            const result = await this.execute(`
                SELECT COUNT(loai) as count
                FROM Thu_cung
                WHERE Loai = N'Chó'

                UNION ALL

                SELECT COUNT(loai) as count
                FROM Thu_cung
                WHERE Loai = N'Mèo'

                UNION ALL

                SELECT COUNT(loai) as count
                FROM Thu_cung
                WHERE Loai <> N'Chó' AND Loai <> N'Mèo'
                `);

            const sum = result.recordset[0].count + result.recordset[1].count + result.recordset[2].count;

            return [
                { "name": "Chó", "value": result.recordset[0].count, "percentage" : ((result.recordset[0].count / sum * 100).toFixed(2)) },
                { "name": "Mèo", "value": result.recordset[1].count, "percentage" : ((result.recordset[1].count / sum * 100).toFixed(2)) },
                { "name": "Khác", "value": result.recordset[2].count, "percentage" : ((result.recordset[2].count / sum * 100).toFixed(2)) }
            ]
        } catch (error) {
            throw error;
        }
    }

    // Lấy thống kê giống chó
    async getDogBreedsStats() {
        try {
            const result = await this.execute(`
                SELECT COUNT(loai) as count, Giong AS breed
                FROM Thu_cung
                WHERE Loai = N'Chó'
                GROUP BY Giong
                `);

            const top5 = result.recordset.slice(0, 9);
            const othersCount = result.recordset.slice(9).reduce((sum, row) => sum + row.count, 0);
            const mappedTop5 = top5.map(row => ({
                breed: row.breed,
                count: row.count
            }));

            if (othersCount > 0) {
                mappedTop5.push({
                    breed: "Khác",
                    count: othersCount
                });
            }

            return mappedTop5;
        } catch (error) {
            throw error;
        }
    }

    // Lấy thống kê giống mèo
    async getCatBreedsStats() {
        try {
            const result = await this.execute(`
                SELECT COUNT(loai) as count, Giong AS breed
                FROM Thu_cung
                WHERE Loai = N'Mèo'
                GROUP BY Giong
                `);

            const top5 = result.recordset.slice(0, 9);
            const othersCount = result.recordset.slice(9).reduce((sum, row) => sum + row.count, 0);
            const mappedTop5 = top5.map(row => ({
                breed: row.breed,
                count: row.count
            }));

            if (othersCount > 0) {
                mappedTop5.push({
                    breed: "Khác",
                    count: othersCount
                });
            }

            return mappedTop5;
        } catch (error) {
            throw error;
        }
    }

    // Lấy thống kê hội viên
    async getMembershipStats() {
        try {
            const result = await this.execute(`
                SELECT ctv.TenCapDo, count(ctv.MaCap)
                FROM Khach_hang kh JOIN Cap_thanh_vien ctv ON ctv.MaCap = kh.CapDo
                GROUP BY ctv.MaCap, ctv.TenCapDo
                `);

            const sum = result.recordset[0][''] + result.recordset[1][''] + result.recordset[2][''];

            return [
                { "type": result.recordset[0]['TenCapDo'], "count": result.recordset[0][''], "percentage" : ((result.recordset[0][''] / sum * 100).toFixed(2)), "color": "#94a3b8" },
                { "type": result.recordset[1]['TenCapDo'], "count": result.recordset[1][''], "percentage" : ((result.recordset[1][''] / sum * 100).toFixed(2)), "color": "#3b82f6" },
                { "type": result.recordset[2]['TenCapDo'], "count": result.recordset[2][''], "percentage" : ((result.recordset[2][''] / sum * 100).toFixed(2)), "color": "#f59e0b" }
            ]
        } catch (error) {
            throw error;
        }
    }

    // Lấy thống kê nhân viên
    async getEmployeeStats() {
        try {
            const result = await this.execute(`
                SELECT
                    nv.MaNV AS id,
                    nv.HoTen AS name,
                    nv.GioiTinh AS gender,
                    nv.NgaySinh AS dob,
                    nv.NgayVaoLam AS startDate,
                    nv.ChucVu AS role,
                    nv.Luong AS salary,
                    (ISNULL(cn_now.TenCN, 'none')) AS currentBranch
                FROM Nhan_vien nv
                LEFT JOIN Chi_nhanh cn_now ON cn_now.MaCN = (
                    SELECT TOP 1 MaCN
                    FROM Lich_su_nhan_vien WHERE MaNV = nv.MaNV AND NgayKT IS NULL
                )
                ORDER BY nv.MaNV;
            `);

            const all_branches = await this.execute(`
                SELECT MaCN, TenCN FROM Chi_nhanh
            `);

            const all_roles = await this.execute(`
                SELECT DISTINCT ChucVu FROM Nhan_vien
            `);

            return {
                "branch_data": [...all_branches.recordset],
                "role_data": [...all_roles.recordset],
                "employee_data": [...result.recordset]
            }
        } catch (error) {
            throw error;
        }
    }

    // Thêm nhân viên
    async addEmployee(employeeData) {
        try {
            let insert_data = {
                HoTen: employeeData.fullName,
                GioiTinh: employeeData.gender,
                NgaySinh: employeeData.dob,
                NgayVaoLam: employeeData.entryDate,
                ChucVu: employeeData.role,
                Luong: employeeData.salary,
                MaCN: employeeData.branch
            };

            const newEmployeeRecord = await this.execute(`
                INSERT INTO Nhan_vien (HoTen, GioiTinh, NgaySinh, NgayVaoLam, ChucVu, Luong)
                VALUES (@HoTen, @GioiTinh, @NgaySinh, @NgayVaoLam, @ChucVu, @Luong);
                
                SELECT SCOPE_IDENTITY() AS MaNV, @HoTen AS HoTen, @GioiTinh AS GioiTinh, 
                       @NgaySinh AS NgaySinh, @NgayVaoLam AS NgayVaoLam, @ChucVu AS ChucVu, @Luong AS Luong;
            `, insert_data);
            
            const newHistoryRecord = await this.execute(`
                INSERT INTO Lich_su_nhan_vien (MaNV, MaCN, NgayBD, NgayKT)
                VALUES (@MaNV, @MaCN, @NgayBD, NULL)
            `, {MaNV: newEmployeeRecord.recordset[0].MaNV, MaCN: employeeData.branch, NgayBD: employeeData.entryDate});

            const new_account = await this.execute(`
                INSERT INTO Tai_khoan (TenDangNhap, MatKhau, MaKH, MaNV, VaiTro)
                VALUES (@fullname, @password, NULL, @MaNV, @role)
            `, {fullname: "nv" + newEmployeeRecord.recordset[0].MaNV, password: 'password123', MaNV: newEmployeeRecord.recordset[0].MaNV, role: employeeData.role});

            const branch_name = await this.execute(`
                SELECT TenCN FROM Chi_nhanh WHERE MaCN = @MaCN
            `, {MaCN: employeeData.branch});

            return {
                name: newEmployeeRecord.recordset[0].HoTen,
                id: newEmployeeRecord.recordset[0].MaNV,
                gender: newEmployeeRecord.recordset[0].GioiTinh,
                dob: newEmployeeRecord.recordset[0].NgaySinh,
                startDate: newEmployeeRecord.recordset[0].NgayVaoLam,
                role: newEmployeeRecord.recordset[0].ChucVu,
                salary: newEmployeeRecord.recordset[0].Luong,
                currentBranch: branch_name.recordset[0].TenCN
            }
        } catch (error) {
            throw error;
        }   
    }

    // Cập nhật nhân viên
    async updateEmployee(id, employeeData) {
        try {
            console.log("Updating employee in repository with ID:", id, "and data:", employeeData);

            let update_data = {
                id: id,
                HoTen: employeeData.fullName,
                GioiTinh: employeeData.gender,
                NgaySinh: employeeData.dob,
                NgayVaoLam: employeeData.entryDate,
                ChucVu: employeeData.role,
                Luong: employeeData.salary,
            };

            const previousBranch = await this.execute(`
                UPDATE Lich_su_nhan_vien
                SET NgayKT = @NgayKT
                WHERE MaNV = @id AND NgayKT IS NULL
            `, {id, NgayKT: new Date()});

            const previousRole = await this.execute(`
                SELECT VaiTro FROM Tai_khoan
                WHERE MaNV = @id
            `, {id});

            if(previousRole.recordset[0].VaiTro !== employeeData.role) {
                const updateAccount = await this.execute(`
                    UPDATE Tai_khoan
                    SET VaiTro = @role
                    WHERE MaNV = @id
                `, {id, role: employeeData.role});
            }

            if(employeeData.branch !== 'none') {
                // Kiểm tra xem có record nào với cùng MaNV, MaCN và NgayBD không
                const existingRecord = await this.execute(`
                    SELECT MaNV FROM Lich_su_nhan_vien
                    WHERE MaNV = @MaNV AND MaCN = @MaCN AND CAST(NgayBD AS DATE) = CAST(@NgayBD AS DATE)
                `, {MaNV: id, MaCN: employeeData.branch, NgayBD: new Date()});
                
                // Chỉ INSERT nếu chưa có record
                if(existingRecord.recordset.length === 0) {
                    const newHistoryRecord = await this.execute(`
                        INSERT INTO Lich_su_nhan_vien (MaNV, MaCN, NgayBD, NgayKT)
                        VALUES (@MaNV, @MaCN, @NgayBD, NULL)
                    `, {MaNV: id, MaCN: employeeData.branch, NgayBD: new Date()});
                }
            }

            const updatedEmployeeRecord = await this.execute(`
                UPDATE Nhan_vien
                SET HoTen = @HoTen,
                    GioiTinh = @GioiTinh,
                    NgaySinh = @NgaySinh,
                    NgayVaoLam = @NgayVaoLam,
                    ChucVu = @ChucVu,
                    Luong = @Luong
                WHERE MaNV = @id
            `, {...update_data});

            const updated_data = await this.execute(`
                SELECT
                    nv.MaNV AS id,
                    nv.HoTen AS name,
                    nv.GioiTinh AS gender,
                    nv.NgaySinh AS dob,
                    nv.NgayVaoLam AS startDate,
                    nv.ChucVu AS role,
                    nv.Luong AS salary,
                    (ISNULL(cn_now.TenCN, 'none')) AS currentBranch
                FROM Nhan_vien nv
                LEFT JOIN Chi_nhanh cn_now ON cn_now.MaCN = (
                    SELECT TOP 1 MaCN
                    FROM Lich_su_nhan_vien WHERE MaNV = nv.MaNV AND NgayKT IS NULL
                )
                WHERE nv.MaNV = @id
                ORDER BY nv.MaNV;
                `, {id});

            return updated_data.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Xóa nhân viên
    async deleteEmployee(id) {
        try {
            const historyDeletion = await this.execute(`
                DELETE FROM Lich_su_nhan_vien
                WHERE MaNV = @id
            `, {id});

            const accountDeletion = await this.execute(`
                DELETE FROM Tai_khoan
                WHERE MaNV = @id
            `, {id});

            const deletedEmployee = await this.execute(`
                DELETE FROM Nhan_vien
                OUTPUT DELETED.MaNV, DELETED.HoTen, DELETED.GioiTinh, DELETED.NgaySinh, DELETED.NgayVaoLam, DELETED.ChucVu, DELETED.Luong
                WHERE MaNV = @id
            `, {id});

            return deletedEmployee.recordset[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CompanyRepository;