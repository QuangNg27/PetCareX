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
        const { MaCN, MaDV, MaTC, NgayKham } = examinationData;
        
        const result = await this.execute(`
            INSERT INTO Kham_benh (MaCN, MaDV, MaTC, NgayKham)
            OUTPUT INSERTED.MaKB
            VALUES (@MaCN, @MaDV, @MaTC, @NgayKham)
        `, {
            MaCN,
            MaDV,
            MaTC,
            NgayKham,
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
        const { MaCN, MaDV, MaTC, NgayTiem } = vaccinationData;
        
        const result = await this.execute(`
            INSERT INTO Tiem_phong (MaCN, MaDV, MaTC, NgayTiem)
            OUTPUT INSERTED.MaTP
            VALUES (@MaCN, @MaDV, @MaTC, @NgayTiem)
        `, {
            MaCN,
            MaDV,
            MaTC,
            NgayTiem
        });

        return result.recordset[0];
    }

    async updateVaccination(vaccinationId, updateData, doctorId) {
        const first = await this.execute(`
            UPDATE Tiem_phong
            SET MaNV = @MaNV
            WHERE MaTP = @MaTP
        `, {
            MaNV: doctorId,
            MaTP: vaccinationId
        });

        for (const detail of updateData) {
            const { MaSP, LieuLuong, TrangThai } = detail;
            await this.execute(`
                UPDATE Chi_tiet_tiem_phong
                SET LieuLuong = @LieuLuong,
                    TrangThai = @TrangThai
                WHERE MaTP = @MaTP AND MaSP = @MaSP
            `, {
                LieuLuong,
                TrangThai,
                MaTP: vaccinationId,
                MaSP
            });
        }

        return first.rowsAffected[0] > 0;
    }

    async addVaccinationDetail(vaccinationId, detailData) {
        const { MaSP, MaGoi } = detailData;
        
        const result = await this.execute(`
            INSERT INTO Chi_tiet_tiem_phong (MaTP, MaSP, MaGoi)
            VALUES (@MaTP, @MaSP, @MaGoi)
        `, {
            MaTP: vaccinationId,
            MaSP,
            MaGoi
        });

        return result.rowsAffected[0] > 0;
    }

    async updateVaccinationDetail(vaccinationDetailId, updateData) {
        const { MaSP, LieuLuong, TrangThai } = updateData;
        
        const result = await this.execute(`
            UPDATE Chi_tiet_tiem_phong
            SET LieuLuong = @LieuLuong,
                TrangThai = @TrangThai
            WHERE MaTP = @MaTP AND MaSP = @MaSP
        `, {
            LieuLuong,
            TrangThai,
            MaTP: vaccinationDetailId,
            MaSP
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
                    WHEN CAST(GETDATE() AS DATE) > gt.NgayKetThuc 
                    THEN N'Hoàn thành'
                    WHEN CAST(GETDATE() AS DATE) >= gt.NgayBatDau 
                    THEN N'Đang thực hiện'
                    ELSE N'Chưa bắt đầu'
                END as TrangThai,
                -- Get first pet info (if multiple vaccinations, just show one pet)
                (SELECT TOP 1 tc.Ten 
                 FROM Chi_tiet_tiem_phong cttp
                 INNER JOIN Tiem_phong tp ON cttp.MaTP = tp.MaTP
                 INNER JOIN Thu_cung tc ON tp.MaTC = tc.MaTC
                 WHERE cttp.MaGoi = gt.MaGoi
                ) as TenThuCung,
                (SELECT TOP 1 tc.Loai + ' ' + tc.Giong
                 FROM Chi_tiet_tiem_phong cttp
                 INNER JOIN Tiem_phong tp ON cttp.MaTP = tp.MaTP
                 INNER JOIN Thu_cung tc ON tp.MaTC = tc.MaTC
                 WHERE cttp.MaGoi = gt.MaGoi
                ) as LoaiThuCung,
                -- Count total vaccinations in package
                (SELECT COUNT(*)
                 FROM Chi_tiet_tiem_phong cttp
                 WHERE cttp.MaGoi = gt.MaGoi
                ) as TongSoMui,
                -- Count completed vaccinations
                (SELECT COUNT(*)
                 FROM Chi_tiet_tiem_phong cttp
                 WHERE cttp.MaGoi = gt.MaGoi AND cttp.TrangThai = N'Đã tiêm'
                ) as SoMuiHoanThanh
            FROM Goi_tiem gt
            WHERE gt.MaKH = @MaKH
            ORDER BY gt.NgayBatDau DESC
        `, { MaKH: customerId });

        return result.recordset;
    }

    async getVaccinationPackageDetails(packageId) {
        const result = await this.execute(`
            SELECT 
                cttp.MaTP,
                cttp.MaSP,
                sp.TenSP as TenVaccine,
                cttp.LieuLuong,
                cttp.TrangThai,
                tp.NgayTiem
            FROM Chi_tiet_tiem_phong cttp
            INNER JOIN San_pham sp ON cttp.MaSP = sp.MaSP
            INNER JOIN Tiem_phong tp ON cttp.MaTP = tp.MaTP
            WHERE cttp.MaGoi = @MaGoi
            ORDER BY tp.NgayTiem DESC
        `, { MaGoi: packageId });

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
        `, { 
            MaCN: branchId,
            NgayKham: date
        });

        return result.recordset;
    }
}

module.exports = ServiceRepository;