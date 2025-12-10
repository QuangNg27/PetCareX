import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import {
  SearchIcon,
  PlusIcon,
  MinusIcon,
  PrintIcon,
  UserIcon,
  LogOutIcon,
  AwardIcon,
} from "@components/common/icons";

const InvoicePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  // Danh sách sản phẩm/thuốc
  const allProducts = [
    {
      id: 1,
      tenSanPham: "Thức ăn cho chó Pedigree 2.5kg",
      gia: 250000,
      loai: "sản phẩm",
    },
    {
      id: 2,
      tenSanPham: "Thuốc kháng sinh Amoxicillin 250mg",
      gia: 85000,
      loai: "thuốc",
    },
    {
      id: 3,
      tenSanPham: "Chất diệt ký sinh trùng Ivermectin",
      gia: 95000,
      loai: "thuốc",
    },
    {
      id: 4,
      tenSanPham: "Vitamin tổng hợp cho chó",
      gia: 75000,
      loai: "sản phẩm",
    },
    { id: 5, tenSanPham: "Probiotics cho mèo", gia: 65000, loai: "sản phẩm" },
    {
      id: 6,
      tenSanPham: "Áo quần cho chó Size M",
      gia: 120000,
      loai: "sản phẩm",
    },
  ];

  const [invoiceItems, setInvoiceItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [petName, setPetName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = allProducts.filter((product) =>
    product.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product) => {
    const existingItem = invoiceItems.find((item) => item.id === product.id);
    if (existingItem) {
      setInvoiceItems(
        invoiceItems.map((item) =>
          item.id === product.id ? { ...item, soLuong: item.soLuong + 1 } : item
        )
      );
    } else {
      setInvoiceItems([...invoiceItems, { ...product, soLuong: 1 }]);
    }
  };

  const removeItem = (productId) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      setInvoiceItems(
        invoiceItems.map((item) =>
          item.id === productId ? { ...item, soLuong: newQuantity } : item
        )
      );
    }
  };

  const totalAmount = invoiceItems.reduce(
    (sum, item) => sum + item.gia * item.soLuong,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  const handleCreateInvoice = () => {
    if (!customerName || !petName || invoiceItems.length === 0) {
      alert("Vui lòng nhập đầy đủ thông tin và chọn sản phẩm");
      return;
    }
    alert(
      `Hóa đơn tạo thành công!\nKhách: ${customerName}\nThú cưng: ${petName}\nTổng tiền: ${totalAmount.toLocaleString()}đ`
    );
    // Reset form
    setCustomerName("");
    setPetName("");
    setInvoiceItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            🐾
          </div>
          <span className="text-xl font-bold text-gray-900">PetCareX</span>
        </div>

        <div className="flex-1"></div>

        <div className="flex items-center gap-4">
          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.HoTen?.charAt(0) || "U"}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.TenDangNhap || "User"}
                </div>
                <div className="text-xs text-gray-600">Nhân viên bán hàng</div>
              </div>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showUserMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gradient-to-br from-primary-50 to-white border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user?.HoTen?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user?.HoTen || "User"}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user?.Email || "email@example.com"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="my-1 border-t border-gray-200"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                  >
                    <LogOutIcon size={18} /> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Product List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Sản phẩm & Thuốc
                </h2>

                {/* Search */}
                <div className="mb-6 relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <SearchIcon
                    size={18}
                    className="absolute right-3 top-3 text-gray-400"
                  />
                </div>

                {/* Product List */}
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {product.tenSanPham}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">
                            {product.gia.toLocaleString()}đ
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {product.loai === "thuốc"
                              ? "💊 Thuốc"
                              : "📦 Sản phẩm"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => addItem(product)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
                      >
                        <PlusIcon size={18} /> Thêm
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Invoice Form */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Hóa đơn
                </h2>

                {/* Customer Info */}
                <div className="mb-6 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên khách hàng
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nhập tên..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên thú cưng
                    </label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="Nhập tên..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="mb-6 border-t border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Sản phẩm trong hóa đơn
                  </h3>
                  {invoiceItems.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Chưa có sản phẩm nào
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {invoiceItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {item.tenSanPham}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {item.gia.toLocaleString()}đ x {item.soLuong} ={" "}
                                <span className="font-bold text-primary-600">
                                  {(item.gia * item.soLuong).toLocaleString()}đ
                                </span>
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 ml-2"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.soLuong - 1)
                              }
                              className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
                            >
                              <MinusIcon size={14} />
                            </button>
                            <input
                              type="number"
                              value={item.soLuong}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, parseInt(e.target.value) || 1)
                                )
                              }
                              className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                              min="1"
                            />
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.soLuong + 1)
                              }
                              className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
                            >
                              <PlusIcon size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-700">
                      Tổng cộng:
                    </span>
                    <span className="text-2xl font-bold text-primary-600">
                      {totalAmount.toLocaleString()}đ
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={handleCreateInvoice}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-bold"
                  >
                    Tạo hóa đơn
                  </button>
                  <button
                    onClick={handlePrint}
                    disabled={invoiceItems.length === 0}
                    className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <PrintIcon size={18} /> In hóa đơn
                  </button>
                </div>

                {/* Info */}
                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700">
                    💡 Thêm sản phẩm/thuốc từ danh sách bên trái, chỉnh sửa số
                    lượng, rồi tạo hóa đơn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicePage;
