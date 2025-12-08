const BaseRepository = require('./BaseRepository');

class ProductRepository extends BaseRepository {
    async getAllProducts(filters = {}) {
        const { category, search, limit = 50, offset = 0 } = filters;
        
        let whereClause = 'WHERE 1=1';
        const params = { Offset: offset, Limit: limit };

        if (category) {
            whereClause += ' AND sp.LoaiSP = @LoaiSP';
            params.LoaiSP = category;
        }

        if (search) {
            whereClause += ' AND (sp.TenSP LIKE @Search OR sp.MaSP LIKE @Search)';
            params.Search = `%${search}%`;
        }

        const result = await this.execute(`
            SELECT 
                sp.MaSP,
                sp.TenSP,
                sp.LoaiSP,
                sp.LoaiVaccine,
                sp.NgaySX,
                gsp.SoTien as GiaHienTai
            FROM San_pham sp
            LEFT JOIN Gia_san_pham gsp ON sp.MaSP = gsp.MaSP 
                AND gsp.NgayApDung = (
                    SELECT MAX(NgayApDung) 
                    FROM Gia_san_pham 
                    WHERE MaSP = sp.MaSP 
                    AND NgayApDung <= CAST(GETDATE() AS DATE)
                )
            ${whereClause}
            OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY
        `, params);

        return result.recordset;
    }

    async getProduct(productId) {
        const result = await this.execute(`
            SELECT 
                sp.MaSP,
                sp.TenSP,
                sp.LoaiSP,
                sp.LoaiVaccine,
                sp.NgaySX,
                gsp.SoTien as GiaHienTai
            FROM San_pham sp
            LEFT JOIN Gia_san_pham gsp ON sp.MaSP = gsp.MaSP 
                AND gsp.NgayApDung = (
                    SELECT MAX(NgayApDung) 
                    FROM Gia_san_pham 
                    WHERE MaSP = sp.MaSP 
                    AND NgayApDung <= CAST(GETDATE() AS DATE)
                )
            WHERE sp.MaSP = @MaSP
        `, { MaSP: productId });

        return result.recordset[0];
    }

    async getProductByName(productName) {
        const result = await this.execute(`
            SELECT 
                sp.MaSP,
                sp.TenSP,
                sp.LoaiSP,
                sp.LoaiVaccine,
                sp.NgaySX
            FROM San_pham sp
            WHERE sp.TenSP = @TenSP
        `, { TenSP: productName });

        return result.recordset[0];
    }

    async getProductInventory(productId, branchId = null) {
        let whereClause = 'WHERE spcn.MaSP = @MaSP';
        const params = { MaSP: productId };

        if (branchId) {
            whereClause += ' AND spcn.MaCN = @MaCN';
            params.MaCN = branchId;
        }

        const result = await this.execute(`
            SELECT 
                spcn.MaCN,
                cn.TenCN,
                spcn.SLTonKho,
            FROM San_pham_chi_nhanh spcn
            JOIN Chi_nhanh cn ON spcn.MaCN = cn.MaCN
            ${whereClause}
            ORDER BY cn.TenCN
        `, params);

        return branchId ? result.recordset[0] : result.recordset;
    }

    async updateProductPrice(productId, price, effectiveDate) {
        await this.executeProcedure('Update_GiaSP', {
            MaSP: productId,
            SoTien: price,
            NgayApDung: effectiveDate
        });
        
        return true;
    }

    async updateProductPrice(productId, price, effectiveDate) {
        const result = await this.execute(`
            SELECT 
                gsp.NgayApDung,
                gsp.SoTien
            FROM Gia_san_pham gsp
            WHERE gsp.MaSP = @MaSP
            ORDER BY gsp.NgayApDung DESC
        `, { MaSP: productId });

        return result.recordset;
    }

    async updateInventory(productId, branchId, newQuantity) {
        const result = await this.execute(`
            UPDATE San_pham_chi_nhanh 
            SET SLTonKho = @SLTonKho
            WHERE MaSP = @MaSP AND MaCN = @MaCN
            
            IF @@ROWCOUNT = 0
            BEGIN
                INSERT INTO San_pham_chi_nhanh (MaSP, MaCN, SLTonKho)
                VALUES (@MaSP, @MaCN, @SLTonKho)
            END
        `, {
            MaSP: productId,
            MaCN: branchId,
            SLTonKho: newQuantity
        });

        return true;
    }



