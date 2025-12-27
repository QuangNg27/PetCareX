import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@context/AuthContext";
import {
  SearchIcon,
  PlusIcon,
  MinusIcon,
  LogOutIcon,
} from "@components/common/icons";
// Services
import { productService } from "@services/productService";
import { invoiceService } from "@services/invoiceService";
import doctorService from "@services/doctorService";
import apiClient from "@config/apiClient";

const InvoicePage = () => {
  const navigate = useNavigate();
  const { user, logout, initialized } = useAuth();
  const [activeTab, setActiveTab] = React.useState(() => {
    return localStorage.getItem("invoiceActiveTab") || "products";
  });

  React.useEffect(() => {
    localStorage.setItem("invoiceActiveTab", activeTab);
  }, [activeTab]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [customerServices, setCustomerServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Thức ăn"); // "Tất cả", "Thức ăn", or "Phụ kiện"
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // "Tiền mặt" or "Chuyển khoản"

  // Robust price resolver: handle many backend shapes for price (Gia_san_pham may be
  // number, object, or array of prices per branch). Try to pick branch-specific price
  // when branchId provided, otherwise fallback to common fields.
  const getNumericPrice = (p, branchId) => {
    if (p == null) return 0;
    const tryNumber = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    // If the product itself is a raw number
    if (typeof p === "number") return p;

    // Check Gia_san_pham first (common source)
    const gsp = p.Gia_san_pham ?? p.GiaSanPham ?? p.gia_san_pham;
    if (gsp != null) {
      // If it's a plain number
      if (typeof gsp === "number") return gsp;

      // If it's an array (possible prices per branch)
      if (Array.isArray(gsp) && gsp.length > 0) {
        let entry;
        if (branchId) {
          entry = gsp.find(
            (e) =>
              e?.MaCN == branchId ||
              e?.MaChiNhanh == branchId ||
              e?.Ma_CN == branchId
          );
        }
        entry = entry || gsp[0];
        if (entry) {
          const cand =
            entry.Gia ??
            entry.gia ??
            entry.GiaApDung ??
            entry.GiaBan ??
            entry.Price;
          const n = tryNumber(cand);
          if (n != null) return n;
        }
      }

      // If it's an object
      if (typeof gsp === "object") {
        // direct fields on object
        const cand =
          gsp.Gia ?? gsp.gia ?? gsp.GiaApDung ?? gsp.GiaBan ?? gsp.Price;
        const n = tryNumber(cand);
        if (n != null) return n;

        // maybe keyed by branch id
        if (branchId && gsp[branchId]) {
          const v =
            gsp[branchId].Gia ?? gsp[branchId].gia ?? gsp[branchId].GiaApDung;
          const n2 = tryNumber(v);
          if (n2 != null) return n2;
        }
      }
    }

    // Fallback common fields
    const fallbackKeys = [
      "GiaHienTai",
      "SoTien",
      "GiaBan",
      "Price",
      "gia",
      "Gia",
      "giaBan",
    ];
    for (const k of fallbackKeys) {
      if (p[k] != null) {
        const n = tryNumber(p[k]);
        if (n != null) return n;
      }
    }

    // As a last resort, check nested possible data structures
    if (p.data && Array.isArray(p.data) && p.data[0]) {
      const cand = p.data[0].Gia ?? p.data[0].gia ?? p.data[0].GiaBan;
      const n = tryNumber(cand);
      if (n != null) return n;
    }

    return 0;
  };

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.tenSanPham
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // If selectedCategory is "Tất cả", show all products
    if (selectedCategory === "Tất cả") {
      return matchesSearch;
    }
    // Otherwise, filter by selected category (exact match)
    return (
      matchesSearch &&
      product.loai.toLowerCase() === selectedCategory.toLowerCase()
    );
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingProducts(true);
        const branchId = user?.MaCN;
        const res = await productService.getProducts(branchId);
        const items = res || [];
        if (!mounted) return;
        const resolveLoai = (p) => {
          return (
            p.LoaiSP ||
            p.LoaiSanPham ||
            p.Loai ||
            p.Category ||
            p.Type ||
            "Sản phẩm"
          );
        };

        setAllProducts(
          items.map((p) => ({
            id: p.id || p.MaSanPham || p.MaSP || p.ID,
            tenSanPham: p.TenSanPham || p.tenSanPham || p.TenSP || p.Name || "",
            gia: getNumericPrice(p, branchId) || 0,
            loai: resolveLoai(p),
          }))
        );
      } catch (err) {
        console.error("Lỗi tải sản phẩm cho hoá đơn:", err);
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [user?.MaCN]);

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

  const totalAmount = invoiceItems.reduce((sum, item) => {
    // Cộng giá dịch vụ chính
    let itemTotal = item.gia * item.soLuong;

    // Cộng giá của thuốc/vaccine (details)
    if (Array.isArray(item.details)) {
      itemTotal += item.details.reduce((detailSum, detail) => {
        return detailSum + detail.gia * (detail.soLuong || 1);
      }, 0);
    }

    return sum + itemTotal;
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleCreateInvoice = (paymentMethod) => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn hình thức thanh toán");
      return;
    }

    if (!customerId || invoiceItems.length === 0) {
      toast.error("Vui lòng nhập mã khách hàng và chọn sản phẩm/dịch vụ");
      return;
    }

    (async () => {
      try {
        // Split items into products, services, and medicines
        const products = invoiceItems.filter(
          (i) => !i.isService && !i.isMedicine
        );
        const services = invoiceItems.filter((i) => i.isService);
        const medicines = invoiceItems.filter((i) => i.isMedicine);

        const payload = {
          MaKH: parseInt(customerId),
          MaCN: user?.MaCN,
          NgayLap: new Date().toISOString(),
          HinhThucTT: paymentMethod,
          CT_SanPham: [
            ...products.map((i) => ({
              MaSP: parseInt(i.id),
              SoLuong: parseInt(i.soLuong),
              GiaApDung: parseFloat(i.gia),
            })),
            // Medicines are also products (CT_SanPham)
            ...medicines.map((i) => ({
              MaSP: parseInt(i.MaSP),
              SoLuong: parseInt(i.soLuong),
              GiaApDung: parseFloat(i.gia),
            })),
          ],
          CT_DichVu: services.map((i) => ({
            MaDV: parseInt(i.MaDV),
            MaTC: parseInt(i.MaTC),
            MaKB: i.MaKB ? parseInt(i.MaKB) : null,
            GiaApDung: parseFloat(i.gia),
          })),
        };
        const res = await invoiceService.createInvoice(payload);
        // adapt message from API or fallback
        const msg = res?.message || "Hóa đơn tạo thành công!";
        const methodLabel =
          paymentMethod === "Tiền mặt" ? "💵 Tiền mặt" : "🏦 Chuyển khoản";
        toast.success(
          `✓ ${msg} (${methodLabel})\nTổng tiền: ${totalAmount.toLocaleString()}đ`
        );
        setCustomerId("");
        setCustomerServices([]);
        setInvoiceItems([]);
        setSelectedPaymentMethod(null);
      } catch (err) {
        console.error("Lỗi khi tạo hoá đơn:", err);
        toast.error("✗ Tạo hóa đơn thất bại. Vui lòng thử lại.");
      }
    })();
  };

  // Require authentication only after auth initialization and ensure role Bán hàng
  if (initialized && !user) {
    navigate("/login");
    return null;
  }
  if (
    initialized &&
    user &&
    !(user?.VaiTro === "Bán hàng" || user?.role === "Bán hàng")
  ) {
    // Not authorized for this page
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Không có quyền truy cập</h2>
        <p>Trang này chỉ dành cho nhân viên bán hàng.</p>
      </div>
    );
  }

  // Fetch pet info (to get customer ID) and services/medicines used today
  const handleLoadCustomerServices = async () => {
    const trimmedCustomerId = customerId.trim();
    if (!trimmedCustomerId) {
      toast.error("Vui lòng nhập mã khách hàng");
      return;
    }

    const customerIdNum = parseInt(trimmedCustomerId);
    if (isNaN(customerIdNum)) {
      toast.error("Mã khách hàng phải là số");
      return;
    }

    try {
      setLoadingServices(true);
      // Fetch customer services from new endpoint
      const response = await invoiceService.getCustomerServices(customerIdNum);

      const servicesData = response?.data?.services || [];

      if (servicesData.length === 0) {
        toast.success("Khách hàng chưa có dịch vụ nào");
        setCustomerServices([]);
        return;
      }

      // Fetch medicines cho từng exam, vaccines cho từng vaccination
      const convertedServices = [];

      for (let idx = 0; idx < servicesData.length; idx++) {
        const service = servicesData[idx];

        const mainServiceItem = {
          id: `service_${idx}`,
          tenSanPham: `${service.TenThuCung} - ${service.TenDV}`,
          gia: service.GiaDichVu || 0,
          loai: service.loai,
          isService: true,
          MaDV: service.MaDV,
          MaTC: service.MaTC,
          MaKB: service.MaKB || null,
          MaTP: service.MaTP || null,
          TenThuCung: service.TenThuCung,
          soLuong: 1,
          details: [],
        };

        // Nếu là khám bệnh, fetch thuốc
        if (service.MaKB && service.loai.includes("Khám")) {
          try {
            const medicinesRes = await invoiceService.getMedicinesForExam(
              service.MaKB
            );
            const medicines = medicinesRes?.data?.medicines || [];
            medicines.forEach((medicine) => {
              mainServiceItem.details.push({
                tenChiTiet: medicine.TenSP || medicine.TenChiTiet,
                gia: medicine.SoTien || 0,
                soLuong: medicine.SoLuong || 1,
              });
            });
          } catch (err) {
            console.error(
              `Error fetching medicines for exam ${service.MaKB}:`,
              err
            );
          }
        }

        // Nếu là tiêm phòng, fetch vaccine
        if (service.MaTP && service.loai.includes("Tiêm")) {
          try {
            const vaccinesRes = await invoiceService.getVaccinesForVaccination(
              service.MaTP
            );
            const vaccines = vaccinesRes?.data?.vaccines || [];
            vaccines.forEach((vaccine) => {
              mainServiceItem.details.push({
                tenChiTiet: vaccine.TenSP || vaccine.TenChiTiet,
                gia: vaccine.SoTien || 0,
                lieuLuong: vaccine.LieuLuong,
              });
            });
          } catch (err) {
            console.error(
              `Error fetching vaccines for vaccination ${service.MaTP}:`,
              err
            );
          }
        }

        convertedServices.push(mainServiceItem);
      }

      if (convertedServices.length === 0) {
        toast.success("Khách hàng chưa có dịch vụ nào");
        setCustomerServices([]);
        return;
      }

      setCustomerServices(convertedServices);
      toast.success(`Tìm thấy ${convertedServices.length} dịch vụ`);
    } catch (err) {
      console.error("Lỗi khi tải dịch vụ khách hàng:", err);
      toast.error("Không thể tải dịch vụ. Kiểm tra mã khách hàng.");
      setCustomerServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  // Add service to invoice
  const addServiceToInvoice = (service) => {
    const newItem = { ...service, soLuong: 1 };
    setInvoiceItems([...invoiceItems, newItem]);
    toast.success(`Đã thêm: ${service.tenSanPham}`);
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
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.HoTen?.charAt(0) || "N"}
          </div>
          <div className="text-right hidden md:block">
            <div className="text-sm font-semibold text-gray-900">
              {user?.TenDangNhap || "User"}
            </div>
            <div className="text-xs text-gray-600">Nhân viên bán hàng</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
            title="Đăng xuất"
          >
            <LogOutIcon size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 relative min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Product List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Sản phẩm
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

                {/* Category Tabs */}
                <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedCategory("Tất cả")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === "Tất cả"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setSelectedCategory("Thức ăn")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === "Thức ăn"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Thức ăn
                  </button>
                  <button
                    onClick={() => setSelectedCategory("Phụ kiện")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === "Phụ kiện"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Phụ kiện
                  </button>
                </div>

                {/* Product List */}
                <div className="space-y-3">
                  {filteredProducts.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      Không tìm thấy sản phẩm
                    </p>
                  ) : (
                    filteredProducts.map((product) => (
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
                              {(Number(product.gia) || 0).toLocaleString()}đ
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              📦 {product.LoaiSP}
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
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Invoice Form */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Hóa đơn
                </h2>

                {/* Customer Info */}
                <div className="mb-6 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã khách hàng (MaKH)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        placeholder="Nhập mã khách hàng..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      />
                      <button
                        onClick={handleLoadCustomerServices}
                        disabled={loadingServices}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingServices ? "Đang tải..." : "Tải dịch vụ"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Services */}
                {customerServices.length > 0 && (
                  <div className="mb-6 border-t border-gray-200 pt-4">
                    <h3 className="font-bold text-gray-900 mb-3">
                      Dịch vụ của khách hàng ({customerServices.length})
                    </h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {customerServices.map((service, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900">
                                {service.tenSanPham}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium">
                                  {service.loai}
                                </span>
                                <span className="text-sm font-bold text-primary-600">
                                  {(Number(service.gia) || 0).toLocaleString()}đ
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => addServiceToInvoice(service)}
                              className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs font-medium ml-2"
                            >
                              + Thêm
                            </button>
                          </div>

                          {/* Service Details (medicines/vaccines) */}
                          {service.details && service.details.length > 0 && (
                            <div className="mt-3 pl-3 border-l-2 border-blue-300 space-y-2">
                              <p className="text-xs font-semibold text-gray-700">
                                Chi tiết:
                              </p>
                              {service.details.map((detail, dIdx) => (
                                <div
                                  key={dIdx}
                                  className="text-xs bg-white p-2 rounded border border-blue-100"
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="text-gray-700 font-medium">
                                      {detail.tenChiTiet}
                                    </span>
                                    <span className="text-primary-600 font-bold">
                                      {(
                                        Number(detail.gia) || 0
                                      ).toLocaleString()}
                                      đ
                                    </span>
                                  </div>
                                  {detail.soLuong && (
                                    <p className="text-gray-600 mt-1">
                                      SL: {detail.soLuong}
                                    </p>
                                  )}
                                  {detail.lieuLuong && (
                                    <p className="text-gray-600 mt-1">
                                      Liều: {detail.lieuLuong}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Invoice Items */}
                <div className="mb-6 border-t border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Sản phẩm trong hóa đơn
                  </h3>
                  {invoiceItems.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                      Chưa có sản phẩm nào
                    </p>
                  ) : (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-[500px] overflow-y-auto">
                      <div className="divide-y divide-gray-200">
                        {invoiceItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {item.tenSanPham}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {(Number(item.gia) || 0).toLocaleString()}đ x{" "}
                                  {item.soLuong} ={" "}
                                  <span className="font-bold text-primary-600">
                                    {(item.gia * item.soLuong).toLocaleString()}
                                    đ
                                  </span>
                                </p>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-700 ml-2 flex-shrink-0"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.soLuong - 1)
                                }
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs transition-colors"
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
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs transition-colors"
                              >
                                <PlusIcon size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
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
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Chọn hình thức thanh toán:
                  </p>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleCreateInvoice("Tiền mặt")}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold flex items-center justify-center gap-2"
                    >
                      💵 Tiền mặt
                    </button>
                    <button
                      onClick={() => handleCreateInvoice("Chuyển khoản")}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold flex items-center justify-center gap-2"
                    >
                      🏦 Chuyển khoản
                    </button>
                  </div>
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
