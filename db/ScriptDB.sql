CREATE DATABASE PetCareX
GO
USE PetCareX
GO

CREATE TABLE Cap_thanh_vien
(
	MaCap 		INT IDENTITY(1,1) PRIMARY KEY,
	TenCapDo 	NVARCHAR(15) CHECK (TenCapDo IN (N'Cơ bản', N'Thân thiết', 'VIP')) NOT NULL,
	DKDat 		DECIMAL(10,2),
	DKGiu 		DECIMAL(10,2),
    TiLeKM      DECIMAL(4,2)
)

CREATE TABLE Khach_hang
(
	MaKH 		INT IDENTITY(1,1) PRIMARY KEY,
    HoTen 		NVARCHAR(100) NOT NULL,
    SoDT 		NVARCHAR(20) UNIQUE NOT NULL,
    Email 		NVARCHAR(255) UNIQUE NOT NULL,
   	CCCD 		CHAR(12) UNIQUE NOT NULL,
    GioiTinh 	NVARCHAR(5) CHECK (GioiTinh IN (N'Nam', N'Nữ')) NOT NULL,
    NgaySinh 	DATE NOT NULL CHECK (NgaySinh < CAST(GETDATE() AS DATE)),
    DiemLoyalty INT DEFAULT 0,
    CapDo 		INT 

	CONSTRAINT FK_Khach_hang_Cap_thanh_vien
	FOREIGN KEY REFERENCES Cap_thanh_vien(MaCap)
)

CREATE TABLE Chi_tieu
(
	MaKH 	INT NOT NULL,
	Nam 	INT NOT NULL,
	SoTien 	DECIMAL(10,2),
	PRIMARY KEY (MaKH, Nam),

	CONSTRAINT FK_Chi_tieu_Khach_hang
    FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH)
)

CREATE TABLE Thu_cung
(
	MaTC 		INT IDENTITY(1,1) PRIMARY KEY,
	MaKH 		INT NOT NULL,
	Ten 		NVARCHAR(50) NOT NULL,
	Loai 		NVARCHAR(10) NOT NULL,
	Giong 		NVARCHAR(50) NOT NULL,
	GioiTinh 	NCHAR(3) CHECK(GioiTinh IN (N'Đực', N'Cái')) NOT NULL,
	NgaySinh 	DATE NOT NULL CHECK(NgaySinh <= CAST(GETDATE() AS DATE)),
	TinhTrangSucKhoe 	NVARCHAR(100),

	CONSTRAINT FK_Thu_cung_Khach_hang
	FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH)
)

CREATE TABLE Nhan_vien
(
	MaNV 		INT IDENTITY(1,1) PRIMARY KEY,
	HoTen 		NVARCHAR(100) NOT NULL,
	GioiTinh 	NVARCHAR(5) CHECK(GioiTinh IN (N'Nam', N'Nữ')) NOT NULL,
	NgaySinh 	DATE NOT NULL CHECK(DATEDIFF(YEAR, NgaySinh, GETDATE()) >= 18),
	NgayVaoLam 	DATE NOT NULL CHECK(NgayVaoLam <= GETDATE()),
	ChucVu 		NVARCHAR(30) CHECK(ChucVu IN (N'Bác sĩ', N'Bán hàng', N'Tiếp tân', N'Quản lý chi nhánh')) NOT NULL,
	Luong 		DECIMAL(10,2)
)

CREATE TABLE Chi_nhanh
(
	MaCN 			INT IDENTITY(1,1) PRIMARY KEY,
    TenCN 			NVARCHAR(100) UNIQUE NOT NULL,
    DiaChi 			NVARCHAR(255),
    SoDT 			NVARCHAR(20),
    ThoiGianMo 		TIME NOT NULL,
    ThoiGianDong 	TIME NOT NULL,
   	QuanLy 			INT NULL,

   	CHECK (ThoiGianMo < ThoiGianDong),
    CONSTRAINT FK_Chi_nhanh_Nhan_vien
	FOREIGN KEY (QuanLy) REFERENCES Nhan_vien(MaNV)
)

