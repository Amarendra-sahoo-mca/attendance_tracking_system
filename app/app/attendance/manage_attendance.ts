import { Field } from "@/components/dialog";
import {
  allAttendance,
  createAttendance,
  deleteAttendance,
  editAttendance,
  getAllEmpDD,
} from "@/service/attendance.api";
import { useMutation, useQueries, useQueryClient,UseQueryResult  } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

export function attendanceData() {
  const [openmultipul, setOpenmultipul] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();
  const [employeedd, leavesData] = useQueries({
    queries: [
      {
        queryKey: ["employee_dd"],
        queryFn: getAllEmpDD,
      },
      {
        queryKey: ["attendance"],
        queryFn: allAttendance,
      },
    ],
  });

  const createAtdanceMutation = useMutation({
    mutationFn: createAttendance,
    onSuccess: () => {
      toast("Attendance created successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: () => toast("Failed to create attendance"),
  });

  const updateAtdanceMutation = useMutation({
    mutationFn: editAttendance,
    onSuccess: () => {
      toast("Attendance updated successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: () => toast("Failed to update attendance"),
  });
  
const isLoading = leavesData.isLoading;
  // updateAtdanceMutation.isLoading ||
  // createAtdanceMutation.isLoading ||
  

  const deleteEmpMutation = useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      toast("Attendance deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: () => toast("Failed to delete attendance"),
  });

  const handelsubmit = (data: any) => {
    createAtdanceMutation.mutate(data);
    setOpenForm(false);
  };

  const handelUpdateSubmit = (data: any) => {
    updateAtdanceMutation.mutate(data);
    setOpenForm(false);
  };

  const handleStudentdelete = (data: any) => {
    deleteEmpMutation.mutate(data.id);
    setOpenDelete(false);
  };

  const employeeOptions = employeedd?.data?.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));

  const basicFields: Field[] = [
    {
      name: "employee",
      label: "Employee",
      type: "searchable-select",
      required: true,
      options: employeeOptions,
    },
    {
      name: "description",
      label: "Leave Description",
      type: "text",
      required: true,
    },
  ];

  const singleDay: Field[] = [
    { name: "start_date", label: "Leave Date", type: "date", required: true },
    {
      name: "is_half_day",
      label: "Half Day",
      type: "checkbox",
      required: false,
    },
  ];

  const multiDay: Field[] = [
    { name: "start_date", label: "Start Date", type: "date", required: true },
    { name: "end_date", label: "End Date", type: "date", required: true },
  ];

  const fields: Field[] = [
    ...basicFields,
    ...(openmultipul ? multiDay : singleDay),
    {
      name: "absence_type",
      label: "Absence Type",
      type: "select",
      required: true,
      options: [
        { label: "Vacation", value: "Vacation" },
        { label: "Sickness", value: "Sickness" },
        { label: "Maternity or Paternity", value: "Maternity or Paternity" },
        { label: "Compassionate", value: "Compassionate" },
        { label: "TOIL", value: "TOIL" },
        { label: "Work From Home", value: "Work From Home" },
        { label: "Bank Holiday", value: "Bank Holiday" },
      ],
    },
  ];

  const editFields: Field[] = [
    {
      name: "employee",
      label: "Employee name",
      type: "text",
      required: false,
      disabled: true,
    } as Field,
    ...fields.slice(1),
  ];

  const myeditFormSchema = z
    .object({
      employee: z.string().min(1, "Employee is not required"),
      absence_type: z.string().min(1, "Absence Type is required"),
      description: z.string().min(1, "Leave Description is required"),
      start_date: z.date({ required_error: "Start date required" }),
      end_date: z.date().optional(),
    })
    .refine((data) => !data.end_date || data.end_date > data.start_date, {
      message: "End date must be after start date",
      path: ["end_date"],
    });

  const myFormSchema = z
    .object({
      employee: z.number().min(1, "Employee is required"),
      description: z.string().min(1, "Leave Description is required"),
      absence_type: z.string().min(1, "Absence Type is required"),
      start_date: z.date({ required_error: "Start date required" }),
      end_date: z.date().optional(),
    })
    .refine((data) => !data.end_date || data.end_date > data.start_date, {
      message: "End date must be after start date",
      path: ["end_date"],
    });
  

  const attendanceList = leavesData.data || [];
  const itemsPerPage = 10;
  const totalPages = Math.ceil(attendanceList.length / itemsPerPage);

  const paginatedData = attendanceList.length > 0  && attendanceList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    isLoading,
    openForm,
    openmultipul,
    setOpenmultipul,
    setOpenForm,
    setOpenEdit,
    openEdit,
    editFields,
    fields,
    handelUpdateSubmit,
    handelsubmit,
    selectedAttendance,
    myFormSchema,
    myeditFormSchema,
    openDelete,
    setOpenDelete,
    handleStudentdelete,
    setCurrentPage,
    setSelectedAttendance,
    paginatedData,
    totalPages,
    updateAtdanceMutation,
    createAtdanceMutation
  };
}
