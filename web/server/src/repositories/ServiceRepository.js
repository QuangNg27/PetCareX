const BaseRepository = require("./BaseRepository");

class ServiceRepository extends BaseRepository {
  async getBranchServices(branchId) {
    const result = await this.execute(
      `
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
        `,
      { MaCN: branchId }
    );

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
    const {
      MaCN,
      MaDV,
      MaTC,
      MaNV,
      NgayKham,
      TrieuChung,
      ChanDoan,
      NgayTaiKham,
    } = examinationData;

    const result = await this.execute(
      `
        INSERT INTO Kham_benh (MaCN, MaDV, MaTC, MaNV, NgayKham, TrieuChung, ChanDoan, NgayTaiKham)
        VALUES (@MaCN, @MaDV, @MaTC, @MaNV, @NgayKham, @TrieuChung, @ChanDoan, @NgayTaiKham);
        
        SELECT CAST(SCOPE_IDENTITY() AS INT) AS MaKB;
      `,
      {
        MaCN,
        MaDV,
        MaTC,
        MaNV: MaNV || null,
        NgayKham,
        TrieuChung: TrieuChung || null,
        ChanDoan: ChanDoan || null,
        NgayTaiKham: NgayTaiKham || null,
      }
    );

    return result.recordset[0];
  }
  async updateMedicalExamination(examinationId, updateData) {
    const { TrieuChung, ChanDoan, NgayTaiKham, MaNV } = updateData;

    const result = await this.execute(
      `
            UPDATE Kham_benh 
            SET TrieuChung = @TrieuChung,
                ChanDoan = @ChanDoan,
                NgayTaiKham = @NgayTaiKham,
                MaNV = @MaNV
            WHERE MaKB = @MaKB
        `,
      {
        TrieuChung,
        ChanDoan,
        NgayTaiKham,
        MaNV,
        MaKB: examinationId,
      }
    );

    return result.rowsAffected[0] > 0;
  }

  async addPrescription(examinationId, prescriptionData) {
    const { MaSP, SoLuong } = prescriptionData;

    const result = await this.execute(
      `
    SET NOCOUNT ON;
    
    IF NOT EXISTS (SELECT 1 FROM Toa_thuoc WHERE MaKB = @MaKB AND MaSP = @MaSP)
    BEGIN
      INSERT INTO Toa_thuoc (MaKB, MaSP, SoLuong)
      VALUES (@MaKB, @MaSP, @SoLuong);
    END
    `,
      {
        MaKB: examinationId,
        MaSP,
        SoLuong: SoLuong || 1,
      }
    );

    return result.rowsAffected[0] > 0;
  }

  async getPrescriptions(examinationId) {
    const result = await this.execute(
      `
            SELECT 
                tt.MaKB,
                sp.MaSP,
                sp.TenSP,
                gsp.SoTien as Gia,
                tt.SoLuong
            FROM Toa_thuoc tt
            INNER JOIN San_pham sp ON tt.MaSP = sp.MaSP
            LEFT JOIN (
              SELECT MaSP, SoTien, NgayApDung,
                ROW_NUMBER() OVER (PARTITION BY MaSP ORDER BY NgayApDung DESC) as rn
              FROM Gia_san_pham
            ) gsp ON sp.MaSP = gsp.MaSP AND gsp.rn = 1
            WHERE tt.MaKB = @MaKB
        `,
      { MaKB: examinationId }
    );

    return result.recordset || [];
  }

  async createVaccination(vaccinationData) {
    const { MaCN, MaDV, MaTC, NgayTiem } = vaccinationData;

    const result = await this.execute(
      `
            INSERT INTO Tiem_phong (MaCN, MaDV, MaTC, NgayTiem)
            OUTPUT INSERTED.MaTP
            VALUES (@MaCN, @MaDV, @MaTC, @NgayTiem)
        `,
      {
        MaCN,
        MaDV,
        MaTC,
        NgayTiem,
      }
    );

    return result.recordset[0];
  }

