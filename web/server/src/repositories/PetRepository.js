const BaseRepository = require('./BaseRepository');

class PetRepository extends BaseRepository {
    async createPet(customerId, petData) {
        const { Ten, Loai, Giong, GioiTinh, NgaySinh, TinhTrangSucKhoe } = petData;
        
        const result = await this.execute(`
            INSERT INTO Thu_cung (MaKH, Ten, Loai, Giong, GioiTinh, NgaySinh, TinhTrangSucKhoe)
            OUTPUT INSERTED.MaTC
            VALUES (@MaKH, @Ten, @Loai, @Giong, @GioiTinh, @NgaySinh, @TinhTrangSucKhoe)
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
            ORDER BY tc.Ten
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

    async getPetMedicalHistory(petId, limit = 10) {
        const result = await this.execute(`
            SELECT TOP (@Limit)
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
            JOIN Dich_vu_chi_nhanh dvcn ON kb.MaCN = dvcn.MaCN AND kb.MaDV = dvcn.MaDV
            JOIN Dich_vu dv ON dvcn.MaDV = dv.MaDV
            JOIN Chi_nhanh cn ON kb.MaCN = cn.MaCN
            WHERE kb.MaTC = @MaTC
            ORDER BY kb.NgayKham DESC
        `, { 
            MaTC: petId,
            Limit: limit
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
                tt.SoLuong,
            FROM Toa_thuoc tt
            JOIN San_pham sp ON tt.MaSP = sp.MaSP
            WHERE tt.MaKB IN (${placeholders})
            ORDER BY tt.MaKB, sp.TenSP
        `, params);

        return result.recordset;
    }       

    async getPetVaccinationHistory(petId, limit = 10) {
        const result = await this.execute(`
            SELECT TOP (@Limit)
                tp.MaTP,
                tp.NgayTiem,
                nv.HoTen as TenBacSi,
                dv.TenDV,
                cn.TenCN
            FROM Tiem_phong tp
            LEFT JOIN Nhan_vien nv ON tp.MaNV = nv.MaNV
            JOIN Dich_vu_chi_nhanh dvcn ON tp.MaCN = dvcn.MaCN AND tp.MaDV = dvcn.MaDV
            JOIN Dich_vu dv ON dvcn.MaDV = dv.MaDV
            JOIN Chi_nhanh cn ON tp.MaCN = cn.MaCN
            WHERE tp.MaTC = @MaTC
            ORDER BY tp.NgayTiem DESC
        `, { 
            MaTC: petId,
            Limit: limit
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