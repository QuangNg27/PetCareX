import React, { useState, useEffect } from "react";
import { useAuth } from "@context/AuthContext";
import {
  PlusIcon,
  EditIcon,
  DeleteIcon,
  SaveIcon,
  XIcon,
  ShoppingBagIcon,
  MinusIcon,
} from "@components/common/icons";

const ProductSalesView = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const [formData, setFormData] = useState({
    TenSanPham: "",
    LoaiSanPham: "Thức ăn",
    GiaBan: "",
    SoLuongTonKho: "",
    DonViTinh: "gói",
    MoTa: "",
    Hinh: "�",
  });

  const categories = ["Thức ăn", "Thuốc", "Vitamin", "Quần áo", "Phụ kiện"];

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const branchId = user?.MaCN;
        // dynamic import to avoid circular depends if any
        const { productService } = await import("@services/productService");
        const res = await productService.getProducts(branchId);
        // try to detect payload shapes and fallback safely
        const items =
          res?.data?.products || res?.products || res?.data || res || [];
        if (mounted)
          setProducts(
            items.map((p) => ({
              id: p.id || p.MaSanPham || p.MaSP || p.MaSanPham || p.ID,
              TenSanPham: p.TenSanPham || p.tenSanPham || p.Name || p.Ten || "",
              LoaiSanPham: p.LoaiSanPham || p.Loai || p.Category || "",
              GiaBan: p.GiaBan || p.Price || p.gia || 0,
              SoLuongTonKho: p.SoLuongTonKho || p.Stock || p.Quantity || 0,
              DonViTinh: p.DonViTinh || p.Unit || "",
              MoTa: p.MoTa || p.Description || "",
              Hinh: p.Hinh || p.Icon || "📦",
            }))
          );
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm từ API, dùng mock:", err);
        // keep empty or fallback to old mock? choose to keep empty so dev sees no data if API down
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      mounted = false;
    };
  }, [user?.MaCN]);

  const handleAddClick = () => {
    setFormData({
      TenSanPham: "",
      LoaiSanPham: "Thức ăn",
      GiaBan: "",
      SoLuongTonKho: "",
      DonViTinh: "gói",
      MoTa: "",
      Hinh: "📦",
    });
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    if (!formData.TenSanPham || !formData.GiaBan) {
      alert("Vui lòng điền đủ thông tin");
      return;
    }

    if (editingId) {
      setProducts(
        products.map((p) =>
          p.id === editingId ? { ...formData, id: editingId } : p
        )
      );
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.SoLuongTonKho),
              }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      const product = products.find((p) => p.id === productId);
      setCart(
        cart.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.min(newQuantity, product.SoLuongTonKho),
              }
            : item
        )
      );
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.GiaBan * item.quantity,
    0
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Danh sách sản phẩm & thuốc
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Tổng số: {products.length} sản phẩm
          </p>
        </div>
        <div className="flex gap-3">
          {cart.length > 0 && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors relative"
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingBagIcon size={18} /> Giỏ hàng
              <span className="ml-2 px-2 py-0.5 bg-white text-green-600 rounded-full text-xs font-bold">
                {cart.length}
              </span>
            </button>
          )}
          {!showAddForm && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              onClick={handleAddClick}
            >
              <PlusIcon size={18} /> Thêm sản phẩm
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                value={formData.TenSanPham}
                onChange={(e) =>
                  setFormData({ ...formData, TenSanPham: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ví dụ: Thức ăn cho chó..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại sản phẩm *
              </label>
              <select
                value={formData.LoaiSanPham}
                onChange={(e) =>
                  setFormData({ ...formData, LoaiSanPham: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá bán (VND) *
              </label>
              <input
                type="number"
                value={formData.GiaBan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    GiaBan: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ví dụ: 250000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng tồn kho *
              </label>
              <input
                type="number"
                value={formData.SoLuongTonKho}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    SoLuongTonKho: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ví dụ: 50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn vị tính
              </label>
              <input
                type="text"
                value={formData.DonViTinh}
                onChange={(e) =>
                  setFormData({ ...formData, DonViTinh: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="gói, lọ, bộ..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon emoji
              </label>
              <input
                type="text"
                value={formData.Hinh}
                onChange={(e) =>
                  setFormData({ ...formData, Hinh: e.target.value })
                }
                maxLength="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.MoTa}
              onChange={(e) =>
                setFormData({ ...formData, MoTa: e.target.value })
              }
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Mô tả chi tiết sản phẩm..."
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <SaveIcon size={18} /> Lưu
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <XIcon size={18} /> Hủy
            </button>
          </div>
        </div>
      )}

      {/* Shopping Cart */}
      {showCart && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Giỏ hàng ({cart.length})</h3>
          {cart.length === 0 ? (
            <p className="text-gray-600">Giỏ hàng trống</p>
          ) : (
            <div>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="text-3xl">{item.Hinh}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.TenSanPham}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Giá: {item.GiaBan.toLocaleString()}đ
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                      >
                        <MinusIcon size={18} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                        min="1"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                      >
                        <PlusIcon size={18} />
                      </button>
                    </div>
                    <div className="text-right min-w-24">
                      <p className="font-bold text-gray-900">
                        {(item.GiaBan * item.quantity).toLocaleString()}đ
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {totalPrice.toLocaleString()}đ
                  </span>
                </div>
                <button className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-bold">
                  Xác nhận đơn hàng
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{product.Hinh}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <EditIcon size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <DeleteIcon size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {product.TenSanPham}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Loại:</span>
                  <span className="font-medium text-gray-900">
                    {product.LoaiSanPham}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giá:</span>
                  <span className="font-bold text-primary-600">
                    {product.GiaBan.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tồn kho:</span>
                  <span
                    className={`font-medium ${
                      product.SoLuongTonKho > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.SoLuongTonKho} {product.DonViTinh}
                  </span>
                </div>
              </div>

              {product.MoTa && (
                <p className="text-sm text-gray-600 mb-4">{product.MoTa}</p>
              )}
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => addToCart(product)}
                disabled={product.SoLuongTonKho === 0}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                  product.SoLuongTonKho > 0
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                <ShoppingBagIcon size={16} />{" "}
                {product.SoLuongTonKho > 0 ? "Thêm vào giỏ" : "Hết hàng"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSalesView;
