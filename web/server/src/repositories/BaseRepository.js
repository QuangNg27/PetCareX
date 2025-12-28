const pool = require("../config/db");
const sql = require("mssql");

class BaseRepository {
  constructor() {
    this.pool = pool;
  }

  async execute(query, params = {}) {
    try {
      const request = (await this.pool).request();

      // Add parameters to request
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }

      return await request.query(query);
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  async executeProcedure(procedureName, params = {}) {
    try {
      const request = (await this.pool).request();

      // Add parameters to request
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }

      return await request.execute(procedureName);
    } catch (error) {
      console.error("Procedure execution error:", error);
      throw error;
    }
  }

  async executeWithTVP(procedureName, params = {}, tvpParams = {}) {
    try {
      const request = (await this.pool).request();

      // Add regular parameters
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }

      // Add table-valued parameters
      for (const [key, data] of Object.entries(tvpParams)) {
        const table = new sql.Table();

        if (key === "CT_SanPham") {
          table.columns.add("MaSP", sql.Int);
          table.columns.add("SoLuong", sql.Int);
          table.columns.add("GiaApDung", sql.Decimal(10, 2));

          data.forEach((row) => {
            table.rows.add(row.MaSP, row.SoLuong, row.GiaApDung);
          });
        } else if (key === "CT_DichVu") {
          table.columns.add("MaCN", sql.Int);
          table.columns.add("MaDV", sql.Int, { nullable: true });
          table.columns.add("MaTC", sql.Int);
          table.columns.add("MaKB", sql.Int, { nullable: true });
          table.columns.add("MaTP", sql.Int, { nullable: true });
          table.columns.add("GiaApDung", sql.Decimal(10, 2));

          data.forEach((row) => {
            table.rows.add(
              row.MaCN,
              row.MaDV || null,
              row.MaTC,
              row.MaKB || null,
              row.MaTP || null,
              row.GiaApDung
            );
          });
        }

        request.input(key, table);
      }

      return await request.execute(procedureName);
    } catch (error) {
      console.error("TVP procedure execution error:", error);
      throw error;
    }
  }
}

module.exports = BaseRepository;
