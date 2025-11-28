IF DB_ID(N'PetCareX') IS NULL
BEGIN
    CREATE DATABASE PetCareX;
END
GO

USE PetCareX;
GO

/* =========================
   Partition function & scheme (dùng cho các bảng theo năm)
   ========================= */
IF NOT EXISTS (SELECT 1 FROM sys.partition_functions WHERE name = 'pf_TheoNam')
BEGIN
    CREATE PARTITION FUNCTION pf_TheoNam (DATE)
    AS RANGE RIGHT FOR VALUES
    ('2023-01-01','2024-01-01','2025-01-01','2026-01-01','2027-01-01');
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.partition_schemes WHERE name = 'ps_TheoNam')
BEGIN
    CREATE PARTITION SCHEME ps_TheoNam
    AS PARTITION pf_TheoNam
    ALL TO ([PRIMARY]);
END
GO

/* =========================
   TABLES
   ========================= */

CREATE TABLE Cap_thanh_vien
(
    MaCap INT IDENTITY(1,1) PRIMARY KEY,
    TenCapDo NVARCHAR(15) NOT NULL 
		CONSTRAINT CK_Cap_Ten CHECK (TenCapDo IN(N'Cơ bản', N'Thân thiết', N'VIP')),
    DKDat DECIMAL(10,2) NOT NULL,
    DKGiu DECIMAL(10,2) NOT NULL,
    TiLeKM DECIMAL(4,2) NOT NULL
        CONSTRAINT CK_Cap_TiLeKM CHECK (TiLeKM BETWEEN 0 AND 1),
    CONSTRAINT UQ_Cap_Ten UNIQUE (TenCapDo),
    CONSTRAINT UQ_Cap_DKDat UNIQUE (DKDat),
    CONSTRAINT UQ_Cap_DKGiu UNIQUE (DKGiu),
    CONSTRAINT CK_Cap_DKGiu_DKDat CHECK (DKGiu < DKDat)
);
GO

CREATE TABLE Khach_hang
(
    MaKH INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    SoDT NVARCHAR(20) NOT NULL CONSTRAINT UQ_KH_SoDT UNIQUE,
    Email NVARCHAR(255) NOT NULL CONSTRAINT UQ_KH_Email UNIQUE,
    CCCD CHAR(12) NOT NULL CONSTRAINT UQ_KH_CCCD UNIQUE,
    GioiTinh NVARCHAR(5) NOT NULL CONSTRAINT CK_KH_GioiTinh CHECK (GioiTinh IN (N'Nam', N'Nữ')),
    NgaySinh DATE NOT NULL,
    DiemLoyalty INT DEFAULT 0 CONSTRAINT CK_KH_Diem CHECK (DiemLoyalty >= 0),
    CapDo INT NULL,
    CONSTRAINT FK_Khach_hang_Cap_thanh_vien FOREIGN KEY (CapDo) REFERENCES Cap_thanh_vien(MaCap)
);
GO

CREATE TABLE Chi_tieu
(
    MaKH INT NOT NULL,
    Nam INT NOT NULL,
    SoTien DECIMAL(10,2) DEFAULT 0 CHECK (SoTien >= 0),
    PRIMARY KEY (MaKH, Nam),
    CONSTRAINT FK_Chi_tieu_Khach_hang FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH) ON DELETE CASCADE
);
GO

CREATE TABLE Dich_vu
(
    MaDV INT IDENTITY(1,1) PRIMARY KEY,
    TenDV NVARCHAR(50) NOT NULL CONSTRAINT UQ_DV_Ten UNIQUE
);
GO

CREATE TABLE Gia_dich_vu
(
    MaDV INT NOT NULL,
    NgayApDung DATE NOT NULL,
    SoTien DECIMAL(10,2) NOT NULL CHECK (SoTien >= 0),
    PRIMARY KEY (MaDV, NgayApDung),
    CONSTRAINT FK_Gia_dv_Dich_vu FOREIGN KEY (MaDV) REFERENCES Dich_vu(MaDV) ON DELETE CASCADE
);
GO

CREATE TABLE Nhan_vien
(
    MaNV INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    GioiTinh NVARCHAR(5) NOT NULL CHECK (GioiTinh IN (N'Nam', N'Nữ')),
    NgaySinh DATE NOT NULL,
    NgayVaoLam DATE NOT NULL,
    ChucVu NVARCHAR(30) NOT NULL CHECK (ChucVu IN (N'Bác sĩ', N'Bán hàng', N'Tiếp tân', N'Quản lý chi nhánh')),
    Luong DECIMAL(10,2) NOT NULL CHECK (Luong >= 0)
);
GO