CREATE TABLE Danh_gia
(
	MaDG 			INT IDENTITY(1,1) PRIMARY KEY,
    MaKH 			INT NOT NULL,
    MaCN 			INT NOT NULL,
    DiemChatLuong 	INT CHECK(DiemChatLuong BETWEEN 1 AND 5),
    ThaiDoNV 		INT CHECK(ThaiDoNV BETWEEN 1 AND 5),
    MucDoHaiLong	INT CHECK(MucDoHaiLong BETWEEN 1 AND 5),
    BinhLuan 		NVARCHAR(255),
    NgayDG 			DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),

    CONSTRAINT FK_Danh_gia_Khach_hang
    FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH),
    CONSTRAINT FK_Danh_gia_Chi_nhanh
    FOREIGN KEY (MaCN) REFERENCES Chi_nhanh(MaCN)
)

CREATE TABLE Dich_vu
(
	MaDV 	INT IDENTITY(1,1) PRIMARY KEY,
    TenDV 	NVARCHAR(50) NOT NULL
)

CREATE TABLE Gia_dich_vu
(
	MaDV 		INT NOT NULL,
    NgayApDung 	DATE NOT NULL,
    SoTien 		DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (MaDV, NgayApDung),

    CONSTRAINT FK_Gia_dich_vu_Dich_vu
    FOREIGN KEY (MaDV) REFERENCES Dich_vu(MaDV)
)

CREATE TABLE Dich_vu_chi_nhanh
(
	MaCN 	INT NOT NULL,
	MaDV 	INT NOT NULL,
    PRIMARY KEY (MaCN, MaDV),

    CONSTRAINT FK_DVCN_Dich_vu
    FOREIGN KEY (MaDV) REFERENCES Dich_vu(MaDV),
    CONSTRAINT FK_DVCN_Chi_nhanh
    FOREIGN KEY (MaCN) REFERENCES Chi_nhanh(MaCN)
)

CREATE TABLE Kham_benh
(
	MaKB 			INT IDENTITY(1,1) PRIMARY KEY,
	MaCN 			INT NOT NULL,
	MaDV 			INT NOT NULL,
	MaTC 			INT NOT NULL,
	MaNV 			INT NOT NULL,
	NgayKham 		DATE NOT NULL,
	TrieuChung 		NVARCHAR(255),
	ChanDoan 		NVARCHAR(255),
	NgayTaiKham 	DATE,
	
	CONSTRAINT FK_KB_Thu_cung_MaTC
	FOREIGN KEY (MaTC) REFERENCES Thu_cung(MaTC),
	CONSTRAINT FK_KB_Nhan_vien_MaNV
	FOREIGN KEY (MaNV) REFERENCES Nhan_vien(MaNV),
	CONSTRAINT FK_KB_DVCN
	FOREIGN KEY (MaCN, MaDV) REFERENCES Dich_vu_chi_nhanh(MaCN, MaDV)
)

CREATE TABLE San_pham
(
	MaSP 		INT IDENTITY(1,1) PRIMARY KEY,
	TenSP 		NVARCHAR(100) NOT NULL,
	LoaiSP 		NVARCHAR(10) CHECK(LoaiSP IN (N'Thức ăn', N'Thuốc', N'Phụ kiện', 'Vaccine')),
    LoaiVaccine NVARCHAR(100) NULL,
	NgaySX 		DATE
)

CREATE TABLE Toa_thuoc
(
	MaKB 		INT NOT NULL,
	MaSP 		INT NOT NULL,
	SoLuong 	INT NOT NULL CHECK(SoLuong > 0),
	PRIMARY KEY (MaKB, MaSP),
	
	CONSTRAINT FK_Toa_thuoc_Kham_benh
	FOREIGN KEY (MaKB) REFERENCES Kham_benh(MaKB) ON DELETE CASCADE,
	CONSTRAINT FK_Toa_thuoc_San_pham
	FOREIGN KEY (MaSP) REFERENCES San_pham(MaSP)
)

