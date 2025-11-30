const BaseRepository = require('./BaseRepository');

class ServiceRepository extends BaseRepository {
    async getBranchServices(branchId) {
        const result = await this.execute(`
            SELECT 
                dv.MaDV,
                dv.TenDV,
                gd.SoTien as GiaHienTai,
                gd.NgayApDung
            FROM Dich_vu_chi_nhanh dvcn
            JOIN Dich_vu dv ON dvcn.MaDV = dv.MaDV
            LEFT JOIN Gia_dich_vu gd ON dv.MaDV = gd.MaDV 
                AND gd.NgayApDung = (
                    SELECT MAX(NgayApDung) 
                    FROM Gia_dich_vu 
                    WHERE MaDV = dv.MaDV 
                    AND NgayApDung <= CAST(GETDATE() AS DATE)
                )
            WHERE dvcn.MaCN = @MaCN
            ORDER BY dv.TenDV
        `, { MaCN: branchId });

        return result.recordset;
    }

    async getAllServices() {
        const result = await this.execute(`
            SELECT 
                dv.MaDV,
                dv.TenDV,
                gd.SoTien as GiaHienTai,
                gd.NgayApDung
            FROM Dich_vu dv
            LEFT JOIN Gia_dich_vu gd ON dv.MaDV = gd.MaDV 
                AND gd.NgayApDung = (
                    SELECT MAX(NgayApDung) 
                    FROM Gia_dich_vu 
                    WHERE MaDV = dv.MaDV 
                    AND NgayApDung <= CAST(GETDATE() AS DATE)
                )
            ORDER BY dv.TenDV
        `);

        return result.recordset;
    }

    async createMedicalExamination(examinationData) {
        const { MaCN, MaDV, MaTC, MaNV, NgayKham, TrieuChung, ChanDoan, NgayTaiKham } = examinationData;
        
        const result = await this.execute(`
            INSERT INTO Kham_benh (MaCN, MaDV, MaTC, MaNV, NgayKham, TrieuChung, ChanDoan, NgayTaiKham)
            OUTPUT INSERTED.MaKB
            VALUES (@MaCN, @MaDV, @MaTC, @MaNV, @NgayKham, @TrieuChung, @ChanDoan, @NgayTaiKham)
        `, {
            MaCN,
            MaDV,
            MaTC,
            MaNV,
            NgayKham,
            TrieuChung,
            ChanDoan,
            NgayTaiKham
        });

        return result.recordset[0];
    }

    async updateMedicalExamination(examinationId, updateData) {
        const { TrieuChung, ChanDoan, NgayTaiKham, MaNV } = updateData;
        
        const result = await this.execute(`
            UPDATE Kham_benh 
            SET TrieuChung = @TrieuChung,
                ChanDoan = @ChanDoan,
                NgayTaiKham = @NgayTaiKham,
                MaNV = @MaNV
            WHERE MaKB = @MaKB
        `, {
            TrieuChung,
            ChanDoan,
            NgayTaiKham,
            MaNV,
            MaKB: examinationId
        });

        return result.rowsAffected[0] > 0;
    }

    async addPrescription(examinationId, prescriptionData) {
        const { MaSP, SoLuong } = prescriptionData;
        
        const result = await this.execute(`
            INSERT INTO Toa_thuoc (MaKB, MaSP, SoLuong)
            VALUES (@MaKB, @MaSP, @SoLuong)
        `, {
            MaKB: examinationId,
            MaSP,
            SoLuong
        });

        return result.rowsAffected[0] > 0;
    }

    async createVaccination(vaccinationData) {
        const { MaCN, MaDV, MaTC, MaNV, NgayTiem } = vaccinationData;
        
        const result = await this.execute(`
            INSERT INTO Tiem_phong (MaCN, MaDV, MaTC, MaNV, NgayTiem)
            OUTPUT INSERTED.MaTP
            VALUES (@MaCN, @MaDV, @MaTC, @MaNV, @NgayTiem)
        `, {
            MaCN,
            MaDV,
            MaTC,
            MaNV,
            NgayTiem
        });

        return result.recordset[0];
    }

    async updateVaccination(vaccinationId, updateData) {
        const { MaNV } = updateData;
        
        const result = await this.execute(`
            UPDATE Tiem_phong
            SET MaNV = @MaNV
            WHERE MaTP = @MaTP
        `, {
            MaNV,
            MaTP: vaccinationId
        });

        return result.rowsAffected[0] > 0;
    }

    async addVaccinationDetail(vaccinationId, detailData) {
        const { MaSP, LieuLuong, TrangThai, MaGoi } = detailData;
        
        const result = await this.execute(`
            INSERT INTO Chi_tiet_tiem_phong (MaTP, MaSP, LieuLuong, TrangThai, MaGoi)
            VALUES (@MaTP, @MaSP, @LieuLuong, @TrangThai, @MaGoi)
        `, {
            MaTP: vaccinationId,
            MaSP,
            LieuLuong,
            TrangThai,
            MaGoi
        });

        return result.rowsAffected[0] > 0;
    }

