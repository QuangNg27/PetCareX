const BaseRepository = require("./BaseRepository");

class InvoiceRepository extends BaseRepository {
  async createInvoice(invoiceData) {
    const { MaKH, MaCN, MaNV, NgayLap, HinhThucTT, CT_SanPham, CT_DichVu } =
      invoiceData;

    const result = await this.executeWithTVP(
      "Add_HoaDon",
      {
        MaKH,
        MaCN,
        MaNV,
        NgayLap,
        HinhThucTT,
      },
      {
        CT_SanPham: CT_SanPham || [],
        CT_DichVu: CT_DichVu || [],
      }
    );

    return { success: true };
  }

  async getInvoiceDetails(invoiceId) {
    const result = await this.execute(
      `
            SELECT 
                hd.MaHD,
                hd.MaKH,
                hd.MaCN,
                hd.MaNV,
                hd.NgayLap,
                hd.TongTien,
                hd.KhuyenMai,
                hd.HinhThucTT,
                kh.HoTen as TenKhachHang,
                kh.SoDT as SDTKhachHang,
                nv.HoTen as TenNhanVien,
                cn.TenCN as TenChiNhanh,
                cn.DiaChi as DiaChiChiNhanh
            FROM Hoa_don hd
            JOIN Khach_hang kh ON hd.MaKH = kh.MaKH
            JOIN Nhan_vien nv ON hd.MaNV = nv.MaNV
            JOIN Chi_nhanh cn ON hd.MaCN = cn.MaCN
            WHERE hd.MaHD = @MaHD
        `,
      { MaHD: invoiceId }
    );

    const invoice = result.recordset[0];
    if (!invoice) return null;

    // Get product details
    const productResult = await this.execute(
      `
            SELECT 
                ctsp.MaSP,
                ctsp.SoLuong,
                ctsp.GiaApDung,
                sp.TenSP,
                ctsp.SoLuong * ctsp.GiaApDung as ThanhTien
            FROM Chi_tiet_hoa_don_SP ctsp
            JOIN San_pham sp ON ctsp.MaSP = sp.MaSP
            WHERE ctsp.MaHD = @MaHD
        `,
      { MaHD: invoiceId }
    );

    // Get service details
    const serviceResult = await this.execute(
      `
            SELECT 
                ctdv.MaDV,
                ctdv.MaTC,
                ctdv.GiaApDung,
                dv.TenDV,
                tc.Ten as TenThuCung
            FROM Chi_tiet_hoa_don_DV ctdv
            JOIN Dich_vu dv ON ctdv.MaDV = dv.MaDV
            JOIN Thu_cung tc ON ctdv.MaTC = tc.MaTC
            WHERE ctdv.MaHD = @MaHD
        `,
      { MaHD: invoiceId }
    );

    return {
      ...invoice,
      SanPham: productResult.recordset,
      DichVu: serviceResult.recordset,
    };
  }

  async getCustomerInvoices(customerId, limit = 10, offset = 0) {
    const result = await this.execute(
      `
            SELECT 
                hd.MaHD,
                hd.NgayLap,
                hd.TongTien,
                hd.KhuyenMai,
                hd.HinhThucTT,
                cn.TenCN,
                nv.HoTen as TenNhanVien
            FROM Hoa_don hd
            JOIN Chi_nhanh cn ON hd.MaCN = cn.MaCN
            JOIN Nhan_vien nv ON hd.MaNV = nv.MaNV
            WHERE hd.MaKH = @MaKH
            ORDER BY hd.NgayLap DESC
            OFFSET @Offset ROWS
            FETCH NEXT @Limit ROWS ONLY
        `,
      {
        MaKH: customerId,
        Limit: limit,
        Offset: offset,
      }
    );

    return result.recordset;
  }

  async getBranchInvoices(branchId, fromDate, toDate, limit = 50, offset = 0) {
    const result = await this.execute(
      `
            SELECT 
                hd.MaHD,
                hd.NgayLap,
                hd.TongTien,
                hd.KhuyenMai,
                hd.HinhThucTT,
                kh.HoTen as TenKhachHang,
                kh.SoDT as SDTKhachHang,
                nv.HoTen as TenNhanVien
            FROM Hoa_don hd
            JOIN Khach_hang kh ON hd.MaKH = kh.MaKH
            JOIN Nhan_vien nv ON hd.MaNV = nv.MaNV
            WHERE hd.MaCN = @MaCN
            AND hd.NgayLap BETWEEN @FromDate AND @ToDate
            ORDER BY hd.NgayLap DESC
            OFFSET @Offset ROWS
            FETCH NEXT @Limit ROWS ONLY
        `,
      {
        MaCN: branchId,
        FromDate: fromDate,
        ToDate: toDate,
        Limit: limit,
        Offset: offset,
      }
    );

    return result.recordset;
  }