CREATE TABLE Chi_nhanh
(
    MaCN INT IDENTITY(1,1) PRIMARY KEY,
    TenCN NVARCHAR(100) NOT NULL UNIQUE,
    DiaChi NVARCHAR(255) NOT NULL UNIQUE,
    SoDT NVARCHAR(20) NOT NULL UNIQUE,
    ThoiGianMo TIME NOT NULL,
    ThoiGianDong TIME NOT NULL,
    QuanLy INT NULL,
    CONSTRAINT CK_CN_Time CHECK (ThoiGianMo < ThoiGianDong),
    CONSTRAINT FK_Chi_nhanh_Nhan_vien FOREIGN KEY (QuanLy) REFERENCES Nhan_vien(MaNV)
);

CREATE TABLE Lich_su_nhan_vien
(
    MaNV INT NOT NULL,
    MaCN INT NOT NULL,
    NgayBD DATE NOT NULL,
    NgayKT DATE NULL,
    PRIMARY KEY (MaNV, MaCN, NgayBD),
    CONSTRAINT CK_LSNV_Dates CHECK (NgayKT IS NULL OR NgayBD <= NgayKT),
    CONSTRAINT FK_LSNV_Nhan_vien FOREIGN KEY (MaNV) REFERENCES Nhan_vien(MaNV),
    CONSTRAINT FK_LSNV_Chi_nhanh FOREIGN KEY (MaCN) REFERENCES Chi_nhanh(MaCN)
);
GO

CREATE TABLE Thu_cung
(
    MaTC INT IDENTITY(1,1) PRIMARY KEY,
    MaKH INT NOT NULL,
    Ten NVARCHAR(50) NOT NULL,
    Loai NVARCHAR(10) NOT NULL,
    Giong NVARCHAR(50) NOT NULL,
    GioiTinh NCHAR(3) NOT NULL CHECK (GioiTinh IN (N'Đực', N'Cái')),
    NgaySinh DATE NOT NULL,
    TinhTrangSucKhoe NVARCHAR(100),
    CONSTRAINT FK_Thu_cung_Khach_hang FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH)
);
GO

CREATE TABLE San_pham
(
    MaSP INT IDENTITY(1,1) PRIMARY KEY,
    TenSP NVARCHAR(100) NOT NULL UNIQUE,
    LoaiSP NVARCHAR(10) NOT NULL CHECK (LoaiSP IN (N'Thức ăn', N'Thuốc', N'Phụ kiện', 'Vaccine')),
    LoaiVaccine NVARCHAR(100) NULL,
    NgaySX DATE NOT NULL
);
GO

CREATE TABLE Gia_san_pham
(
    MaSP INT NOT NULL,
    NgayApDung DATE NOT NULL,
    SoTien DECIMAL(10,2) NOT NULL CHECK (SoTien >= 0),
    PRIMARY KEY (MaSP, NgayApDung),
    CONSTRAINT FK_GSP_San_pham FOREIGN KEY (MaSP) REFERENCES San_pham(MaSP)
);
GO

CREATE TABLE Dich_vu_chi_nhanh
(
    MaCN INT NOT NULL,
    MaDV INT NOT NULL,
    PRIMARY KEY (MaCN, MaDV),
    CONSTRAINT FK_DVCN_Dich_vu FOREIGN KEY (MaDV) REFERENCES Dich_vu(MaDV),
    CONSTRAINT FK_DVCN_Chi_nhanh FOREIGN KEY (MaCN) REFERENCES Chi_nhanh(MaCN)
);
GO

CREATE TABLE San_pham_chi_nhanh
(
    MaSP INT NOT NULL,
    MaCN INT NOT NULL,
    SLTonKho INT NOT NULL CHECK (SLTonKho >= 0),
    PRIMARY KEY (MaSP, MaCN),
    CONSTRAINT FK_SPCN_San_pham FOREIGN KEY (MaSP) REFERENCES San_pham(MaSP),
    CONSTRAINT FK_SPCN_Chi_nhanh FOREIGN KEY (MaCN) REFERENCES Chi_nhanh(MaCN)
);
GO

