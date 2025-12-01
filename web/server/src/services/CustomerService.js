const CustomerRepository = require('../repositories/CustomerRepository');
const PetRepository = require('../repositories/PetRepository');
const { AppError } = require('../middleware/errorHandler');

class CustomerService {
    constructor() {
        this.customerRepo = new CustomerRepository();
        this.petRepo = new PetRepository();
    }

    async getProfile(customerId) {
        const profile = await this.customerRepo.getCustomerProfile(customerId);
        if (!profile) {
            throw new AppError('Không tìm thấy thông tin khách hàng', 404);
        }

        return {
            success: true,
            data: profile
        };
    }

    async updateProfile(customerId, profileData) {
        const updated = await this.customerRepo.updateCustomerProfile(customerId, profileData);
        if (!updated) {
            throw new AppError('Cập nhật thông tin thất bại', 400);
        }

        return {
            success: true,
            message: 'Cập nhật thông tin thành công'
        };
    }

    async getMembershipSpending(customerId) {
        const spending = await this.customerRepo.getCustomerSpending(customerId);

        return {
            success: true,
            data: spending
        };
    }

    async getLoyaltyHistory(customerId, limit = 10) {
        const history = await this.customerRepo.getLoyaltyHistory(customerId, limit);

        return {
            success: true,
            data: history
        };
    }

    async searchCustomers(searchTerm, limit = 20) {
        const customers = await this.customerRepo.searchCustomers(searchTerm, limit);

        return {
            success: true,
            data: customers
        };
    }

    // Pet-related methods
    async getPets(customerId) {
        const pets = await this.petRepo.getCustomerPets(customerId);

        return {
            success: true,
            data: pets
        };
    }

    async createPet(customerId, petData) {
        const result = await this.petRepo.createPet(customerId, petData);

        return {
            success: true,
            message: 'Thêm thú cưng thành công',
            data: result
        };
    }

    async updatePet(petId, customerId, petData) {
        // Check ownership
        const isOwner = await this.petRepo.checkPetOwnership(petId, customerId);
        if (!isOwner) {
            throw new AppError('Bạn không có quyền sửa thông tin thú cưng này', 403);
        }

        const updated = await this.petRepo.updatePet(petId, petData);
        if (!updated) {
            throw new AppError('Cập nhật thông tin thú cưng thất bại', 400);
        }

        return {
            success: true,
            message: 'Cập nhật thông tin thú cưng thành công'
        };
    }

    async deletePet(petId, customerId) {
        // Check ownership
        const isOwner = await this.petRepo.checkPetOwnership(petId, customerId);
        if (!isOwner) {
            throw new AppError('Bạn không có quyền xóa thú cưng này', 403);
        }

        const deleted = await this.petRepo.deletePet(petId);
        if (!deleted) {
            throw new AppError('Xóa thú cưng thất bại', 400);
        }

        return {
            success: true,
            message: 'Xóa thú cưng thành công'
        };
    }

    async getPetMedicalHistory(petId, limit = 10) {
        const history = await this.petRepo.getPetMedicalHistory(petId, limit);
        const medicines = await this.petRepo.getPetMedicineBasedOnTreatment(history.map(h => h.MaKB));

        const historyWithMedicines = history.map(record => {
            const recordMedicines = medicines
                .filter(med => med.MaKB === record.MaKB)
                .map(med => {
                // Bỏ MaKB khỏi medicine object
                const { MaKB, ...medicineWithoutMaKB } = med;
                return medicineWithoutMaKB;
                });
                
            return {
                ...record,
                ThuocDaDung: recordMedicines
            };
        });
    
        return {
            success: true,
            data: historyWithMedicines
        };
    }

    async getPetVaccinationHistory(petId, limit = 10) {
        const history = await this.petRepo.getPetVaccinationHistory(petId, limit);
        const vaccines = await this.petRepo.getPetVaccineBasedOnVaccination(history.map(h => h.MaTP));

        const historyWithVaccines = history.map(record => {
            const recordVaccines = vaccines
                .filter(vac => vac.MaTP === record.MaTP)
                .map(vac => {
                // Bỏ MaTP khỏi vaccine object
                const { MaTP, ...vaccineWithoutMaTP } = vac;
                return vaccineWithoutMaTP;
                });
                
            return {
                ...record,
                Vaccines: recordVaccines
            };
        });

        return {
            success: true,
            data: historyWithVaccines
        };
    }
}

module.exports = CustomerService;