CREATE TABLE Goi_tiem
(
	MaGoi 			INT IDENTITY(1,1) PRIMARY KEY,
	MaKH 			INT NOT NULL,
	NgayBatDau 		DATE,
	NgayKetThuc 	DATE,
	UuDai 			DECIMAL(4, 2),
	
	CONSTRAINT FK_Goi_tiem_Khach_hang
	FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH)
)

CREATE TABLE Tiem_phong
(
	MaTP 		INT IDENTITY(1,1) PRIMARY KEY,
    MaCN 		INT NOT NULL,
    MaDV		INT NOT NULL,
    MaTC 		INT NOT NULL,
    MaNV 		INT NOT NULL,
    MaSP 		INT NOT NULL,
    MaGoi 		INT NULL,
    NgayTiem 	DATE NOT NULL,
    LieuLuong 	NVARCHAR(10),
    TrangThai 	NVARCHAR(15) CHECK(TrangThai IN (N'Đã tiêm', N'Chưa tiêm')),

    CONSTRAINT FK_TP_Thu_cung
    FOREIGN KEY (MaTC) REFERENCES Thu_cung(MaTC),

    CONSTRAINT FK_TP_Nhan_vien
    FOREIGN KEY (MaNV) REFERENCES Nhan_vien(MaNV),

	CONSTRAINT FK_TP_San_pham
	FOREIGN KEY (MaSP) REFERENCES San_pham(MaSP),
	
    CONSTRAINT FK_TP_Goi_tiem
    FOREIGN KEY (MaGoi) REFERENCES Goi_tiem(MaGoi),

 	CONSTRAINT FK_TP_Dich_vu_chi_nhanh
	FOREIGN KEY (MaCN, MaDV) REFERENCES Dich_vu_chi_nhanh(MaCN, MaDV)
)

CREATE TABLE Hoa_don
(
	MaHD 			INT IDENTITY(1,1) PRIMARY KEY,
	MaKH 			INT NOT NULL,
	MaCN 			INT NOT NULL,
	MaNV 			INT NOT NULL,
	NgayLap 		DATE NOT NULL DEFAULT GETDATE(),
	TongTien 		DECIMAL(10,2) DEFAULT 0 NOT NULL,
	KhuyenMai 		DECIMAL(4,2) DEFAULT 0,
	HinhThucTT 		NVARCHAR(20) CHECK(HinhThucTT IN (N'Chuyển khoản', N'Tiền mặt')) ,
	
	CONSTRAINT FK_HD_Khach_hang
	    FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH),
	CONSTRAINT FK_HD_Chi_nhanh
	    FOREIGN KEY (MaCN) REFERENCES Chi_nhanh(MaCN),
	CONSTRAINT FK_HD_Nhan_vien
	    FOREIGN KEY (MaNV) REFERENCES Nhan_vien(MaNV)
)

CREATE TABLE Chi_tiet_hoa_don_DV
(
	MaHD INT NOT NULL,
	MaCN INT NOT NULL,
	MaDV INT NOT NULL,
	MaTC INT NOT NULL,
    MaKB INT NULL,
    MaTP INT NULL,

	PRIMARY KEY (MaHD, MaDV, MaCN, MaTC),
	
	CONSTRAINT FK_CTHD_DV_Hoa_don
	FOREIGN KEY (MaHD) REFERENCES Hoa_don(MaHD) ON DELETE CASCADE,
	CONSTRAINT FK_CTHD_DV_Dich_vu_chi_nhanh
	FOREIGN KEY (MaCN, MaDV) REFERENCES Dich_vu_chi_nhanh(MaCN, MaDV),
	CONSTRAINT FK_CTHD_DV_Thu_cung
	FOREIGN KEY (MaTC) REFERENCES Thu_cung(MaTC),
    CONSTRAINT FK_CTHD_DV_Kham_benh
    FOREIGN KEY (MaKB) REFERENCES Kham_benh(MaKB),
    CONSTRAINT FK_CTHD_DV_Tiem_phong
    FOREIGN KEY (MaTP) REFERENCES Tiem_phong(MaTP)
)