CREATE TABLE Goi_tiem
(
    MaGoi INT IDENTITY(1,1) PRIMARY KEY,
    MaKH INT NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    UuDai DECIMAL(4,2) NOT NULL CHECK (UuDai BETWEEN 0.05 AND 0.15),
    CONSTRAINT FK_Goi_tiem_Khach_hang FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH),
    CONSTRAINT CK_Goi_tiem_Dates CHECK (NgayBatDau < NgayKetThuc)
);
GO

CREATE TABLE Tiem_phong
(
    MaTP INT IDENTITY(1,1) PRIMARY KEY NONCLUSTERED,
    MaCN INT NOT NULL,
    MaDV INT NOT NULL,
    MaTC INT NOT NULL,
    MaNV INT NULL,
    NgayTiem DATE NOT NULL,
    CONSTRAINT FK_TP_Thu_cung FOREIGN KEY (MaTC) REFERENCES Thu_cung(MaTC),
    CONSTRAINT FK_TP_Nhan_vien FOREIGN KEY (MaNV) REFERENCES Nhan_vien(MaNV),
    CONSTRAINT FK_TP_Dich_vu_chi_nhanh FOREIGN KEY (MaCN, MaDV) REFERENCES Dich_vu_chi_nhanh(MaCN, MaDV)
);
GO

CREATE TABLE Chi_tiet_tiem_phong
(
    MaTP INT NOT NULL,
    MaSP INT NOT NULL,
    LieuLuong NVARCHAR(10),
    TrangThai NVARCHAR(15) DEFAULT N'Chưa tiêm' CHECK (TrangThai IN (N'Đã tiêm', N'Chưa tiêm')),
    MaGoi INT NULL,
    PRIMARY KEY (MaTP, MaSP),
    CONSTRAINT FK_CTTP_Tiem_phong FOREIGN KEY (MaTP) REFERENCES Tiem_phong(MaTP) ON DELETE CASCADE,
    CONSTRAINT FK_CTTP_San_pham FOREIGN KEY (MaSP) REFERENCES San_pham(MaSP),
    CONSTRAINT FK_CTTP_Goi_tiem FOREIGN KEY (MaGoi) REFERENCES Goi_tiem(MaGoi)
);
GO

CREATE TABLE Kham_benh
(
    MaKB INT IDENTITY(1,1) PRIMARY KEY NONCLUSTERED,
    MaCN INT NOT NULL,
    MaDV INT NOT NULL,
    MaTC INT NOT NULL,
    MaNV INT NULL,
    NgayKham DATE NOT NULL,
    TrieuChung NVARCHAR(255),
    ChanDoan NVARCHAR(255),
    NgayTaiKham DATE NULL,
    CONSTRAINT CK_KB_NgayTai CHECK (NgayTaiKham IS NULL OR NgayTaiKham > NgayKham),
    CONSTRAINT FK_KB_Thu_cung_MaTC FOREIGN KEY (MaTC) REFERENCES Thu_cung(MaTC),
    CONSTRAINT FK_KB_Nhan_vien_MaNV FOREIGN KEY (MaNV) REFERENCES Nhan_vien(MaNV),
    CONSTRAINT FK_KB_DVCN FOREIGN KEY (MaCN, MaDV) REFERENCES Dich_vu_chi_nhanh(MaCN, MaDV)
);
GO

CREATE TABLE Toa_thuoc
(
    MaKB INT NOT NULL,
    MaSP INT NOT NULL,
    SoLuong INT NOT NULL CHECK (SoLuong > 0),
    PRIMARY KEY (MaKB, MaSP),
    CONSTRAINT FK_Toa_thuoc_Kham_benh FOREIGN KEY (MaKB) REFERENCES Kham_benh(MaKB) ON DELETE CASCADE,
    CONSTRAINT FK_Toa_thuoc_San_pham FOREIGN KEY (MaSP) REFERENCES San_pham(MaSP)
);
GO

CREATE TABLE Hoa_don
(
    MaHD INT IDENTITY(1,1) PRIMARY KEY NONCLUSTERED,
    MaKH INT NOT NULL,
    MaCN INT NOT NULL,
    MaNV INT NOT NULL,
    NgayLap DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    TongTien DECIMAL(10,2) DEFAULT 0 NOT NULL,
    KhuyenMai DECIMAL(4,2) DEFAULT 0,
    HinhThucTT NVARCHAR(20) NULL CHECK (HinhThucTT IS NULL OR HinhThucTT IN (N'Chuyển khoản', N'Tiền mặt')),
    CONSTRAINT FK_HD_Khach_hang FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH),
    CONSTRAINT FK_HD_Chi_nhanh FOREIGN KEY (MaCN) REFERENCES Chi_nhanh(MaCN),
    CONSTRAINT FK_HD_Nhan_vien FOREIGN KEY (MaNV) REFERENCES Nhan_vien(MaNV)
);
GO

