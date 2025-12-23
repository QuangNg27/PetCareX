const CustomerService = require("../services/CustomerService");
const { AppError } = require("../middleware/errorHandler");

class CustomerController {
  constructor() {
    this.customerService = new CustomerService();
  }

  getProfile = async (req, res, next) => {
    try {
      const customerId = req.user.MaKH;

      if (!customerId) {
        throw new AppError(
          "Chỉ khách hàng mới có thể xem thông tin cá nhân",
          403
        );
      }

      const result = await this.customerService.getProfile(customerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const customerId = req.user.MaKH;

      if (!customerId) {
        throw new AppError("Chỉ khách hàng mới có thể cập nhật thông tin", 403);
      }

      const result = await this.customerService.updateProfile(
        customerId,
        req.body
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getMembershipSpending = async (req, res, next) => {
    try {
      const customerId = req.user.MaKH;

      if (!customerId) {
        throw new AppError(
          "Chỉ khách hàng mới có thể xem thông tin thành viên",
          403
        );
      }

      const result = await this.customerService.getMembershipSpending(
        customerId
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getLoyaltyHistory = async (req, res, next) => {
    try {
      const customerId = req.user.MaKH;
      const limit = parseInt(req.query.limit) || 10;

      if (!customerId) {
        throw new AppError(
          "Chỉ khách hàng mới có thể xem lịch sử điểm thưởng",
          403
        );
      }

      const result = await this.customerService.getLoyaltyHistory(
        customerId,
        limit
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  searchCustomers = async (req, res, next) => {
    try {
      const { q: searchTerm } = req.query;
      const limit = parseInt(req.query.limit) || 20;

      if (!searchTerm) {
        throw new AppError("Từ khóa tìm kiếm là bắt buộc", 400);
      }

      const result = await this.customerService.searchCustomers(
        searchTerm,
        limit
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // Pet endpoints
  getPets = async (req, res, next) => {
    try {
      const customerId = req.user.MaKH;

      if (!customerId) {
        throw new AppError(
          "Chỉ khách hàng mới có thể xem danh sách thú cưng",
          403
        );
      }

      const result = await this.customerService.getPets(customerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getPetById = async (req, res, next) => {
    try {
      const petId = parseInt(req.params.petId);

      if (isNaN(petId)) {
        throw new AppError("Mã thú cưng không hợp lệ", 400);
      }

      const result = await this.customerService.getPetById(petId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  createPet = async (req, res, next) => {
    try {
      const customerId = req.user.MaKH;

    getProfile = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            
            if (!customerId) {
                throw new AppError('Chỉ khách hàng mới có thể xem thông tin cá nhân', 403);
            }

            const result = await this.customerService.getProfile(customerId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            
            if (!customerId) {
                throw new AppError('Chỉ khách hàng mới có thể cập nhật thông tin', 403);
            }

            const result = await this.customerService.updateProfile(customerId, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    getMembershipSpending = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            
            if (!customerId) {
                throw new AppError('Chỉ khách hàng mới có thể xem thông tin thành viên', 403);
            }

            const result = await this.customerService.getMembershipSpending(customerId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    getLoyaltyHistory = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            const limit = parseInt(req.query.limit) || 10;
            
            if (!customerId) {
                throw new AppError('Chỉ khách hàng mới có thể xem lịch sử điểm thưởng', 403);
            }

            const result = await this.customerService.getLoyaltyHistory(customerId, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    searchCustomers = async (req, res, next) => {
        try {
            const { q: searchTerm } = req.query;
            const limit = parseInt(req.query.limit) || 20;
            
            if (!searchTerm) {
                throw new AppError('Từ khóa tìm kiếm là bắt buộc', 400);
            }

            const result = await this.customerService.searchCustomers(searchTerm, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    createCustomer = async (req, res, next) => {
        try {
            const result = await this.customerService.createCustomer(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    createPetForCustomer = async (req, res, next) => {
        try {
            const customerId = parseInt(req.params.customerId);
            const result = await this.customerService.createPetForCustomer(customerId, req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    getCustomerPets = async (req, res, next) => {
        try {
            const customerId = parseInt(req.params.customerId);
            const result = await this.customerService.getCustomerPets(customerId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    // Pet endpoints
    getPets = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            
            if (!customerId) {
                throw new AppError('Chỉ khách hàng mới có thể xem danh sách thú cưng', 403);
            }

            const result = await this.customerService.getPets(customerId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    createPet = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            
            if (!customerId) {
                throw new AppError('Chỉ khách hàng mới có thể thêm thú cưng', 403);
            }

            const result = await this.customerService.createPet(customerId, req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    updatePet = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            const petId = parseInt(req.params.petId);
            
            if (!customerId) {
                throw new AppError('Chỉ khách hàng mới có thể cập nhật thú cưng', 403);
            }

            const result = await this.customerService.updatePet(petId, customerId, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    deletePet = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            const petId = parseInt(req.params.petId);
            
            if (!customerId) {
                throw new AppError('Chỉ khách hàng mới có thể xóa thú cưng', 403);
            }

            const result = await this.customerService.deletePet(petId, customerId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    getPetMedicalHistory = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            const petId = parseInt(req.params.petId);
            const limit = parseInt(req.query.limit) || 10;

            const result = await this.customerService.getPetMedicalHistory(petId, customerId, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    getPetVaccinationHistory = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            const petId = parseInt(req.params.petId);
            const limit = parseInt(req.query.limit) || 10;

            const result = await this.customerService.getPetVaccinationHistory(petId, customerId, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    UpdatePassword = async (req, res, next) => {
        try {
            const customerId = req.user.MaKH;
            const { oldPassword, newPassword } = req.body;

            if (!customerId) {
                throw new AppError('Chỉ khách hàng mới có thể cập nhật mật khẩu', 403);
            }

            const result = await this.customerService.UpdatePassword(customerId, oldPassword, newPassword);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    // Staff-only endpoints
    getAnyPetMedicalHistory = async (req, res, next) => {
        try {
            const petId = parseInt(req.params.petId);
            const limit = parseInt(req.query.limit) || 100;

            const result = await this.customerService.getAnyPetMedicalHistory(petId, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    getAnyPetVaccinationHistory = async (req, res, next) => {
        try {
            const petId = parseInt(req.params.petId);
            const limit = parseInt(req.query.limit) || 100;

            const result = await this.customerService.getAnyPetVaccinationHistory(petId, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = CustomerController;