CREATE TABLE Gia_san_pham
(
	MaSP		INT NOT NULL,
	NgayApDung	DATE NOT NULL,
	SoTien		DECIMAL(10,2) NOT NULL,
	PRIMARY KEY (MaSP, NgayApDung),
	
	CONSTRAINT FK_GSP_San_pham
	FOREIGN KEY (MaSP) REFERENCES San_pham(MaSP)
)

CREATE TABLE San_pham_chi_nhanh
(
	MaSP		INT NOT NULL,
	MaCN		INT NOT NULL,
	SLTonKho	INT NOT NULL CHECK(SLTonKho >= 0),
	PRIMARY KEY (MaSP, MaCN),
	
	CONSTRAINT FK_SPCN_San_pham
	FOREIGN KEY (MaSP) REFERENCES San_pham(MaSP),
	CONSTRAINT FK_SPCN_Chi_nhanh
	FOREIGN KEY (MaCN) REFERENCES Chi_nhanh(MaCN)
)

CREATE TABLE Chi_tiet_hoa_don_SP
(
	MaHD	INT NOT NULL,
	MaSP	INT NOT NULL,
	SoLuong INT NOT NULL,
	PRIMARY KEY (MaHD, MaSP),
	
	CONSTRAINT FK_CTHD_SP_Hoa_don
	FOREIGN KEY (MaHD) REFERENCES Hoa_don(MaHD) ON DELETE CASCADE,
	CONSTRAINT FK_CTHD_SP_San_pham
	FOREIGN KEY (MaSP) REFERENCES San_pham(MaSP)
)

CREATE TABLE Lich_su_nhan_vien
(
	MaNV 	INT NOT NULL,
	MaCN 	INT NOT NULL,
	NgayBD 	DATE NOT NULL,
	NgayKT 	DATE NULL,
	PRIMARY KEY (MaNV, MaCN, NgayBD),
	
	CHECK (NgayBD <= NgayKT ),
	CONSTRAINT FK_LSNV_Nhan_vien
	FOREIGN KEY (MaNV) REFERENCES Nhan_vien(MaNV),
	CONSTRAINT FK_LSNV_Chi_nhanh
	FOREIGN KEY (MaCN) REFERENCES Chi_nhanh(MaCN)
)

CREATE TABLE Tai_khoan
(
	MaTK			INT IDENTITY(1,1) PRIMARY KEY,
	TenDangNhap		VARCHAR(50) NOT NULL UNIQUE,
	MatKhau			VARCHAR(100) NOT NULL,
	MaKH			INT NULL,
	MaNV			INT NULL,
	VaiTro			NVARCHAR(30) CHECK (VaiTro IN (N'Khách hàng', N'Bác sĩ', N'Bán hàng', N'Tiếp tân', N'Quản lý chi nhánh', N'Quản lý công ty'))
	
	CONSTRAINT FK_TK_Khach_hang
	FOREIGN KEY (MaKH) REFERENCES Khach_hang(MaKH),
	CONSTRAINT FK_TK_Nhan_vien
	FOREIGN KEY (MaNV) REFERENCES Nhan_vien(MaNV),
	CONSTRAINT CK_TaiKhoan_Loai CHECK(
	(MaKH IS NOT NULL AND MaNV IS NULL)
	OR
	(MaNV IS NOT NULL AND MaKH IS NULL)           
	OR
	(MaKH IS NULL AND MaNV IS NULL))
)
GO