  async updateVaccination(vaccinationId, updateData, doctorId) {
    const first = await this.execute(
      `
            UPDATE Tiem_phong
            SET MaNV = @MaNV
            WHERE MaTP = @MaTP
        `,
      {
        MaNV: doctorId,
        MaTP: vaccinationId,
      }
    );

    for (const detail of updateData) {
      const { MaSP, LieuLuong, TrangThai } = detail;
      await this.execute(
        `
                UPDATE Chi_tiet_tiem_phong
                SET LieuLuong = @LieuLuong,
                    TrangThai = @TrangThai
                WHERE MaTP = @MaTP AND MaSP = @MaSP
            `,
        {
          LieuLuong,
          TrangThai,
          MaTP: vaccinationId,
          MaSP,
        }
      );
    }

    return first.rowsAffected[0] > 0;
  }

  async addVaccinationDetail(vaccinationId, detailData) {
    const { MaSP, MaGoi } = detailData;

    const result = await this.execute(
      `
            INSERT INTO Chi_tiet_tiem_phong (MaTP, MaSP, MaGoi)
            VALUES (@MaTP, @MaSP, @MaGoi)
        `,
      {
        MaTP: vaccinationId,
        MaSP,
        MaGoi,
      }
    );

    return result.rowsAffected[0] > 0;
  }

  async updateVaccinationDetail(vaccinationDetailId, updateData) {
    const { MaSP, LieuLuong, TrangThai } = updateData;

    const result = await this.execute(
      `
            UPDATE Chi_tiet_tiem_phong
            SET LieuLuong = @LieuLuong,
                TrangThai = @TrangThai
            WHERE MaTP = @MaTP AND MaSP = @MaSP
        `,
      {
        LieuLuong,
        TrangThai,
        MaTP: vaccinationDetailId,
        MaSP,
      }
    );

    return result.rowsAffected[0] > 0;
  }

  async createVaccinationPackage(packageData) {
    const { MaKH, NgayBatDau, NgayKetThuc, UuDai } = packageData;

    const result = await this.execute(
      `
            INSERT INTO Goi_tiem (MaKH, NgayBatDau, NgayKetThuc, UuDai)
            OUTPUT INSERTED.MaGoi
            VALUES (@MaKH, @NgayBatDau, @NgayKetThuc, @UuDai)
        `,
      {
        MaKH,
        NgayBatDau,
        NgayKetThuc,
        UuDai,
      }
    );

    return result.recordset[0];
  }

  async getVaccinationPackages(customerId) {
    const result = await this.execute(
      `
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
        `,
      { MaKH: customerId }
    );

    return result.recordset;
  }

  async getVaccinationPackageDetails(packageId) {
    const result = await this.execute(
      `
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
        `,
      { MaGoi: packageId }
    );

    return result.recordset;
  }

  async updateServicePrice(serviceId, price, effectiveDate) {
    await this.executeProcedure("Update_GiaDV", {
      MaDV: serviceId,
      SoTien: price,
      NgayApDung: effectiveDate,
    });

    return true;
  }

  async getServicePriceHistory(serviceId) {
    const result = await this.execute(
      `
            SELECT 
                gd.NgayApDung,
                gd.SoTien
            FROM Gia_dich_vu gd
            WHERE gd.MaDV = @MaDV
            ORDER BY gd.NgayApDung DESC
        `,
      { MaDV: serviceId }
    );

    return result.recordset;
  }

  async getMedicalExamination(examinationId) {
    const result = await this.execute(
      `
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
        `,
      { MaKB: examinationId }
    );

    return result.recordset[0];
  }

  async getExaminations(filters = {}) {
    const {
      MaCN = null,
      MaNV = null,
      MaTC = null,
      FromDate = null,
      ToDate = null,
    } = filters;

    const result = await this.execute(
      `
            SELECT 
                kb.MaKB,
                kb.MaCN,
                kb.MaDV,
                dv.TenDV,
                ISNULL(gdv.SoTien, 0) as GiaDichVu,
                kb.MaTC,
                tc.Ten as TenThuCung,
                tc.Loai + ' ' + tc.Giong as LoaiThuCung,
                tc.MaKH,
                kh.HoTen as TenKhachHang,
                kb.MaNV,
                nv.HoTen as TenBacSi,
                kb.NgayKham,
                kb.TrieuChung,
                kb.ChanDoan,
                kb.NgayTaiKham
            FROM Kham_benh kb
            INNER JOIN Thu_cung tc ON kb.MaTC = tc.MaTC
            INNER JOIN Khach_hang kh ON tc.MaKH = kh.MaKH
            LEFT JOIN Nhan_vien nv ON kb.MaNV = nv.MaNV
            LEFT JOIN Dich_vu dv ON kb.MaDV = dv.MaDV
            LEFT JOIN (
              SELECT MaDV, SoTien, NgayApDung,
                ROW_NUMBER() OVER (PARTITION BY MaDV ORDER BY NgayApDung DESC) as rn
              FROM Gia_dich_vu
            ) gdv ON dv.MaDV = gdv.MaDV AND gdv.rn = 1
            WHERE (@MaCN IS NULL OR kb.MaCN = @MaCN)
            AND (@MaNV IS NULL OR kb.MaNV = @MaNV)
            AND (@MaTC IS NULL OR kb.MaTC = @MaTC)
            AND (@FromDate IS NULL OR kb.NgayKham >= @FromDate)
            AND (@ToDate IS NULL OR kb.NgayKham <= @ToDate)
            ORDER BY kb.NgayKham DESC
        `,
      {
        MaCN,
        MaNV,
        MaTC,
        FromDate,
        ToDate,
      }
    );

    return result.recordset;
  }