CREATE TABLE Chi_tiet_hoa_don_SP
(
    MaHD INT NOT NULL,
    MaSP INT NOT NULL,
    SoLuong INT NOT NULL,
    GiaApDung DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (MaHD, MaSP),
    CONSTRAINT FK_CTHD_SP_Hoa_don FOREIGN KEY (MaHD) REFERENCES Hoa_don(MaHD) ON DELETE CASCADE,
    CONSTRAINT FK_CTHD_SP_San_pham FOREIGN KEY (MaSP) REFERENCES San_pham(MaSP)
);
GO

CREATE TABLE Chi_tiet_hoa_don_DV
(
    MaHD INT NOT NULL,
    MaCN INT NOT NULL,
    MaDV INT NOT NULL,
    MaTC INT NOT NULL,
    MaKB INT NULL,
    MaTP INT NULL,
    GiaApDung DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (MaHD, MaDV, MaCN, MaTC),
    CONSTRAINT FK_CTHD_DV_Hoa_don FOREIGN KEY (MaHD) REFERENCES Hoa_don(MaHD) ON DELETE CASCADE,
    CONSTRAINT FK_CTHD_DV_Dich_vu_chi_nhanh FOREIGN KEY (MaCN, MaDV) REFERENCES Dich_vu_chi_nhanh(MaCN, MaDV),
    CONSTRAINT FK_CTHD_DV_Thu_cung FOREIGN KEY (MaTC) REFERENCES Thu_cung(MaTC),
    CONSTRAINT FK_CTHD_DV_Kham_benh FOREIGN KEY (MaKB) REFERENCES Kham_benh(MaKB),
    CONSTRAINT FK_CTHD_DV_Tiem_phong FOREIGN KEY (MaTP) REFERENCES Tiem_phong(MaTP)
);
GO

CREATE TABLE Danh_gia
(
    MaDG INT IDENTITY(1,1) PRIMARY KEY,
    MaKH INT NOT NULL,
    MaCN INT NOT NULL,
    DiemChatLuong INT CHECK (DiemChatLuong BETWEEN 1 AND 5),
    ThaiDoNV INT CHECK (ThaiDoNV BETWEEN 1 AND 5),
    MucDoHaiLong INT CHECK (MucDoHaiLong BETWEEN 1 AND 5),
    BinhLuan NVARCHAR(255),
    NgayDG DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    CONSTRAINT FK_Danh_gia_Khach_hang FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH),
    CONSTRAINT FK_Danh_gia_Chi_nhanh FOREIGN KEY (MaCN) REFERENCES Chi_nhanh(MaCN)
);
GO

CREATE TABLE Tai_khoan
(
    MaTK INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    MatKhau VARCHAR(100) NOT NULL,
    MaKH INT NULL,
    MaNV INT NULL,
    VaiTro NVARCHAR(30) CHECK (VaiTro IN (N'Khách hàng', N'Bác sĩ', N'Bán hàng', N'Tiếp tân', N'Quản lý chi nhánh', N'Quản lý công ty')),
    CONSTRAINT FK_TK_Khach_hang FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH),
    CONSTRAINT FK_TK_Nhan_vien FOREIGN KEY (MaNV) REFERENCES Nhan_vien(MaNV),
    CONSTRAINT CK_TaiKhoan_Loai CHECK (
        (MaKH IS NOT NULL AND MaNV IS NULL AND VaiTro = N'Khách hàng')
        OR (MaNV IS NOT NULL AND MaKH IS NULL AND VaiTro IN (N'Bác sĩ', N'Bán hàng', N'Tiếp tân', N'Quản lý chi nhánh'))
        OR (MaKH IS NULL AND MaNV IS NULL AND VaiTro = N'Quản lý công ty')
    )
);
GO

/* =========================
   UTILS: TYPES, INDEXES, PROCEDURES (core)
   ========================= */

/* TVP types */
CREATE TYPE TVP_SanPham AS TABLE
(
    MaSP INT NOT NULL,
    SoLuong INT NOT NULL CHECK (SoLuong > 0),
    GiaApDung DECIMAL(10,2) NOT NULL
);
GO

