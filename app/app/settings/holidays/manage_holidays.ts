import { Field } from "@/components/dialog";
import {
  allAttendance,
  createAttendance,
  deleteAttendance,
  editAttendance,
  getAllEmpDD,
} from "@/service/attendance.api";
import { createHoliday, deleteHoliday, editHoliday, getAllHoliday } from "@/service/holidays.api";
import { useMutation, useQueries, useQuery, useQueryClient,UseQueryResult  } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

export function holidaysData() {
  const [openmultipul, setOpenmultipul] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();
  // const [employeedd, leavesData] = useQueries({
  //   queries: [
  //     {
  //       queryKey: ["employee_dd"],
  //       queryFn: getAllEmpDD,
  //     },
  //     {
  //       queryKey: ["attendance"],
  //       queryFn: allAttendance,
  //     },
  //   ],
  // });

  const holidayData = useQuery({
    queryKey: ["holiday"],
    queryFn: getAllHoliday,
  });

  const createAtdanceMutation = useMutation({
    mutationFn: createHoliday,
    onSuccess: () => {
      toast("Holiday created successfully");
      queryClient.invalidateQueries({ queryKey: ["holiday"] });
    },
    onError: () => toast("Failed to create holiday"),
  });

  const updateAtdanceMutation = useMutation({
    mutationFn: editHoliday,
    onSuccess: () => {
      toast("Attendance updated successfully");
      queryClient.invalidateQueries({ queryKey: ["holiday"] });
    },
    onError: () => toast("Failed to update holiday"),
  });
  
const isLoading = holidayData.isLoading;
  // updateAtdanceMutation.isLoading ||
  // createAtdanceMutation.isLoading ||
  

  const deleteEmpMutation = useMutation({
    mutationFn: deleteHoliday,
    onSuccess: () => {
      toast("Attendance deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["holiday"] });
    },
    onError: () => toast("Failed to delete holiday"),
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


  const basicFields: Field[] = [
    {
      name: "name",
      label: "Holiday name",
      type: "text",
      required: true,
    }
  ];

  const singleDay: Field[] = [
    { name: "date", label: "Holiday Date", type: "date", required: true },
   
  ];

  const multiDay: Field[] = [
    { name: "date", label: "Holiday Start Date", type: "date", required: true },
    { name: "endDate", label: "Holiday End Date", type: "date", required: true },
  ];

  const fields: Field[] = [
    ...basicFields,
    ...(openmultipul ? multiDay : singleDay)
  ];

  

  

  const myFormSchema = z
    .object({
      name: z.string().min(1, "name is required"),
      date: z.date({ required_error: "date required" }),
      endDate: z.date().optional(),
    })
    .refine((data) => !data.endDate || data.endDate > data.date, {
      message: "End date must be after start date",
      path: ["endDate"],
    });
  

  const attendanceList = holidayData.data || [];
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
    fields,
    handelUpdateSubmit,
    handelsubmit,
    selectedAttendance,
    myFormSchema,
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