  async getExaminationsWithMedicines(filters = {}) {
    const {
      MaCN = null,
      MaNV = null,
      MaTC = null,
      FromDate = null,
      ToDate = null,
    } = filters;

    const result = await this.execute(
      `
            SELECT 
                kb.MaKB,
                kb.MaCN,
                kb.MaDV,
                dv.TenDV,
                ISNULL(gdv.SoTien, 0) as GiaDichVu,
                kb.MaTC,
                tc.Ten as TenThuCung,
                tc.Loai + ' ' + tc.Giong as LoaiThuCung,
                tc.MaKH,
                kh.HoTen as TenKhachHang,
                kb.MaNV,
                nv.HoTen as TenBacSi,
                kb.NgayKham,
                kb.TrieuChung,
                kb.ChanDoan,
                kb.NgayTaiKham
            FROM Kham_benh kb
            INNER JOIN Thu_cung tc ON kb.MaTC = tc.MaTC
            INNER JOIN Khach_hang kh ON tc.MaKH = kh.MaKH
            LEFT JOIN Nhan_vien nv ON kb.MaNV = nv.MaNV
            LEFT JOIN Dich_vu dv ON kb.MaDV = dv.MaDV
            LEFT JOIN (
              SELECT MaDV, SoTien, NgayApDung,
                ROW_NUMBER() OVER (PARTITION BY MaDV ORDER BY NgayApDung DESC) as rn
              FROM Gia_dich_vu
            ) gdv ON dv.MaDV = gdv.MaDV AND gdv.rn = 1
            WHERE (@MaCN IS NULL OR kb.MaCN = @MaCN)
            AND (@MaNV IS NULL OR kb.MaNV = @MaNV)
            AND (@MaTC IS NULL OR kb.MaTC = @MaTC)
            AND (@FromDate IS NULL OR kb.NgayKham >= @FromDate)
            AND (@ToDate IS NULL OR kb.NgayKham <= @ToDate)
            ORDER BY kb.NgayKham DESC
        `,
      {
        MaCN,
        MaNV,
        MaTC,
        FromDate,
        ToDate,
      }
    );

    const exams = result.recordset;
    // Fetch medicines for each exam if there are any exams
    if (exams && exams.length > 0) {
      try {
        const medicinesResult = await this.execute(
          `
            SELECT 
                tt.MaKB,
                sp.MaSP,
                sp.TenSP,
                gsp.SoTien as Gia,
                tt.SoLuong
            FROM Toa_thuoc tt
            INNER JOIN San_pham sp ON tt.MaSP = sp.MaSP
            INNER JOIN (
              SELECT MaSP, SoTien, NgayApDung,
                ROW_NUMBER() OVER (PARTITION BY MaSP ORDER BY NgayApDung DESC) as rn
              FROM Gia_san_pham
            ) gsp ON sp.MaSP = gsp.MaSP AND gsp.rn = 1
            WHERE tt.MaKB IN (
              ${exams.map((_, i) => `@MaKB${i}`).join(",")}
            )
          `,
          exams.reduce((params, exam, i) => {
            params[`MaKB${i}`] = exam.MaKB;
            return params;
          }, {})
        );

        const medicines = medicinesResult.recordset || [];

        // Attach medicines to each exam
        exams.forEach((exam) => {
          exam.Medicines = medicines.filter((m) => m.MaKB === exam.MaKB);
        });
      } catch (err) {
        console.error("Error fetching medicines:", err);
        // Continue without medicines if query fails
        exams.forEach((exam) => {
          exam.Medicines = [];
        });
      }
    }

    return exams;
  }

