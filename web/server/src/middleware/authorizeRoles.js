const { USER_ROLES, ROLE_GROUPS, ERROR_MESSAGES } = require('../config/constants');
const { RESPONSE_FORMAT } = require('../config/app');

// Middleware to authorize specific roles
const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json(
                    RESPONSE_FORMAT.error(ERROR_MESSAGES.UNAUTHORIZED, 401)
                );
            }

            const userRole = req.user.role;
            
            // Check if user role is in allowed roles
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json(
                    RESPONSE_FORMAT.error(
                        `Chỉ ${allowedRoles.join(', ')} mới có quyền truy cập`,
                        403
                    )
                );
            }

            next();
        } catch (error) {
            res.status(500).json(
                RESPONSE_FORMAT.error(ERROR_MESSAGES.SERVER_ERROR, 500)
            );
        }
    };
};

// Helper function to check if user has manager role
const isManager = (req) => {
    return ROLE_GROUPS.MANAGERS.includes(req.user?.role);
};

// Helper function to check if user is company manager
const isCompanyManager = (req) => {
    return req.user?.role === USER_ROLES.COMPANY_MANAGER;
};

// Helper function to check if user is branch manager
const isBranchManager = (req) => {
    return req.user?.role === USER_ROLES.BRANCH_MANAGER;
};

// Helper function to check if user is medical staff
const isMedicalStaff = (req) => {
    return ROLE_GROUPS.MEDICAL_STAFF.includes(req.user?.role);
};

module.exports = {
    authorizeRoles,
    isManager,
    isCompanyManager,
    isBranchManager,
    isMedicalStaff
};