CREATE TYPE TVP_DichVu AS TABLE
(
	MaCN INT NOT NULL,
    MaDV INT NOT NULL,
    MaTC INT NOT NULL,
    MaKB INT NULL,
    MaTP INT NULL,
    GiaApDung DECIMAL(10,2) NOT NULL
);
GO

/* Indexes */
CREATE INDEX IX_TaiKhoan_TenDangNhap ON Tai_khoan(TenDangNhap);
CREATE INDEX IX_KhachHang_CapDo ON Khach_hang(CapDo);
CREATE INDEX IX_ThuCung_MaKH ON Thu_cung(MaKH);
CREATE INDEX IX_KhamBenh_MaTC ON Kham_benh(MaTC, NgayKham DESC);
CREATE INDEX IX_TiemPhong_MaTC_NgayTiem ON Tiem_phong(MaTC, NgayTiem DESC);
CREATE INDEX IX_GoiTiem_MaKH ON Goi_tiem(MaKH);
CREATE INDEX IX_HoaDon_MaKH ON Hoa_don(MaKH);
CREATE INDEX IX_HoaDon_MaCN ON Hoa_don(MaCN);
GO

CREATE OR ALTER PROCEDURE Update_HangKhachHang
    @MaKH INT,
    @Ngay DATE
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @Nam INT = YEAR(@Ngay);
        DECLARE @TongNam DECIMAL(10,2);

        SELECT @TongNam = SoTien FROM Chi_tieu WHERE MaKH = @MaKH AND Nam = @Nam;
        IF @TongNam IS NULL SET @TongNam = 0;

        DECLARE @CapHienTai INT = (SELECT CapDo FROM Khach_hang WHERE MaKH = @MaKH);

        DECLARE @CapMoi INT =
        (
            SELECT TOP 1 MaCap
            FROM Cap_thanh_vien
            WHERE DKDat IS NOT NULL AND @TongNam >= DKDat
            ORDER BY DKDat DESC
        );

        IF @CapMoi IS NULL SET @CapMoi = @CapHienTai;

        IF @CapMoi IS NOT NULL AND @CapMoi > ISNULL(@CapHienTai,0)
        BEGIN
            UPDATE Khach_hang SET CapDo = @CapMoi WHERE MaKH = @MaKH;
        END
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE Update_GiaSP
    @MaSP INT,
    @SoTien DECIMAL(10,2),
	@NgayApDung DATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Gia_san_pham WHERE MaSP = @MaSP AND NgayApDung = @NgayApDung)
        UPDATE Gia_san_pham SET SoTien = @SoTien WHERE MaSP = @MaSP AND NgayApDung = @NgayApDung;
    ELSE
        INSERT INTO Gia_san_pham (MaSP, NgayApDung, SoTien) VALUES (@MaSP, @NgayApDung, @SoTien);
END;
GO

CREATE OR ALTER PROCEDURE Update_GiaDV
    @MaDV INT,
    @SoTien DECIMAL(10,2),
	@NgayApDung DATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Gia_dich_vu WHERE MaDV = @MaDV AND NgayApDung = @NgayApDung)
        UPDATE Gia_dich_vu SET SoTien = @SoTien WHERE MaDV = @MaDV AND NgayApDung = @NgayApDung;
    ELSE
        INSERT INTO Gia_dich_vu (MaDV, NgayApDung, SoTien) VALUES (@MaDV, @NgayApDung, @SoTien);
END;
GO

CREATE OR ALTER PROCEDURE Create_TaiKhoan 
    @TenDangNhap VARCHAR(50),
    @MatKhau VARCHAR(100),
    @MaKH INT = NULL,
    @MaNV INT = NULL,
    @VaiTro NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;

    IF (@MaKH IS NOT NULL AND EXISTS(
            SELECT 1 FROM Tai_khoan WHERE MaKH = @MaKH
        ))
        THROW 60002, N'Khách hàng này đã có tài khoản.', 1;

    IF (@MaNV IS NOT NULL AND EXISTS(
            SELECT 1 FROM Tai_khoan WHERE MaNV = @MaNV
        ))
        THROW 60003, N'Nhân viên này đã có tài khoản.', 1;

    INSERT INTO Tai_khoan(TenDangNhap, MatKhau, MaKH, MaNV, VaiTro)
    VALUES (@TenDangNhap, @MatKhau, @MaKH, @MaNV, @VaiTro);