CREATE OR ALTER TRIGGER trg_Check_DichVuChiNhanh
ON Dich_vu_chi_nhanh
AFTER INSERT, DELETE, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH AffectedCN AS (
        SELECT MaCN FROM inserted
        UNION
        SELECT MaCN FROM deleted
    )
	SELECT 1
	FROM AffectedCN
	WHERE NOT EXISTS (
	    SELECT 1 FROM Dich_vu_chi_nhanh d WHERE d.MaCN = AffectedCN.MaCN
	);
	IF @@ROWCOUNT > 0
    BEGIN
        RAISERROR(N'Mỗi chi nhánh phải có ít nhất 1 dịch vụ.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;
GO

CREATE OR ALTER TRIGGER trg_Check_KhamBenh
ON Kham_benh
FOR INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra nhân viên có phải bác sĩ không
    IF EXISTS (
        SELECT 1
        FROM inserted i
        LEFT JOIN Nhan_vien nv ON nv.MaNV = i.MaNV
        WHERE nv.ChucVu <> N'Bác sĩ'
    )
    BEGIN
        RAISERROR(N'Nhân viên không có chức vụ Bác sĩ.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;

    -- Kiểm tra bác sĩ có đang làm việc tại chi nhánh không
    IF EXISTS (
        SELECT 1
        FROM inserted i
        LEFT JOIN Lich_su_nhan_vien ls
            ON ls.MaNV = i.MaNV
            AND ls.MaCN = i.MaCN
            AND ls.NgayBD <= i.NgayKham
            AND (ls.NgayKT IS NULL OR ls.NgayKT >= i.NgayKham)
        WHERE ls.MaNV IS NULL
    )
    BEGIN
        RAISERROR(N'Bác sĩ không làm việc tại chi nhánh.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
END;
GO

CREATE OR ALTER TRIGGER trg_Check_TiemPhong
ON Tiem_phong
FOR INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra nhân viên có phải bác sĩ không
    IF EXISTS (
        SELECT 1
        FROM inserted i
        LEFT JOIN Nhan_vien nv ON nv.MaNV = i.MaNV
        WHERE nv.ChucVu <> N'Bác sĩ'
    )
    BEGIN
        RAISERROR(N'Nhân viên không có chức vụ Bác sĩ.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;

    -- Kiểm tra bác sĩ có đang làm việc tại chi nhánh không
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
        RAISERROR(N'Bác sĩ không làm việc tại chi nhánh.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
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

CREATE OR ALTER PROCEDURE Update_HangKhachHang
    @MaKH INT,
    @Ngay DATE
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @Nam INT = YEAR(@Ngay);
        DECLARE @TongNam DECIMAL(10,2);

        SELECT @TongNam = SoTien
        FROM Chi_tieu
        WHERE MaKH = @MaKH AND Nam = @Nam;

        IF @TongNam IS NULL SET @TongNam = 0;

        DECLARE @CapHienTai INT =
            (SELECT CapDo FROM Khach_hang WHERE MaKH = @MaKH);


        DECLARE @CapMoi INT =
        (
            SELECT TOP 1 MaCap
            FROM Cap_thanh_vien
            WHERE DKDat IS NOT NULL AND @TongNam >= DKDat
            ORDER BY DKDat DESC
        );

        IF @CapMoi IS NULL SET @CapMoi = @CapHienTai;

        IF @CapMoi > @CapHienTai
        BEGIN
            UPDATE Khach_hang 
            SET CapDo = @CapMoi
            WHERE MaKH = @MaKH;
        END
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

CREATE TYPE TVP_SanPham AS TABLE
(
    MaSP INT NOT NULL,
    SoLuong INT NOT NULL CHECK (SoLuong > 0)
);
GO

CREATE TYPE TVP_DichVu AS TABLE
(
    MaDV INT NOT NULL,      
    MaTC INT NOT NULL,      -- thú cưng liên quan
    MaKB INT NULL,          -- mã khám bệnh (nếu là khám)
    MaTP INT NULL           -- mã tiêm phòng (nếu là tiêm)
);
GO


CREATE OR ALTER PROCEDURE Add_HoaDon
    @MaKH INT,
    @MaCN INT,
    @MaNV INT,
    @NgayLap DATE,
    @HinhThucTT NVARCHAR(20),
    @CT_SanPham TVP_SanPham READONLY,
    @CT_DichVu  TVP_DichVu READONLY
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        DECLARE @MaHD INT;

        -- 1. LẤY KHUYẾN MÃI THEO CẤP ĐỘ KHÁCH
        DECLARE @CapDo INT = (SELECT CapDo FROM Khach_hang WHERE MaKH = @MaKH);

        DECLARE @TiLeKM_Cap DECIMAL(4,2) =
        (
            SELECT TiLeKM FROM Cap_thanh_vien WHERE MaCap = @CapDo
        );
        IF @TiLeKM_Cap IS NULL SET @TiLeKM_Cap = 0;


        -- 2. INSERT HÓA ĐƠN
        INSERT INTO Hoa_don (MaKH, MaCN, MaNV, NgayLap, KhuyenMai, HinhThucTT)
        VALUES (@MaKH, @MaCN, @MaNV, @NgayLap, @TiLeKM_Cap, @HinhThucTT);

        SET @MaHD = SCOPE_IDENTITY();


        -- 3. XỬ LÝ SẢN PHẨM BÁN LẺ
        DECLARE @MaSP INT, @SL INT;

        DECLARE curSP CURSOR LOCAL FOR
            SELECT MaSP, SoLuong FROM @CT_SanPham;

        OPEN curSP;
        FETCH NEXT FROM curSP INTO @MaSP, @SL;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            UPDATE San_pham_chi_nhanh
            SET SLTonKho = SLTonKho - @SL
            WHERE MaSP = @MaSP AND MaCN = @MaCN;

            INSERT INTO Chi_tiet_hoa_don_SP(MaHD, MaSP, MaCN, SoLuong)
            VALUES (@MaHD, @MaSP, @MaCN, @SL);

            FETCH NEXT FROM curSP INTO @MaSP, @SL;
        END

        CLOSE curSP;
        DEALLOCATE curSP;


        -- 4. INSERT CHI TIẾT HÓA ĐƠN DỊCH VỤ
        INSERT INTO Chi_tiet_hoa_don_DV(MaHD, MaDV, MaCN, MaTC, MaKB, MaTP)
        SELECT @MaHD, MaDV, @MaCN, MaTC, MaKB, MaTP
        FROM @CT_DichVu;


        -- 5. TRỪ KHO VACCINE
        DECLARE @VacSP INT;

        DECLARE curVac CURSOR LOCAL FOR
        SELECT tp.MaSP
        FROM Chi_tiet_hoa_don_DV dv
        JOIN Tiem_phong tp ON tp.MaTP = dv.MaTP
        WHERE dv.MaHD = @MaHD AND dv.MaTP IS NOT NULL;

        OPEN curVac;
        FETCH NEXT FROM curVac INTO @VacSP;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            UPDATE San_pham_chi_nhanh
            SET SLTonKho = SLTonKho - 1
            WHERE MaSP = @VacSP AND MaCN = @MaCN;

            FETCH NEXT FROM curVac INTO @VacSP;
        END

        CLOSE curVac;
        DEALLOCATE curVac;


        -- 6. TÍNH TỔNG SP = SP BÁN LẺ + VACCINE
        DECLARE @TienSP DECIMAL(10,2) = 0;
        DECLARE @TienVac DECIMAL(10,2) = 0;
        DECLARE @TongSP DECIMAL(10,2);

        -- SP bán lẻ
        SELECT @TienSP = SUM(sp.SoLuong * gsp.SoTien)
        FROM Chi_tiet_hoa_don_SP sp
        JOIN Gia_san_pham gsp ON gsp.MaSP = sp.MaSP
        WHERE sp.MaHD = @MaHD
          AND gsp.NgayApDung = (
                SELECT MAX(NgayApDung)
                FROM Gia_san_pham 
                WHERE MaSP = sp.MaSP AND NgayApDung <= @NgayLap
          );

        IF @TienSP IS NULL SET @TienSP = 0;


        -- VACCINE tính như sản phẩm
        SELECT @TienVac = SUM(
                gsp.SoTien * (1 - ISNULL(gt.UuDai,0))
        )
        FROM Chi_tiet_hoa_don_DV dv
        JOIN Tiem_phong tp ON tp.MaTP = dv.MaTP
        JOIN Gia_san_pham gsp ON gsp.MaSP = tp.MaSP
        LEFT JOIN Goi_tiem gt ON gt.MaGoi = tp.MaGoi
        WHERE dv.MaHD = @MaHD
          AND dv.MaTP IS NOT NULL
          AND gsp.NgayApDung = (
                SELECT MAX(NgayApDung)
                FROM Gia_san_pham 
                WHERE MaSP = tp.MaSP AND NgayApDung <= @NgayLap
          );

        IF @TienVac IS NULL SET @TienVac = 0;

        SET @TongSP = @TienSP + @TienVac;


        -- 7. TÍNH TỔNG TIỀN DỊCH VỤ
        DECLARE @TongDV DECIMAL(10,2) = 0;

        SELECT @TongDV = SUM(gdv.SoTien)
        FROM Chi_tiet_hoa_don_DV dv
        JOIN Gia_dich_vu gdv ON gdv.MaDV = dv.MaDV
        WHERE dv.MaHD = @MaHD
          AND dv.MaTP IS NULL    
          AND dv.MaKB IS NULL    
          AND gdv.NgayApDung = (
                SELECT MAX(NgayApDung)
                FROM Gia_dich_vu
                WHERE MaDV = dv.MaDV AND NgayApDung <= @NgayLap
          );

        IF @TongDV IS NULL SET @TongDV = 0;


        -- 8. TỔNG TIỀN CUỐI
        DECLARE @TongTien DECIMAL(10,2);

        SET @TongTien = (@TongSP + @TongDV) * (1 - @TiLeKM_Cap);

        UPDATE Hoa_don
        SET TongTien = @TongTien
        WHERE MaHD = @MaHD;


        -- 9. CỘNG ĐIỂM LOYALTY
        UPDATE Khach_hang
        SET DiemLoyalty = ISNULL(DiemLoyalty,0) + 1
        WHERE MaKH = @MaKH;


        -- 10. CẬP NHẬT CHI TIÊU CHO KHÁCH HÀNG
        DECLARE @Nam INT = YEAR(@NgayLap);

        IF EXISTS (SELECT 1 FROM Chi_tieu WHERE MaKH = @MaKH AND Nam = @Nam)
        BEGIN
            UPDATE Chi_tieu
            SET SoTien = SoTien + @TongTien
            WHERE MaKH = @MaKH AND Nam = @Nam;
        END
        ELSE
        BEGIN
            INSERT INTO Chi_tieu (MaKH, Nam, SoTien)
            VALUES (@MaKH, @Nam, @TongTien);
        END;

        -- 11. CẬP NHẬT HẠNG THÀNH VIÊN
        EXEC Update_HangKhachHang @MaKH, @NgayLap

        COMMIT;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK;
        THROW;
    END CATCH;
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

CREATE OR ALTER PROCEDURE Update_GiaSP
    @MaSP INT
    @SoTien DECIMAL(10, 2)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Today = GETDATE()

    IF EXISTS (SELECT 1 FROM Gia_san_pham WHERE MaSP = @MaSP AND NgayApDung = @Today)
        UPDATE Gia_san_pham SET SoTien = @SoTien WHERE MaSP = @MaSP AND NgayApDung = @Today
    ELSE
        INSERT Gia_san_pham(MaSP, NgayApDung, SoTien) VALUES (@MaSP, @Today, @SoTien)
END;
GO

CREATE OR ALTER PROCEDURE Update_GiaDV
    @MaDV INT
    @SoTien DECIMAL(10, 2)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Today = GETDATE()

    IF EXISTS (SELECT 1 FROM Gia_dich_vu WHERE MaDV = @MaDV AND NgayApDung = @Today)
        UPDATE Gia_dich_vu SET SoTien = @SoTien WHERE MaDV = @MaDV AND NgayApDung = @Today
    ELSE
        INSERT Gia_dich_vu(MaDV, NgayApDung, SoTien) VALUES (@MaDV, @Today, @SoTien)
END;
GO