    async updateVaccinationDetail(vaccinationDetailId, updateData) {
        const { LieuLuong, TrangThai } = updateData;
        
        const result = await this.execute(`
            UPDATE Chi_tiet_tiem_phong
            SET LieuLuong = @LieuLuong,
                TrangThai = @TrangThai
            WHERE MaCTTP = @MaCTTP
        `, {
            LieuLuong,
            TrangThai,
            MaCTTP: vaccinationDetailId
        });

        return result.rowsAffected[0] > 0;
    }

    async createVaccinationPackage(packageData) {
        const { MaKH, NgayBatDau, NgayKetThuc, UuDai } = packageData;
        
        const result = await this.execute(`
            INSERT INTO Goi_tiem (MaKH, NgayBatDau, NgayKetThuc, UuDai)
            OUTPUT INSERTED.MaGoi
            VALUES (@MaKH, @NgayBatDau, @NgayKetThuc, @UuDai)
        `, {
            MaKH,
            NgayBatDau,
            NgayKetThuc,
            UuDai
        });

        return result.recordset[0];
    }

    async getVaccinationPackages(customerId) {
        const result = await this.execute(`
            SELECT 
                gt.MaGoi,
                gt.NgayBatDau,
                gt.NgayKetThuc,
                gt.UuDai,
                CASE 
                    WHEN CAST(GETDATE() AS DATE) BETWEEN gt.NgayBatDau AND gt.NgayKetThuc 
                    THEN N'Đang áp dụng'
                    WHEN CAST(GETDATE() AS DATE) > gt.NgayKetThuc 
                    THEN N'Đã hết hạn'
                    ELSE N'Chưa áp dụng'
                END as TrangThai
            FROM Goi_tiem gt
            WHERE gt.MaKH = @MaKH
            ORDER BY gt.NgayBatDau DESC
        `, { MaKH: customerId });

        return result.recordset;
    }

    async updateServicePrice(serviceId, price, effectiveDate) {
        await this.executeProcedure('Update_GiaDV', {
            MaDV: serviceId,
            SoTien: price,
            NgayApDung: effectiveDate
        });
        
        return true;
    }

    async getServicePriceHistory(serviceId) {
        const result = await this.execute(`
            SELECT 
                gd.NgayApDung,
                gd.SoTien
            FROM Gia_dich_vu gd
            WHERE gd.MaDV = @MaDV
            ORDER BY gd.NgayApDung DESC
        `, { MaDV: serviceId });

        return result.recordset;
    }

    async getMedicalExamination(examinationId) {
        const result = await this.execute(`
            SELECT 
                kb.MaKB,
                kb.MaCN,
                kb.MaDV,
                kb.MaTC,
                kb.MaNV,
                kb.NgayKham,
                kb.TrieuChung,
                kb.ChanDoan,
                kb.NgayTaiKham
            FROM Kham_benh kb
            WHERE kb.MaKB = @MaKB
        `, { MaKB: examinationId });

        return result.recordset[0];
    }

    async getVaccination(vaccinationId) {
        const result = await this.execute(`
            SELECT 
                tp.MaTP,
                tp.MaCN,
                tp.MaDV,
                tp.MaTC,
                tp.MaNV,
                tp.NgayTiem
            FROM Tiem_phong tp
            WHERE tp.MaTP = @MaTP
        `, { MaTP: vaccinationId });

        return result.recordset[0];
    }

    async getAvailableVeterinarians(branchId, date) {
        const result = await this.execute(`
            SELECT 
                nv.MaNV,
                nv.HoTen,
                nv.ChucVu
            FROM Nhan_vien nv
            JOIN Lich_su_nhan_vien ls ON nv.MaNV = ls.MaNV
            WHERE nv.ChucVu = N'Bác sĩ'
            AND ls.MaCN = @MaCN
            AND ls.NgayBD <= @NgayKham
            AND (ls.NgayKT IS NULL OR ls.NgayKT >= @NgayKham)
            ORDER BY nv.HoTen
        `, { 
            MaCN: branchId,
            NgayKham: date
        });

        return result.recordset;
    }

    async getDoctorSchedule(doctorId, date) {
        const result = await this.execute(`
            SELECT 
                kb.MaKB,
                kb.NgayKham,
                tc.Ten as TenThuCung,
                kh.HoTen as TenKhachHang,
                dv.TenDV
            FROM Kham_benh kb
            JOIN Thu_cung tc ON kb.MaTC = tc.MaTC
            JOIN Khach_hang kh ON tc.MaKH = kh.MaKH
            JOIN Dich_vu dv ON kb.MaDV = dv.MaDV
            WHERE kb.MaNV = @MaNV
            AND kb.NgayKham = @NgayKham
            ORDER BY kb.NgayKham
        `, { 
            MaNV: doctorId,
            NgayKham: date
        });

        return result.recordset;
    }
}

module.exports = ServiceRepository;