END;
GO

CREATE OR ALTER PROCEDURE PhanCong_NhanVienChiNhanh
    @MaNV INT,
    @MaCN INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        -- Kiểm tra nhân viên tồn tại
        IF NOT EXISTS (SELECT 1 FROM Nhan_vien WHERE MaNV = @MaNV)
            THROW 60000, N'Nhân viên không tồn tại.', 1;

        -- Kiểm tra chi nhánh tồn tại
        IF NOT EXISTS (SELECT 1 FROM Chi_nhanh WHERE MaCN = @MaCN)
            THROW 60001, N'Chi nhánh không tồn tại.', 1;

        -- Lấy ngày hiện tại
        DECLARE @Today DATE = CAST(GETDATE() AS DATE);

        -- Ngày bắt đầu thực tế của chi nhánh mới = Hôm nay + 1
        DECLARE @NgayBD DATE = DATEADD(day, 1, @Today);

        -- Đóng lịch của chi nhánh cũ nếu đang active
        UPDATE Lich_su_nhan_vien
        SET NgayKT = @Today
        WHERE MaNV = @MaNV AND NgayKT IS NULL;

        -- Kiểm tra chồng lắp (DATE-based logic)
        IF EXISTS (
            SELECT 1
            FROM Lich_su_nhan_vien ls
            WHERE ls.MaNV = @MaNV
              AND NOT (
                    @NgayBD >= ISNULL(ls.NgayKT, '9999-12-31')
                )
        )
            THROW 60005, N'Khoảng thời gian bị chồng lắp.', 1;

        -- Thêm lịch mới
        INSERT INTO Lich_su_nhan_vien (MaNV, MaCN, NgayBD, NgayKT)
        VALUES (@MaNV, @MaCN, @NgayBD, NULL);

        -- Nếu nhân viên là quản lý chi nhánh -> cập nhật chi nhánh
        IF EXISTS (SELECT 1 FROM Nhan_vien WHERE MaNV = @MaNV AND ChucVu = N'Quản lý chi nhánh')
        BEGIN
            UPDATE Chi_nhanh
            SET QuanLy = @MaNV
            WHERE MaCN = @MaCN;
        END

        COMMIT;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK;
        THROW;
    END CATCH
END;
GO

