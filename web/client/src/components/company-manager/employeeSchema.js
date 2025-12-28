import { z } from "zod";

export const employeeSchema = z
  .object({
    fullName: z.string().min(1, "Tên nhân viên không được để trống").default(""),
    gender: z.enum(["Nam", "Nữ"], "Vui lòng chọn giới tính").default(""),
    dob: z.string().min(1, "Ngày sinh không được để trống").default(""),
    entryDate: z.string().min(1, "Ngày vào làm không được để trống").default(""),
    role: z.string().min(1, "Vui lòng chọn chức vụ").default(""),
    branch: z.string().min(1, "Vui lòng chọn chi nhánh").default(""),
    salary: z
      .number({ invalid_type_error: "Lương phải là số" })
      .positive("Lương phải lớn hơn 0"),
  })
  .refine((data) => new Date(data.dob) < new Date(data.entryDate), {
    message: "Ngày sinh phải trước ngày vào làm",
    path: ["entryDate"], 
  });
