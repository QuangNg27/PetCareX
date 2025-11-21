CREATE DATABASE PetCareX
GO
USE PetCareX
GO

CREATE TABLE Cap_thanh_vien
(
	MaCap 		INT IDENTITY(1,1) PRIMARY KEY,
	TenCapDo 	NVARCHAR(15) CHECK (TenCapDo IN (N'Cơ bản', N'Thân thiết', 'VIP')) NOT NULL,
	DKDat 		DECIMAL(10,2),
	DKGiu 		DECIMAL(10,2)
)

CREATE TABLE Khach_hang
(
	MaKH 		INT IDENTITY(1,1) PRIMARY KEY,
    HoTen 		NVARCHAR(100) NOT NULL,
    SoDT 		NVARCHAR(20) UNIQUE NOT NULL,
    Email 		NVARCHAR(255) UNIQUE NOT NULL,
   	CCCD 		CHAR(12),
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

CREATE TABLE Chi_tiet_goi_tiem
(
	MaGoi 		INT NOT NULL,
	MaSP 		INT NOT NULL,
	NgayTiem 	DATE NOT NULL,
	TrangThai 	NVARCHAR(15) CHECK(TrangThai IN (N'Đã tiêm', N'Chưa tiêm')) ,
	PRIMARY KEY (MaGoi, MaSP),

	CONSTRAINT FK_CTGT_Goi_tiem
    FOREIGN KEY (MaGoi) REFERENCES Goi_tiem(MaGoi) ON DELETE CASCADE,
	CONSTRAINT FK_CTGT_San_pham
    FOREIGN KEY (MaSP) REFERENCES San_pham(MaSP)
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
	PRIMARY KEY (MaHD, MaDV, MaCN, MaTC),
	
	CONSTRAINT FK_CTHD_DV_Hoa_don
	FOREIGN KEY (MaHD) REFERENCES Hoa_don(MaHD) ON DELETE CASCADE,
	CONSTRAINT FK_CTHD_DV_Dich_vu_chi_nhanh
	FOREIGN KEY (MaCN, MaDV) REFERENCES Dich_vu_chi_nhanh(MaCN, MaDV),
	CONSTRAINT FK_CTHD_DV_Thu_cung
	FOREIGN KEY (MaTC) REFERENCES Thu_cung(MaTC)
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

CREATE OR ALTER PROCEDURE Add_HoaDon
    @MaKH INT,
    @MaCN INT,
    @MaNV INT,
    @NgayLap DATE,
    @KhuyenMai DECIMAL(4,2),
	@HinhThucTT NVARCHAR(20),
    @CT_SanPham TABLE (MaSP INT, SoLuong INT),
    @CT_DichVu TABLE (MaDV INT, MaTC INT)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRAN;

        DECLARE @MaHD INT;

        -- 1. Insert hóa đơn
        INSERT INTO Hoa_don (MaKH, MaCN, MaNV, NgayLap, KhuyenMai, HinhThucTT)
        VALUES (@MaKH, @MaCN, @MaNV, @NgayLap, @KhuyenMai, @HinhThucTT);

        SET @MaHD = SCOPE_IDENTITY();


        -- 2. Check tồn kho + trừ tồn kho
        DECLARE @MaSP INT, @SL INT;

        DECLARE cur CURSOR LOCAL FOR
            SELECT MaSP, SoLuong FROM @CT_SanPham;

        OPEN cur;
        FETCH NEXT FROM cur INTO @MaSP, @SL;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            DECLARE @Ton INT = (
                SELECT SLTonKho FROM San_pham_chi_nhanh
                WHERE MaSP = @MaSP AND MaCN = @MaCN
            );

            IF @Ton IS NULL
                THROW 70001, N'Sản phẩm không tồn tại tại chi nhánh.', 1;

            IF @Ton < @SL
                THROW 70002, N'Không đủ tồn kho.', 1;

            UPDATE San_pham_chi_nhanh
            SET SLTonKho = SLTonKho - @SL
            WHERE MaSP = @MaSP AND MaCN = @MaCN;

            INSERT INTO Chi_tiet_hoa_don_SP(MaHD, MaSP, MaCN, SoLuong)
            VALUES (@MaHD, @MaSP, @MaCN, @SL);

            FETCH NEXT FROM cur INTO @MaSP, @SL;
        END

        CLOSE cur;
        DEALLOCATE cur;


        -- 3. Insert dịch vụ
        INSERT INTO Chi_tiet_hoa_don_DV(MaHD, MaDV, MaTC)
        SELECT @MaHD, MaDV, MaTC FROM @CT_DichVu;


        -- 4. Tính tổng tiền
        DECLARE @TongSP DECIMAL(10,2), @TongDV DECIMAL(10,2);

        SELECT @TongSP = SUM(sp.SoLuong * g.SoTien)
        FROM Chi_tiet_hoa_don_SP sp
        JOIN Gia_san_pham g ON g.MaSP = sp.MaSP
        WHERE sp.MaHD = @MaHD
          AND g.NgayApDung = (
                SELECT MAX(NgayApDung)
                FROM Gia_san_pham
                WHERE MaSP = sp.MaSP AND NgayApDung <= @NgayLap
            );

        SELECT @TongDV = SUM(gdv.SoTien)
        FROM Chi_tiet_hoa_don_DV dv
        JOIN Gia_dich_vu gdv ON gdv.MaDV = dv.MaDV
        WHERE dv.MaHD = @MaHD
          AND gdv.NgayApDung = (
                SELECT MAX(NgayApDung)
                FROM Gia_dich_vu
                WHERE MaDV = dv.MaDV AND NgayApDung <= @NgayLap
            );

		DECLARE @TT DECIMAL(10,2) = ISNULL(@TongSP,0) + ISNULL(@TongDV,0)
		SET @TT = @TT * (1 - @KhuyenMai)
        UPDATE Hoa_don
        SET TongTien = @TT
        WHERE MaHD = @MaHD;

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