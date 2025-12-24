const CompanyService = require('../services/companyServices');

class CompanyController {
    constructor() {
        this.companyService = new CompanyService();
    }

    getRevenueByBranch = async (req, res, next) => {
        try {
            const { year } = req.params;
            const result = await this.companyService.getRevenueByBranch(year);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getTotalRevenueByYear = async (req, res, next) => {
        try {
            const { year } = req.params;
            const result = await this.companyService.getTotalRevenueByYear(year);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getRevenueByServicesW6M = async (req, res, next) => {
        try {
            const result = await this.companyService.getRevenueByServicesW6M();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getAllPetsStats = async (req, res, next) => {
        try {
            const result = await this.companyService.getAllPetsStats();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getDogBreedsStats = async (req, res, next) => {
        try {
            const result = await this.companyService.getDogBreedsStats();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    getCatBreedsStats = async (req, res, next) => {
        try {
            const result = await this.companyService.getCatBreedsStats();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getMembershipStats = async (req, res, next) => {
        try {
            const result = await this.companyService.getMembershipStats();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getEmployeeStats = async (req, res, next) => {
        try {
            const result = await this.companyService.getEmployeeStats();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    addEmployee = async (req, res, next) => {
        try {
            const employeeData = req.body;
            const result = await this.companyService.addEmployee(employeeData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    updateEmployee = async (req, res, next) => {
        try {
            const { id } = req.params;
            const employeeData = req.body;
            const result = await this.companyService.updateEmployee(id, employeeData);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }   
    };

    deleteEmployee = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.companyService.deleteEmployee(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = CompanyController;