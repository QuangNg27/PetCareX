const BaseRepository = require('./BaseRepository');

class PetRepository extends BaseRepository {
    async createPet(customerId, petData) {
        const { Ten, Loai, Giong, GioiTinh, NgaySinh, TinhTrangSucKhoe } = petData;
        
        const result = await this.execute(`
            DECLARE @OutputTable TABLE (MaTC INT);
            
            INSERT INTO Thu_cung (MaKH, Ten, Loai, Giong, GioiTinh, NgaySinh, TinhTrangSucKhoe)
            OUTPUT INSERTED.MaTC INTO @OutputTable
            VALUES (@MaKH, @Ten, @Loai, @Giong, @GioiTinh, @NgaySinh, @TinhTrangSucKhoe);
            
            SELECT MaTC FROM @OutputTable;
        `, {
            MaKH: customerId,
            Ten,
            Loai,
            Giong,
            GioiTinh,
            NgaySinh,
            TinhTrangSucKhoe
        });

        return result.recordset[0];
    }

    async getCustomerPets(customerId) {
        const result = await this.execute(`
            SELECT 
                tc.MaTC,
                tc.Ten,
                tc.Loai,
                tc.Giong,
                tc.GioiTinh,
                tc.NgaySinh,
                tc.TinhTrangSucKhoe
            FROM Thu_cung tc
            WHERE tc.MaKH = @MaKH
        `, { MaKH: customerId });

        return result.recordset;
    }

    async getPetById(petId) {
        const result = await this.execute(`
            SELECT 
                tc.MaTC,
                tc.MaKH,
                tc.Ten,
                tc.Loai,
                tc.Giong,
                tc.GioiTinh,
                tc.NgaySinh,
                tc.TinhTrangSucKhoe,
                kh.HoTen as TenChuSoHuu,
                kh.SoDT as SoDTChuSoHuu
            FROM Thu_cung tc
            JOIN Khach_hang kh ON tc.MaKH = kh.MaKH
            WHERE tc.MaTC = @MaTC
        `, { MaTC: petId });

        return result.recordset[0];
    }

    async updatePet(petId, petData) {
        const { Ten, Loai, Giong, GioiTinh, NgaySinh, TinhTrangSucKhoe } = petData;
        
        const result = await this.execute(`
            UPDATE Thu_cung 
            SET Ten = @Ten,
                Loai = @Loai,
                Giong = @Giong,
                GioiTinh = @GioiTinh,
                NgaySinh = @NgaySinh,
                TinhTrangSucKhoe = @TinhTrangSucKhoe
            WHERE MaTC = @MaTC
        `, {
            Ten,
            Loai,
            Giong,
            GioiTinh,
            NgaySinh,
            TinhTrangSucKhoe,
            MaTC: petId,
        });

        return result.rowsAffected[0] > 0;
    }

    async deletePet(petId) {
        const result = await this.execute(`
            DELETE FROM Thu_cung 
            WHERE MaTC = @MaTC
        `, {
            MaTC: petId
        });

        return result.rowsAffected[0] > 0;
    }

    async getPetMedicalHistory(petId, limit = 100) {
        const result = await this.execute(`
            SELECT
                kb.MaKB,
                kb.NgayKham,
                kb.TrieuChung,
                kb.ChanDoan,
                kb.NgayTaiKham,
                nv.HoTen as TenBacSi,
                dv.TenDV,
                cn.TenCN
            FROM Kham_benh kb
            LEFT JOIN Nhan_vien nv ON kb.MaNV = nv.MaNV
            LEFT JOIN Dich_vu dv ON kb.MaDV = dv.MaDV
            LEFT JOIN Chi_nhanh cn ON kb.MaCN = cn.MaCN
            WHERE kb.MaTC = @MaTC
            ORDER BY kb.NgayKham DESC
        `, { 
            MaTC: petId
        });

        return result.recordset;
    }

    async getPetMedicineBasedOnTreatment(treatmentIds) {
        if (!treatmentIds || treatmentIds.length === 0) {
            return [];
        }

        const placeholders = treatmentIds.map((_, index) => `@MaKB${index}`).join(',');
        const params = {};
        
        treatmentIds.forEach((id, index) => {
            params[`MaKB${index}`] = id;
        });

        const result = await this.execute(`
            SELECT 
                tt.MaKB,
                sp.TenSP as TenThuoc,
                tt.SoLuong
            FROM Toa_thuoc tt
            JOIN San_pham sp ON tt.MaSP = sp.MaSP
            WHERE tt.MaKB IN (${placeholders})
            ORDER BY tt.MaKB, sp.TenSP
        `, params);

        return result.recordset;
    }       

    async getPetVaccinationHistory(petId, limit = 100) {
        const result = await this.execute(`
            SELECT
                tp.MaTP,
                tp.NgayTiem,
                ISNULL(nv.HoTen, N'Chưa có bác sĩ') as TenBacSi,
                ISNULL(dv.TenDV, N'Chưa xác định') as TenDV,
                ISNULL(cn.TenCN, N'Chưa xác định') as TenCN,
                cttp.MaGoi,
                gt.UuDai
            FROM Tiem_phong tp
            LEFT JOIN Nhan_vien nv ON tp.MaNV = nv.MaNV
            LEFT JOIN Dich_vu dv ON tp.MaDV = dv.MaDV
            LEFT JOIN Chi_nhanh cn ON tp.MaCN = cn.MaCN
            LEFT JOIN Chi_tiet_tiem_phong cttp ON tp.MaTP = cttp.MaTP
            LEFT JOIN Goi_tiem gt ON cttp.MaGoi = gt.MaGoi
            WHERE tp.MaTC = @MaTC
            ORDER BY tp.NgayTiem DESC
        `, { 
            MaTC: petId
        });

        return result.recordset;
    }

    async getPetVaccineBasedOnVaccination(vaccinationIds) {
        if (!vaccinationIds || vaccinationIds.length === 0) {
            return [];
        }

        const placeholders = vaccinationIds.map((_, index) => `@MaTP${index}`).join(',');
        const params = {};
        
        vaccinationIds.forEach((id, index) => {
            params[`MaTP${index}`] = id;
        });

        const result = await this.execute(`
            SELECT 
                cttp.MaTP,
                cttp.LieuLuong,
                cttp.TrangThai,
                cttp.MaGoi,
                sp.TenSP as TenVaccine,
                sp.LoaiVaccine
            FROM Chi_tiet_tiem_phong cttp
            LEFT JOIN San_pham sp ON cttp.MaSP = sp.MaSP
            WHERE cttp.MaTP IN (${placeholders})
            ORDER BY cttp.MaTP, sp.TenSP
        `, params);

        return result.recordset;
    }

    async checkPetOwnership(petId, customerId) {
        const result = await this.execute(`
            SELECT 1 FROM Thu_cung 
            WHERE MaTC = @MaTC AND MaKH = @MaKH
        `, {
            MaTC: petId,
            MaKH: customerId
        });

        return result.recordset.length > 0;
    }
}

module.exports = PetRepository;