CREATE OR ALTER PROCEDURE Add_HoaDon
    @MaKH INT,
    @MaCN INT,
    @MaNV INT,
    @NgayLap DATE,
    @HinhThucTT NVARCHAR(20),
    @CT_SanPham TVP_SanPham READONLY,
    @CT_DichVu TVP_DichVu READONLY
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRAN;

		--1. LẤY CẤP ĐỘ & % KHUYẾN MÃI
        DECLARE @MaHD INT;
        DECLARE @CapDo INT = (SELECT CapDo FROM Khach_hang WHERE MaKH = @MaKH);
        DECLARE @TiLeKM_Cap DECIMAL(4,2) = (SELECT TiLeKM FROM Cap_thanh_vien WHERE MaCap = @CapDo);
        IF @TiLeKM_Cap IS NULL SET @TiLeKM_Cap = 0;

		--2. TẠO HÓA ĐƠN
        INSERT INTO Hoa_don (MaKH, MaCN, MaNV, NgayLap, KhuyenMai, HinhThucTT)
        VALUES (@MaKH, @MaCN, @MaNV, @NgayLap, @TiLeKM_Cap, @HinhThucTT);

        SET @MaHD = SCOPE_IDENTITY();

		--3. KIỂM TRA TỒN KHO
		IF EXISTS
        (
            SELECT 1
            FROM @CT_SanPham sp
            JOIN San_pham_chi_nhanh spcn
                ON spcn.MaSP = sp.MaSP AND spcn.MaCN = @MaCN
            WHERE sp.SoLuong > spcn.SLTonKho
        )
        BEGIN
            THROW 60020, N'Tồn kho không đủ cho sản phẩm.', 1;
        END

		--4. INSERT CHI TIẾT SP + GIẢM TỒN KHO
        INSERT INTO Chi_tiet_hoa_don_SP (MaHD, MaSP, SoLuong, GiaApDung)
        SELECT @MaHD, sp.MaSP, sp.SoLuong, sp.GiaApDung
        FROM @CT_SanPham sp;

        UPDATE spcn
        SET spcn.SLTonKho = spcn.SLTonKho - src.SoLuong
        FROM San_pham_chi_nhanh spcn
        JOIN @CT_SanPham src ON src.MaSP = spcn.MaSP
        WHERE spcn.MaCN = @MaCN;

        --5. INSERT CHI TIẾT DỊCH VỤ
        INSERT INTO Chi_tiet_hoa_don_DV (MaHD, MaCN, MaDV, MaTC, MaKB, MaTP, GiaApDung)
        SELECT @MaHD, dv.MaCN, dv.MaDV, dv.MaTC, dv.MaKB, dv.MaTP, dv.GiaApDung
        FROM @CT_DichVu dv;

        --6. TÍNH TỔNG TIỀN
        DECLARE @TongSP DECIMAL(10,2) = (
            SELECT ISNULL(SUM(SoLuong * GiaApDung),0) FROM Chi_tiet_hoa_don_SP WHERE MaHD = @MaHD
        );
        DECLARE @TongDV DECIMAL(10,2) = (
            SELECT ISNULL(SUM(GiaApDung),0) FROM Chi_tiet_hoa_don_DV WHERE MaHD = @MaHD
        );

        DECLARE @TongTien DECIMAL(10,2) = (@TongSP + @TongDV) * (1 - @TiLeKM_Cap);

        UPDATE Hoa_don SET TongTien = @TongTien WHERE MaHD = @MaHD;

        --7. CỘNG ĐIỂM LOYALTY
        DECLARE @DiemLoyalty INT = FLOOR(@TongTien / 50000.0);
        UPDATE Khach_hang SET DiemLoyalty = ISNULL(DiemLoyalty,0) + @DiemLoyalty WHERE MaKH = @MaKH;

		--8. CẬP NHẬT CHI TIÊU
        DECLARE @Nam INT = YEAR(@NgayLap);
        IF EXISTS (SELECT 1 FROM Chi_tieu WHERE MaKH = @MaKH AND Nam = @Nam)
            UPDATE Chi_tieu SET SoTien = SoTien + @TongTien WHERE MaKH = @MaKH AND Nam = @Nam;
        ELSE
            INSERT INTO Chi_tieu (MaKH, Nam, SoTien) VALUES (@MaKH, @Nam, @TongTien);

		--9. UPDATE HẠNG KHÁCH HÀNG
        EXEC Update_HangKhachHang @MaKH, @NgayLap;

        COMMIT;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 
			ROLLBACK;
        THROW;
    END CATCH
END;
GO

/* =========================
   TRIGGERS
   ========================= */
