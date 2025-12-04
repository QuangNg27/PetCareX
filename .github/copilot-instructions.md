# PetCareX AI Coding Assistant Instructions

## Project Overview
PetCareX is a comprehensive pet care management system with a SQL Server database backend and Node.js web server. The system manages customer loyalty programs, pet health records, veterinary services, and product sales with sophisticated business logic built into the database layer.

## Architecture Components

### Database Layer (`db/ScriptDB.sql`)
- **Core Entity**: SQL Server database with advanced features including partitioning, stored procedures, and complex triggers
- **Partitioning Strategy**: Tables partitioned by year using `pf_TheoNam` function for `Hoa_don`, `Kham_benh`, and `Tiem_phong` tables
- **Business Logic Location**: Critical business rules are implemented in database triggers and stored procedures, NOT in application code

### Web Server (`web/server/`)
- **Architecture**: Standard Node.js structure with MVC pattern
- **Database Connection**: Uses `mssql` package with connection pooling in `src/config/db.js`
- **Environment Variables**: Database credentials loaded via process.env (DB_USER, DB_PASSWORD, DB_HOST, DB_NAME)
- **Structure**: Empty placeholder directories for controllers, routes, services, repositories (ready for implementation)

## Critical Database Business Logic

### Customer Loyalty System
- **Three Tiers**: Cơ bản (Basic), Thân thiết (Loyal), VIP with ascending discount rates
- **Automatic Upgrades**: Customer tier updated automatically via `Update_HangKhachHang` procedure when spending thresholds are met
- **Loyalty Points**: Earned at 1 point per 50,000 VND spent, calculated in `Add_HoaDon` procedure

### Invoice Processing (`Add_HoaDon` Procedure)
```sql
-- Key business flow:
-- 1. Apply customer tier discount
-- 2. Validate inventory before sale
-- 3. Deduct inventory quantities
-- 4. Calculate loyalty points (1 per 50k VND)
-- 5. Update customer spending history
-- 6. Trigger tier upgrade check
```

### Data Integrity Enforcement
- **Age Validation**: Employees must be ≥18 years old (trigger)
- **Service Authorization**: Only veterinarians (`Bác sĩ`) can perform medical services
- **Work Assignment**: Staff can only provide services at branches where they're assigned during the service date
- **Business Hours**: Enforced at database level via CHECK constraints

## Development Patterns

### Database-First Approach
- **Stored Procedures**: Use for complex business operations (invoicing, pricing updates)
- **Table-Valued Parameters**: `TVP_SanPham` and `TVP_DichVu` for bulk operations
- **Triggers**: Handle business rule validation and automatic updates

### Error Handling Strategy
- Database throws custom errors with Vietnamese messages
- Application layer should catch and translate SQL exceptions
- Use transaction rollback for data consistency

### Key Naming Conventions
- **Tables**: Vietnamese names (e.g., `Khach_hang`, `Thu_cung`, `Hoa_don`)
- **Procedures**: English prefix + Vietnamese (e.g., `Update_HangKhachHang`, `Add_HoaDon`)
- **Foreign Keys**: Follow pattern `FK_[Table]_[Referenced]` (e.g., `FK_HD_Khach_hang`)

## Development Workflow

### Database Changes
1. Always update `ScriptDB.sql` with new schema changes
2. Test business logic in stored procedures before API implementation
3. Use partition-aware queries for date-based operations

### Server Development
1. Implement repository pattern in `repositories/` for database access
2. Keep business logic in database layer, not Node.js services
3. Use connection pooling from `config/db.js`

## Critical Files for AI Understanding
- `db/ScriptDB.sql`: Complete database schema and business logic
- `web/server/src/config/db.js`: Database connection configuration
- `web/server/package.json`: Project dependencies and scripts

## Vietnamese Business Terms
- `Khach_hang`: Customer
- `Thu_cung`: Pet  
- `Hoa_don`: Invoice
- `Dich_vu`: Service
- `San_pham`: Product
- `Kham_benh`: Medical examination
- `Tiem_phong`: Vaccination
- `Chi_nhanh`: Branch
- `Nhan_vien`: Employee

## API Structure & Business Flows

### Authentication & Authorization
- **JWT-based**: Customer and employee authentication with role-based access
- **Roles**: `Khách hàng`, `Bác sĩ`, `Bán hàng`, `Tiếp tân`, `Quản lý chi nhánh`, `Quản lý công ty`
- **Branch Validation**: Staff can only access services for branches they're assigned to

### Core API Patterns
- **Customer Registration**: `/api/auth/register` → Creates account and initial customer tier
- **Service Booking**: `/api/bookings/` → Validates branch services and staff availability
- **Invoice Processing**: Uses `Add_HoaDon` procedure for atomic transactions
- **Medical Records**: Only veterinarians can create/update examination and vaccination records

### Key Business Validations
- **Inventory Checks**: Automatic validation before product sales
- **Staff Assignment**: Verify employee works at branch on service date
- **Vaccination Packages**: Apply 5-15% discounts based on package duration
- **Loyalty Points**: Auto-calculation at 1 point per 50,000 VND

## Performance Considerations
- Use partition elimination in date range queries
- Leverage indexed views for complex reporting  
- Bulk operations should use table-valued parameters
- Connection pooling is configured for concurrent access

## Critical Dependencies
- **Required**: `express`, `mssql`, `jsonwebtoken`, `bcryptjs`, `joi`, `cors`, `helmet`
- **Development**: `nodemon`, `dotenv`
- **Environment Variables**: `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`, `JWT_SECRET`