"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as z from "zod";
import { Pencil, Trash } from "lucide-react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  createEmployee,
  deleteEmployee,
  editEmployee,
  getAllEmp,
} from "@/service/employee.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TableComponent from "@/components/TanstackTable";
import { ColumnDef } from "@tanstack/react-table";
import DynamicDialogForm, { Field } from "@/components/dialog";
import { toast } from "sonner";
import { DynamicForm } from "@/components/form";
import { PATHS } from "@/constants/end_points";
import { ThreeDot } from "react-loading-indicators";
interface Inputs {
  name: string;
  email: string;
  DOJ: Date | undefined;
}
function Student() {
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

  const columns: ColumnDef<any>[] = [
    { header: "SL No", cell: ({ row }) => <span>{row.index + 1}</span> },
    {
      header: "employee id",
      accessorKey: "employee_id",
    },
    {
      header: "name",
      accessorKey: "name",
    },
    { header: "mail", accessorKey: "user.email" },
    { header: "date of join", accessorKey: "DOJ" },
    {
      header: "action",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <div className="h-6 w-6 rounded-full hover:bg-green-400 border border-gray-300 cursor-pointer flex items-center justify-center">
            <Pencil
              size={16}
              strokeWidth={1}
              onClick={(e: any) => {
                e.stopPropagation();
                setOpenEdit(true);
                setOpenForm(true);
                setSelectedStudent({
                  ...row.original,
                  email: row.original.user.email,
                });
              }}
            />
          </div>
          <div className="h-6 w-6 rounded-full hover:bg-red-400 border border-gray-300 cursor-pointer flex items-center justify-center">
            <Trash
              size={16}
              strokeWidth={1}
              onClick={(e: any) => {
                e.stopPropagation();
                setOpenDelete(true);
                setSelectedStudent(row.original);
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  const {data,isLoading} = useQuery({
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
    DOJ:  z.preprocess(
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
    editEmpMutation.mutate({...data,id:selectedStudent.id});
    reset();
    setOpenForm(false);
  };
  const handleStudentdelete = (data: any) => {
    deleteEmpMutation.mutate(data.id);
    setOpenDelete(false);
  };
  if (isLoading)
    return (
      <div className="flex h-10/12 w-full mt-4 items-center justify-center">
        <ThreeDot
          variant="bounce"
          color="#3139cc"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    );
    
  return (
    <div className="w-full ">
      <div className=" mx-9 my-2 w-[90%] flex justify-between items-end h-12   ">
        <h2>
          <b>Employes</b>
        </h2>
        <Button
          className={`bg-primary cursor-pointer dark:text-white ${
            openForm && "hidden"
          }`}
          onClick={() => {
            setOpenForm(true);
            setOpenEdit(false);
          }}
        >
          + Add New Employe
        </Button>
      </div>
      {openForm && (
        <div className="w-[90%] ml-8 h-auto rounded-lg border-2 p-2 ">
          <DynamicForm
            fields={studentFields}
            onSubmit={openEdit ? handleStudentEditSubmit : handleStudentSubmit}
            defaultValues={openEdit && selectedStudent}
            submitButtonLabel={openEdit ? 'update':'save'}
            onCancel={() => setOpenForm(false)}
            schema={myFormSchema}
          />
        </div>
      )}
      
      {openDelete && (
        <DynamicDialogForm
          open={openDelete}
          mode="confirm"
          setOpen={setOpenDelete}
          title="Do You Want To delete The Employee"
          defaultValues={{ id: selectedStudent.id }}
          onSubmit={handleStudentdelete}
        />
      )}
      <div className="bdy h-40 mx-5 mt-5 w-[90%]">
        <TableComponent
          data={data || []}
          columns={columns}
          navigateTo={(row) => `${PATHS.EMP_PROFILE}/${row.id}`}
        />
      </div>
    </div>
  );
}

export default Student;
