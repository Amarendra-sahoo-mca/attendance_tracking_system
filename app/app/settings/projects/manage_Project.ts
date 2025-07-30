import { Field } from "@/components/dialog";

import { createProject, deleteProject, editProject, getAllProject } from "@/service/project.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
export function ProjectData() {
  interface Inputs {
    name: string;
    cost: string;
    start_date: Date | undefined;
    end_date: Date | undefined;
  }
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const {
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const employeeApi = useQuery({
    queryKey: ["project"],
    queryFn: getAllProject,
  });
  const isLoading = employeeApi.isLoading;
  const data = employeeApi.data;
  const createEmpMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      toast(data.message || "Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["project"] }); // refresh list
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
    mutationFn: editProject,
    onSuccess: () => {
      toast("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["project"] }); // refresh list
    },
    onError: (error) => {
      toast("Failed to create employee");
    },
  });
  const deleteEmpMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast("Project delete successfully");
      queryClient.invalidateQueries({ queryKey: ["project"] }); // refresh list
    },
    onError: (error) => {
      toast("Failed to delete employee");
    },
  });

  const ProjectFields: Field[] = [
    {
      name: "name",
      label: "Project Name",
      type: "text",
      placeholder: "Facebook",
      required: true,
    },
    {
      name: "start_date",
      label: "Project start date",
      type: "date",
      placeholder: "pick your start date",
      required: true,
    },
    {
      name: "end_date",
      label: "Project end date",
      type: "date",
      placeholder: "pick your end date",
      required: false,
    },
    {
      name: "cost",
      label: "Project Cost",
      type: "text",
      placeholder: "20",
      required: true,
    },
    
  ];

  const myFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    cost: z.number().min(1, "Project cost is required"),
    start_date: z.preprocess(
      (val) => {
        if (typeof val === "string" || val instanceof Date) {
          const date = new Date(val);
          return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
      },
      z
        .date({
          required_error: "Project start date is required",
          invalid_type_error: "Invalid date format",
        })
        // .refine((date) => date <= new Date(), {
        //   message: "Date of joining must be in the past",
        // })
    ),
    end_date: z.preprocess(
      (val) => {
        if (typeof val === "string" || val instanceof Date) {
          const date = new Date(val);
          return isNaN(date.getTime()) ? undefined : date;
        }
        return undefined;
      },
      z
        .date({
          invalid_type_error: "Invalid date format",
        })
        // .refine((date) => date <= new Date(), {
        //   message: "Date of joining must be in the past",
        // })
    ),
  }).refine((data) => !data.end_date || data.end_date > data.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  });;

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

  const attendanceList = data || [];
  const itemsPerPage = 10;
  const totalPages = Math.ceil(attendanceList.length / itemsPerPage);

  const paginatedData = attendanceList.length > 0  && attendanceList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return {
    isLoading,
    openForm,
    setOpenForm,
    setOpenEdit,
    ProjectFields,
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
     paginatedData,
    totalPages,
    setCurrentPage
  };
}