CREATE OR ALTER TRIGGER trg_Check_NgaySinh_KhachHang
ON Khach_hang
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE NgaySinh > CAST(GETDATE() AS DATE))
    BEGIN
        RAISERROR(N'Khách hàng: Ngày sinh không được lớn hơn ngày hiện tại.',16,1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

CREATE OR ALTER TRIGGER trg_Check_Tuoi_NgayVaoLam_NhanVien
ON Nhan_vien
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE DATEDIFF(YEAR, NgaySinh, GETDATE()) < 18)
    BEGIN
        RAISERROR(N'Nhân viên phải >= 18 tuổi.',16,1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM inserted WHERE NgayVaoLam > CAST(GETDATE() AS DATE))
    BEGIN
        RAISERROR(N'Ngày vào làm không được lớn hơn ngày hiện tại.',16,1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

CREATE OR ALTER TRIGGER trg_Check_NgaySinh_ThuCung
ON Thu_cung
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE NgaySinh > CAST(GETDATE() AS DATE))
    BEGIN
        RAISERROR(N'Thú cưng: Ngày sinh không được lớn hơn ngày hiện tại.',16,1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

CREATE OR ALTER TRIGGER trg_Check_NgaySX_SanPham
ON San_pham
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE NgaySX > CAST(GETDATE() AS DATE))
    BEGIN
        RAISERROR(N'Ngày sản xuất không được lớn hơn ngày hiện tại.',16,1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

CREATE OR ALTER TRIGGER trg_Check_TiLeKM_Cap_thanh_vien
ON Cap_thanh_vien
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CoBan DECIMAL(4,2), @ThanThiet DECIMAL(4,2), @VIP DECIMAL(4,2);

    SELECT @CoBan = TiLeKM FROM Cap_thanh_vien WHERE TenCapDo = N'Cơ bản';
    SELECT @ThanThiet = TiLeKM FROM Cap_thanh_vien WHERE TenCapDo = N'Thân thiết';
    SELECT @VIP = TiLeKM FROM Cap_thanh_vien WHERE TenCapDo = N'VIP';

    IF (@CoBan IS NOT NULL AND @ThanThiet IS NOT NULL AND @VIP IS NOT NULL)
    BEGIN
        IF NOT (@CoBan < @ThanThiet AND @ThanThiet < @VIP)
        BEGIN
            RAISERROR(N'Tỉ lệ khuyến mãi phải thỏa: Cơ bản < Thân thiết < VIP.',16,1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
    END
END;
GO

CREATE OR ALTER TRIGGER trg_Check_KhamBenh
ON Kham_benh
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM inserted WHERE MaNV IS NOT NULL) RETURN;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN Nhan_vien nv ON nv.MaNV = i.MaNV
        WHERE i.MaNV IS NOT NULL AND nv.ChucVu <> N'Bác sĩ'
    )
    BEGIN
        RAISERROR(N'Nhân viên không phải Bác sĩ.',16,1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM inserted i
        LEFT JOIN Lich_su_nhan_vien ls
            ON ls.MaNV = i.MaNV
            AND ls.MaCN = i.MaCN
            AND ls.NgayBD <= i.NgayKham
            AND (ls.NgayKT IS NULL OR ls.NgayKT >= i.NgayKham)
        WHERE i.MaNV IS NOT NULL AND ls.MaNV IS NULL
    )
    BEGIN
        RAISERROR(N'Bác sĩ không làm việc cho chi nhánh vào ngày khám.',16,1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

CREATE OR ALTER TRIGGER trg_Check_TiemPhong
ON Tiem_phong
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM inserted WHERE MaNV IS NOT NULL) RETURN;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN Nhan_vien nv ON nv.MaNV = i.MaNV
        WHERE nv.ChucVu <> N'Bác sĩ'
    )
    BEGIN
        RAISERROR(N'Nhân viên không phải Bác sĩ.',16,1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM inserted i
        LEFT JOIN Lich_su_nhan_vien ls
            ON ls.MaNV = i.MaNV
            AND ls.MaCN = i.MaCN
            AND ls.NgayBD <= i.NgayTiem
            AND (ls.NgayKT IS NULL OR ls.NgayKT >= i.NgayTiem)
        WHERE ls.MaNV IS NULL
    )
    BEGIN
        RAISERROR(N'Bác sĩ không làm việc cho chi nhánh vào ngày tiêm.',16,1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

CREATE OR ALTER TRIGGER trg_Check_DichVuChiNhanh
ON Dich_vu_chi_nhanh
AFTER INSERT, DELETE, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Temp TABLE (MaCN INT PRIMARY KEY);

    INSERT INTO @Temp (MaCN)
    SELECT DISTINCT MaCN FROM inserted
    UNION
    SELECT DISTINCT MaCN FROM deleted;

    IF EXISTS
    (
        SELECT 1
        FROM @Temp t
        WHERE NOT EXISTS (SELECT 1 FROM Dich_vu_chi_nhanh d WHERE d.MaCN = t.MaCN)
    )
    BEGIN
        RAISERROR(N'Mỗi chi nhánh phải có ít nhất 1 dịch vụ.',16,1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

/* =========================
   CREATE CLUSTERED INDEXES ON PARTITION SCHEME
   (PK already nonclustered)
   ========================= */

/* Hoa_don clustered on NgayLap */
IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('Hoa_don') AND name = 'ix_HD_NgayLap')
    DROP INDEX ix_HD_NgayLap ON Hoa_don;
GO
CREATE CLUSTERED INDEX ix_HD_NgayLap ON Hoa_don(NgayLap) ON ps_TheoNam(NgayLap);
GO

/* Kham_benh clustered on NgayKham */
IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('Kham_benh') AND name = 'ix_KB_NgayKham')
    DROP INDEX ix_KB_NgayKham ON Kham_benh;
GO
CREATE CLUSTERED INDEX ix_KB_NgayKham ON Kham_benh(NgayKham) ON ps_TheoNam(NgayKham);
GO

/* Tiem_phong clustered on NgayTiem */
IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('Tiem_phong') AND name = 'ix_TP_NgayTiem')
    DROP INDEX ix_TP_NgayTiem ON Tiem_phong;
GO
CREATE CLUSTERED INDEX ix_TP_NgayTiem ON Tiem_phong(NgayTiem) ON ps_TheoNam(NgayTiem);
GO