  async getCustomerPetsServices(customerId) {
    // eslint-disable-next-line no-console
    console.log(
      `[InvoiceRepository.getCustomerPetsServices] Fetching services for customer: ${customerId}`
    );

    // Get examinations today with medicines
    const result = await this.execute(
      `
            -- Get examinations today for customer's pets
            SELECT
                'Khám bệnh' AS LoaiDichVu,
                tc.MaTC,
                tc.Ten as TenThuCung,
                kb.MaKB,
                NULL as MaTP,
                dv.MaDV,
                dv.TenDV,
                ISNULL((SELECT TOP 1 SoTien FROM Gia_dich_vu gd WHERE dv.MaDV = gd.MaDV AND gd.NgayApDung <= CAST(GETDATE() AS DATE) ORDER BY gd.NgayApDung DESC), 0) as GiaDichVu,
                kb.NgayKham as NgayDichVu,
                NULL as MaSP,
                NULL as TenChiTiet,
                NULL as SoLuong,
                NULL as LieuLuong
            FROM Thu_cung tc
            INNER JOIN Kham_benh kb ON tc.MaTC = kb.MaTC 
                AND CAST(kb.NgayKham AS DATE) = CAST(GETDATE() AS DATE)
            INNER JOIN Dich_vu dv ON kb.MaDV = dv.MaDV
            WHERE tc.MaKH = @MaKH
            
            UNION ALL
            
            -- Get medicines prescribed in examinations today
            SELECT
                'Thuốc' AS LoaiDichVu,
                tc.MaTC,
                tc.Ten as TenThuCung,
                kb.MaKB,
                NULL as MaTP,
                NULL as MaDV,
                NULL as TenDV,
                ISNULL((SELECT TOP 1 SoTien FROM Gia_san_pham gsp WHERE sp.MaSP = gsp.MaSP AND gsp.NgayApDung <= CAST(GETDATE() AS DATE) ORDER BY gsp.NgayApDung DESC), 0) as GiaDichVu,
                kb.NgayKham as NgayDichVu,
                sp.MaSP,
                sp.TenSP as TenChiTiet,
                tt.SoLuong,
                NULL as LieuLuong
            FROM Thu_cung tc
            INNER JOIN Kham_benh kb ON tc.MaTC = kb.MaTC 
                AND CAST(kb.NgayKham AS DATE) = CAST(GETDATE() AS DATE)
            INNER JOIN Toa_thuoc tt ON kb.MaKB = tt.MaKB
            INNER JOIN San_pham sp ON tt.MaSP = sp.MaSP
            WHERE tc.MaKH = @MaKH
            
            UNION ALL
            
            -- Get vaccinations for customer's pets TODAY
            SELECT
                'Tiêm phòng' AS LoaiDichVu,
                tc.MaTC,
                tc.Ten as TenThuCung,
                NULL as MaKB,
                tp.MaTP,
                dv.MaDV,
                dv.TenDV,
                ISNULL((SELECT TOP 1 SoTien FROM Gia_dich_vu gd WHERE dv.MaDV = gd.MaDV AND gd.NgayApDung <= CAST(GETDATE() AS DATE) ORDER BY gd.NgayApDung DESC), 0) as GiaDichVu,
                tp.NgayTiem as NgayDichVu,
                NULL as MaSP,
                NULL as TenChiTiet,
                NULL as SoLuong,
                NULL as LieuLuong
            FROM Thu_cung tc
            INNER JOIN Tiem_phong tp ON tc.MaTC = tp.MaTC
            INNER JOIN Dich_vu dv ON tp.MaDV = dv.MaDV
            WHERE tc.MaKH = @MaKH
                AND CAST(tp.NgayTiem AS DATE) <= CAST(GETDATE() AS DATE)
            
            UNION ALL
            
            -- Get vaccine details in vaccinations TODAY
            SELECT
                'Vắc xin' AS LoaiDichVu,
                tc.MaTC,
                tc.Ten as TenThuCung,
                NULL as MaKB,
                tp.MaTP,
                NULL as MaDV,
                NULL as TenDV,
                ISNULL((SELECT TOP 1 SoTien FROM Gia_san_pham gsp WHERE sp.MaSP = gsp.MaSP AND gsp.NgayApDung <= CAST(GETDATE() AS DATE) ORDER BY gsp.NgayApDung DESC), 0) as GiaDichVu,
                tp.NgayTiem as NgayDichVu,
                sp.MaSP,
                sp.TenSP as TenChiTiet,
                NULL as SoLuong,
                cttp.LieuLuong
            FROM Thu_cung tc
            INNER JOIN Tiem_phong tp ON tc.MaTC = tp.MaTC
            INNER JOIN Chi_tiet_tiem_phong cttp ON tp.MaTP = cttp.MaTP
            INNER JOIN San_pham sp ON cttp.MaSP = sp.MaSP
            WHERE tc.MaKH = @MaKH
                AND CAST(tp.NgayTiem AS DATE) <= CAST(GETDATE() AS DATE)
            
            ORDER BY TenThuCung, LoaiDichVu, TenDV, TenChiTiet
        `,
      { MaKH: customerId }
    );

    return result.recordset;
  }

  async getMedicinesForExam(MaKB) {
    const result = await this.execute(
      `
        SELECT
          sp.MaSP,
          sp.TenSP as TenChiTiet,
          ISNULL((SELECT TOP 1 SoTien FROM Gia_san_pham gsp WHERE sp.MaSP = gsp.MaSP AND gsp.NgayApDung <= CAST(GETDATE() AS DATE) ORDER BY gsp.NgayApDung DESC), 0) as SoTien,
          tt.SoLuong
        FROM Toa_thuoc tt
        INNER JOIN San_pham sp ON tt.MaSP = sp.MaSP
        WHERE tt.MaKB = @MaKB
      `,
      { MaKB }
    );

    return result.recordset || [];
  }

  async getVaccinesForVaccination(MaTP) {
    const result = await this.execute(
      `
        SELECT
          sp.MaSP,
          sp.TenSP as TenChiTiet,
          ISNULL((SELECT TOP 1 SoTien FROM Gia_san_pham gsp WHERE sp.MaSP = gsp.MaSP AND gsp.NgayApDung <= CAST(GETDATE() AS DATE) ORDER BY gsp.NgayApDung DESC), 0) as SoTien,
          cttp.LieuLuong
        FROM Chi_tiet_tiem_phong cttp
        INNER JOIN San_pham sp ON cttp.MaSP = sp.MaSP
        WHERE cttp.MaTP = @MaTP
      `,
      { MaTP }
    );

    return result.recordset || [];
  }
}

module.exports = InvoiceRepository;
