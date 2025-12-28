import React, { useState, useEffect } from "react";
import { branchManagerService } from "@services/branchManagerService";
import { useAuth } from "@context/AuthContext";
import { SearchIcon, FilterIcon } from "@components/common/icons";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const ProductInventoryView = () => {
  const { user } = useAuth();
  const branchId = user?.MaCN;

  const [products, setProducts] = useState([]);
  const [popularVaccines, setPopularVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productType, setProductType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  useEffect(() => {
    if (branchId) {
      fetchProducts();
      fetchPopularVaccines();
    }
  }, [branchId, productType]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (productType) filters.category = productType;
      const data = await branchManagerService.searchProducts(branchId, filters);
      // Map server field names to client field names
      const mappedProducts = (data.data.products || []).map((product) => ({
        ...product,
        DonGia: product.GiaHienTai,
        SoLuongTon: product.SLTonKho,
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularVaccines = async () => {
    try {
      const data = await branchManagerService.getPopularVaccines(branchId, 6);
      setPopularVaccines(data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải thống kê vắc-xin:", error);
      setPopularVaccines([]);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const searchParams = {
        search: searchTerm,
        category: productType,
      };

      const data = await branchManagerService.searchProducts(
        branchId,
        searchParams
      );
      // Map server field names to client field names
      const mappedProducts = (data.data.products || []).map((product) => ({
        ...product,
        DonGia: product.GiaHienTai,
        SoLuongTon: product.SLTonKho,
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchTerm ||
      product.TenSP?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.LoaiSP?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !productType || product.LoaiSP === productType;

    const matchesDate =
      (!dateFrom && !dateTo) ||
      ((!dateFrom || new Date(product.NgaySX) >= new Date(dateFrom)) &&
        (!dateTo || new Date(product.NgaySX) <= new Date(dateTo)));

    return matchesSearch && matchesType && matchesDate;
  });

  const getLowStockProducts = () => {
    return filteredProducts.filter((p) => p.SoLuongTon < 10);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Quản lý tồn kho & Vắc-xin
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Tổng sản phẩm</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {filteredProducts.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Sản phẩm sắp hết</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {getLowStockProducts().length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Tổng giá trị tồn kho</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {filteredProducts
              .reduce((sum, p) => sum + (p.SoLuongTon * p.DonGia || 0), 0)
              .toLocaleString("vi-VN")}{" "}
            VNĐ
          </p>
        </div>
      </div>

      {/* Popular Vaccines List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Vắc-xin được sử dụng nhiều nhất
        </h3>
        {popularVaccines.length > 0 ? (
          <div className="max-h-96 overflow-y-auto pr-2">
            <div className="space-y-2">
              {popularVaccines.map((vaccine, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-orange-600"
                          : "bg-blue-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {vaccine.TenVacXin}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {vaccine.SoLuongDat}
                    </p>
                    <p className="text-xs text-gray-500">lượt sử dụng</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có dữ liệu thống kê vắc-xin</p>
            <p className="text-sm mt-1">
              Dữ liệu sẽ hiển thị khi có hoạt động tiêm phòng tại chi nhánh
            </p>
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, loại sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer hover:border-gray-400 transition-colors"
          >
            <option value="">Tất cả loại sản phẩm</option>
            <option value="Vaccine">Vaccine</option>
            <option value="Thức ăn">Thức ăn</option>
            <option value="Thuốc">Thuốc</option>
            <option value="Phụ kiện">Phụ kiện</option>
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="Từ ngày"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="Đến ngày"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Low Stock Alert */}
      {getLowStockProducts().length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-800 font-semibold">
            ⚠️ Cảnh báo: Có {getLowStockProducts().length} sản phẩm sắp hết hàng
            (dưới 10 đơn vị)
          </p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FilterIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã SP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày sản xuất
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá trị
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.MaSP}
                    className={`hover:bg-gray-50 ${
                      product.SoLuongTon < 10 ? "bg-orange-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.MaSP}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{product.TenSP}</div>
                      {product.LoaiSP === "Vaccine" && product.LoaiVaccine && (
                        <div className="text-xs text-gray-500 mt-1">
                          {product.LoaiVaccine}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.LoaiSP === "Vaccine"
                            ? "bg-blue-100 text-blue-800"
                            : product.LoaiSP === "Thức ăn"
                            ? "bg-green-100 text-green-800"
                            : product.LoaiSP === "Thuốc"
                            ? "bg-purple-100 text-purple-808"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.LoaiSP}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.NgaySX
                        ? new Date(product.NgaySX).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {product.DonGia?.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                        product.SoLuongTon < 10
                          ? "text-orange-600"
                          : "text-gray-900"
                      }`}
                    >
                      {product.SoLuongTon}
                      {product.SoLuongTon < 10 && " ⚠️"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {(product.SoLuongTon * product.DonGia).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VNĐ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInventoryView;
