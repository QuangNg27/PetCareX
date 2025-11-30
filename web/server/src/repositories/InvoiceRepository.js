const BaseRepository = require('./BaseRepository');

class InvoiceRepository extends BaseRepository {
    async createInvoice(invoiceData) {
        const { MaKH, MaCN, MaNV, NgayLap, HinhThucTT, CT_SanPham, CT_DichVu } = invoiceData;
        
        const result = await this.executeWithTVP('Add_HoaDon', {
            MaKH,
            MaCN,
            MaNV,
            NgayLap,
            HinhThucTT
        }, {
            CT_SanPham: CT_SanPham || [],
            CT_DichVu: CT_DichVu || []
        });

        return { success: true };
    }

    async getInvoiceDetails(invoiceId) {
        const result = await this.execute(`
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
        `, { MaHD: invoiceId });

        const invoice = result.recordset[0];
        if (!invoice) return null;

        // Get product details
        const productResult = await this.execute(`
            SELECT 
                ctsp.MaSP,
                ctsp.SoLuong,
                ctsp.GiaApDung,
                sp.TenSP,
                ctsp.SoLuong * ctsp.GiaApDung as ThanhTien
            FROM Chi_tiet_hoa_don_SP ctsp
            JOIN San_pham sp ON ctsp.MaSP = sp.MaSP
            WHERE ctsp.MaHD = @MaHD
        `, { MaHD: invoiceId });

        // Get service details
        const serviceResult = await this.execute(`
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
        `, { MaHD: invoiceId });

        return {
            ...invoice,
            SanPham: productResult.recordset,
            DichVu: serviceResult.recordset
        };
    }

    async getCustomerInvoices(customerId, limit = 10, offset = 0) {
        const result = await this.execute(`
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
        `, { 
            MaKH: customerId,
            Limit: limit,
            Offset: offset
        });

        return result.recordset;
    }

    async getBranchInvoices(branchId, fromDate, toDate, limit = 50, offset = 0) {
        const result = await this.execute(`
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
        `, { 
            MaCN: branchId,
            FromDate: fromDate,
            ToDate: toDate,
            Limit: limit,
            Offset: offset
        });

        return result.recordset;
    }
}

module.exports = InvoiceRepository;