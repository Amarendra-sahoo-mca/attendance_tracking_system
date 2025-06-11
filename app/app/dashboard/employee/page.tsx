"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { CalendarIcon, Pencil, Trash } from "lucide-react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import axios from "axios";
import { createEmployee, deleteEmployee, editEmployee, getAllEmp } from "@/service/employee.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TableComponent from "@/components/TanstackTable";
import { ColumnDef } from "@tanstack/react-table";
import DynamicDialogForm, { Field } from "@/components/dialog";
import { toast } from "sonner";
interface Inputs {
  name: string;
  email: string;
  DOJ: Date | undefined;
}
function Student() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
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
      header: "name",
      accessorKey: "name",
    },
    { header: "mail", accessorKey: "user.email" },
    { header: "date of join", accessorKey: "DOJ" },
    {
      header: "action",
      cell: ({row}) => (
        <div className="flex justify-center gap-2">
          <div className="h-8 w-8 rounded-full hover:bg-green-400 border border-gray-300 cursor-pointer flex items-center justify-center">
            <Pencil size={20} strokeWidth={1} onClick={
              () => {setOpenEdit(true); setSelectedStudent({...row.original, email:row.original.user.email});}
            } />
          </div>
          <div className="h-8 w-8 rounded-full hover:bg-red-400 border border-gray-300 cursor-pointer flex items-center justify-center" onClick={() => setOpenDelete(true)}>
            <Trash size={20} strokeWidth={1} 
            onClick={() => {
              setOpenDelete(true)
              setSelectedStudent({...row.original, email:row.original.user.email});
            }}
            />
          </div>
        </div>
      ),
    },
  ];

  const employeeData = useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmp,
  });

const queryClient = useQueryClient();

const createEmpMutation = useMutation({
  mutationFn: createEmployee,
  onSuccess: () => {
    toast("Employee created successfully");
    queryClient.invalidateQueries({ queryKey: ["employees"] }); // refresh list
  },
  onError: (error) => {
    toast("Failed to create employee");
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
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "xxx@gmail.com",
      required: true,
    },
    { name: "DOJ", label: "Date of Join", type: "date", required: true },
  ];

  const handleStudentSubmit: SubmitHandler<Inputs> = (data) => {
    createEmpMutation.mutate(data);
    reset();
    setOpenCreate(false);
  };
  const handleStudentEditSubmit: SubmitHandler<Inputs> = (data) => {
    editEmpMutation.mutate(data);
    reset();
    setOpenEdit(false);
  };
  const handleStudentdelete: SubmitHandler<Inputs> = () => {
    deleteEmpMutation.mutate(selectedStudent.id)
    setOpenDelete(false);
  };
  return (
    <div className="w-full ">
      <div className=" mx-9 my-2 w-[90%] flex justify-between items-end h-12   ">
        <h2>
          <b>Employes</b>
        </h2>
        <Button
          className="bg-primary cursor-pointer dark:text-white"
          onClick={() => setOpenCreate(true)}
        >
          + Add New Employe
        </Button>
      </div>
        {openCreate && <DynamicDialogForm
          open={openCreate}
          mode="form"
          setOpen={setOpenCreate}
          title="Add New Student"
          fields={studentFields}
          onSubmit={handleStudentSubmit}
        />}
        {openEdit && <DynamicDialogForm
          open={openEdit}
          mode="form"
          setOpen={setOpenEdit}
          title="Edit Student"
          fields={studentFields}
          defaultValues={selectedStudent}
          onSubmit={handleStudentEditSubmit}
        />}
        {openDelete && <DynamicDialogForm
          open={openDelete}
          mode="confirm"
          setOpen={setOpenDelete}
          title="Do You Want To delete The Student"
          onSubmit={handleStudentdelete}
        />}
      <div className="bdy h-40 mx-5 mt-5 w-[90%]">
        <TableComponent data={employeeData?.data || []} columns={columns} />
      </div>
    </div>
  );
}

export default Student;
