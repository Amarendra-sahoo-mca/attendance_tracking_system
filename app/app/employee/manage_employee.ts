import { Field } from "@/components/dialog";
import {
  createEmployee,
  deleteEmployee,
  editEmployee,
  getAllEmp,
} from "@/service/employee.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
export function employeeData() {
  interface Inputs {
    name: string;
    email: string;
    DOJ: Date | undefined;
  }
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmp,
  });

  const createEmpMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: (data) => {
      toast(data.message || "Employee created successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] }); // refresh list
    },
    onError: (error: any) => {
      console.log("Mutation error:", error);
      const message =
        error?.message ||
        error?.error?.driverError?.sqlMessage ||
        "Failed to create employee";
      toast(message);
    },
  });
  const editEmpMutation = useMutation({
    mutationFn: editEmployee,
    onSuccess: () => {
      toast("Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] }); // refresh list
    },
    onError: (error) => {
      toast("Failed to create employee");
    },
  });
  const deleteEmpMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      toast("Employee delete successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] }); // refresh list
    },
    onError: (error) => {
      toast("Failed to delete employee");
    },
  });

  const studentFields: Field[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Ex. Jhon Deo",
      required: true,
    },
    {
      name: "employee_id",
      label: "Employee Id",
      type: "text",
      placeholder: "ACPL@2021",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "xxx@gmail.com",
      required: true,
    },
    { name: "DOJ", label: "Date of Join", type: "date", required: true },
  ];

  const myFormSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    name: z.string().min(1, "Name is required"),
    employee_id: z.string().min(1, "Employee Id is required"),
    DOJ: z.preprocess(
      (val) => {
        if (typeof val === "string" || val instanceof Date) {
          const date = new Date(val);
          return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
      },
      z
        .date({
          required_error: "Date of joining is required",
          invalid_type_error: "Invalid date format",
        })
        .refine((date) => date <= new Date(), {
          message: "Date of joining must be in the past",
        })
    ),
  });

  const handleStudentSubmit: SubmitHandler<Inputs> = (data) => {
    createEmpMutation.mutate(data);

    reset();
    setOpenForm(false);
  };
  const handleStudentEditSubmit: SubmitHandler<Inputs> = (data) => {
    editEmpMutation.mutate({ ...data, id: selectedStudent.id });
    reset();
    setOpenForm(false);
  };
  const handleStudentdelete = (data: any) => {
    deleteEmpMutation.mutate(data.id);
    setOpenDelete(false);
  };

  return {
    isLoading,
    openForm,
    setOpenForm,
    setOpenEdit,
    studentFields,
    openEdit,
    handleStudentEditSubmit,
    handleStudentSubmit,
    selectedStudent,
    myFormSchema,
    openDelete,
    setOpenDelete,
    handleStudentdelete,
    data,
    setSelectedStudent,
  };
}