  async getVaccination(vaccinationId) {
    const result = await this.execute(
      `
            SELECT 
                tp.MaTP,
                tp.MaCN,
                tp.MaDV,
                tp.MaTC,
                tp.MaNV,
                tp.NgayTiem
            FROM Tiem_phong tp
            WHERE tp.MaTP = @MaTP
        `,
      { MaTP: vaccinationId }
    );

    return result.recordset[0];
  }

  async getVaccinationDetails(vaccinationId) {
    const result = await this.execute(
      `
            SELECT 
                TC.Ten AS TenThuCung,
                SP.TenSP AS TenVaccine,
                CTTP.LieuLuong AS LieuLuong,
                CASE 
                    WHEN CTTP.MaGoi IS NULL THEN N'Tiêm lẻ' 
                    ELSE CAST(CTTP.MaGoi AS NVARCHAR(10)) 
                END AS GoiTiem,
                TP.NgayTiem AS NgayTiem,
                GT.NgayKetThuc AS NgayKetThuc
            FROM Chi_tiet_tiem_phong CTTP
            JOIN Tiem_phong TP ON CTTP.MaTP = TP.MaTP
            JOIN Thu_cung TC ON TP.MaTC = TC.MaTC
            JOIN San_pham SP ON CTTP.MaSP = SP.MaSP
            LEFT JOIN Goi_tiem GT ON CTTP.MaGoi = GT.MaGoi
            WHERE CTTP.MaTP = @MaTP
            ORDER BY TP.NgayTiem DESC
        `,
      { MaTP: vaccinationId }
    );

    return result.recordset;
  }

  async getVaccinations(filters = {}) {
    const {
      MaCN = null,
      MaNV = null,
      MaTC = null,
      FromDate = null,
      ToDate = null,
    } = filters;

    const result = await this.execute(
      `
      SELECT
        tp.MaTP,
        tp.MaCN,
        tp.MaDV,
        dv.TenDV,
        tp.MaTC,
        tc.Ten as TenThuCung,
        tc.Loai + ' ' + tc.Giong as LoaiThuCung,
        tc.MaKH,
        kh.HoTen as TenKhachHang,
        tp.MaNV,
        nv.HoTen as TenBacSi,
        tp.NgayTiem
      FROM Tiem_phong tp
      INNER JOIN Thu_cung tc ON tp.MaTC = tc.MaTC
      INNER JOIN Khach_hang kh ON tc.MaKH = kh.MaKH
      LEFT JOIN Nhan_vien nv ON tp.MaNV = nv.MaNV
      LEFT JOIN Dich_vu dv ON tp.MaDV = dv.MaDV
      WHERE (@MaCN IS NULL OR tp.MaCN = @MaCN)
      AND (@MaNV IS NULL OR tp.MaNV = @MaNV)
      AND (@MaTC IS NULL OR tp.MaTC = @MaTC)
      AND (@FromDate IS NULL OR tp.NgayTiem >= @FromDate)
      AND (@ToDate IS NULL OR tp.NgayTiem <= @ToDate)
      ORDER BY tp.NgayTiem DESC
    `,
      {
        MaCN,
        MaNV,
        MaTC,
        FromDate,
        ToDate,
      }
    );

    return result.recordset;
  }

  async getAvailableVeterinarians(branchId, date) {
    const result = await this.execute(
      `
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
        `,
      {
        MaCN: branchId,
        NgayKham: date,
      }
    );

    return result.recordset;
  }

  async deletePrescription(examinationId, medicineId) {
    const result = await this.execute(
      `
    DELETE FROM Toa_thuoc
    WHERE MaKB = @MaKB AND MaSP = @MaSP;
    `,
      {
        MaKB: examinationId,
        MaSP: medicineId,
      }
    );

    return result.rowsAffected[0] > 0;
  }

  async deletePrescriptionsByExamination(examinationId) {
    const result = await this.execute(
      `
    DELETE FROM Toa_thuoc
    WHERE MaKB = @MaKB;
    `,
      {
        MaKB: examinationId,
      }
    );

    return result.rowsAffected[0];
  }
}

module.exports = ServiceRepository;