    async getProductsByCategory(category) {
        const result = await this.execute(`
            SELECT 
                sp.MaSP,
                sp.TenSP,
                sp.LoaiSP,
                sp.LoaiVaccine,
                sp.NgaySX,
                gsp.SoTien as GiaHienTai
            FROM San_pham sp
            LEFT JOIN Gia_san_pham gsp ON sp.MaSP = gsp.MaSP 
                AND gsp.NgayApDung = (
                    SELECT MAX(NgayApDung) 
                    FROM Gia_san_pham 
                    WHERE MaSP = sp.MaSP 
                    AND NgayApDung <= CAST(GETDATE() AS DATE)
                )
            WHERE sp.LoaiSP = @LoaiSP
        `, { LoaiSP: category });

        return result.recordset;
    }

    async getLowStockProducts(branchId = null, threshold = 10) {
        let whereClause = 'WHERE spcn.SLTonKho <= @Threshold';
        const params = { Threshold: threshold };

        if (branchId) {
            whereClause += ' AND spcn.MaCN = @MaCN';
            params.MaCN = branchId;
        }

        const result = await this.execute(`
            SELECT 
                spcn.MaSP,
                sp.TenSP,
                spcn.MaCN,
                cn.TenCN,
                spcn.SLTonKho as SoLuong
            FROM San_pham_chi_nhanh spcn
            JOIN San_pham sp ON spcn.MaSP = sp.MaSP
            JOIN Chi_nhanh cn ON spcn.MaCN = cn.MaCN
            ${whereClause}
            ORDER BY spcn.SLTonKho ASC, sp.TenSP
        `, params);

        return result.recordset;
    }



    async createProduct(productData) {
        const { TenSP, LoaiSP, LoaiVaccine, NgaySX, GiaGoc } = productData;
        
        const result = await this.execute(`
            BEGIN TRANSACTION
            
            -- Create product
            INSERT INTO San_pham (TenSP, LoaiSP, LoaiVaccine, NgaySX)
            OUTPUT inserted.MaSP
            VALUES (@TenSP, @LoaiSP, @LoaiVaccine, @NgaySX)
            
            DECLARE @MaSP INT = @@IDENTITY
            
            -- Set initial price
            IF @GiaGoc IS NOT NULL
            BEGIN
                INSERT INTO Gia_san_pham (MaSP, SoTien, NgayApDung)
                VALUES (@MaSP, @GiaGoc, CAST(GETDATE() AS DATE))
            END
            
            COMMIT
            
            SELECT @MaSP as MaSP
        `, {
            TenSP,
            LoaiSP,
            LoaiVaccine,
            NgaySX,
            GiaGoc
        });

        return result.recordset[0];
    }

    async updateProduct(productId, updateData) {
        const { TenSP, LoaiSP, LoaiVaccine, NgaySX } = updateData;
        
        const result = await this.execute(`
            UPDATE San_pham 
            SET TenSP = COALESCE(@TenSP, TenSP),
                LoaiSP = COALESCE(@LoaiSP, LoaiSP),
                LoaiVaccine = COALESCE(@LoaiVaccine, LoaiVaccine),
                NgaySX = COALESCE(@NgaySX, NgaySX)
            WHERE MaSP = @MaSP
        `, {
            MaSP: productId,
            TenSP,
            LoaiSP,
            LoaiVaccine,
            NgaySX
        });

        return result.rowsAffected[0] > 0;
    }

    async deleteProduct(productId) {
        // Check if product is used in any invoices
        const usageCheck = await this.execute(`
            SELECT COUNT(*) as UsageCount
            FROM Chi_tiet_hoa_don_SP
            WHERE MaSP = @MaSP
        `, { MaSP: productId });

        if (usageCheck.recordset[0].UsageCount > 0) {
            throw new Error('Khong the xoa san pham da duoc su dung trong hoa don');
        }

        const result = await this.execute(`
            DELETE FROM San_pham WHERE MaSP = @MaSP
        `, { MaSP: productId });

        return result.rowsAffected[0] > 0;
    }
}

module.exports = ProductRepository;