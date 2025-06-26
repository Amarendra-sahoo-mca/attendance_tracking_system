"use client";
import DynamicDialogForm, { Field } from "@/components/dialog";
import { DynamicForm } from "@/components/form";
import TableComponent from "@/components/TanstackTable";
import {
  allAttendance,
  createAttendance,
  deleteAttendance,
  editAttendance,
  getAllEmpDD,
} from "@/service/attendance.api";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { ThreeDot } from "react-loading-indicators";

function page() {
  const [openmultipul, setOpenmultipul] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);

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
  const isLoading = leavesData.isLoading;
  const columns: ColumnDef<any>[] = [
    { header: "SL No", cell: ({ row }) => <span>{row.index + 1}</span> },
    {
      header: "employee",
      accessorKey: "employee.name",
    },
    { header: "absence type", accessorKey: "absence_type" },
    { header: "date", accessorKey: "start_date" },
    {
      header: "action",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <div className="h-6 w-6 rounded-full hover:bg-green-400 border border-gray-300 cursor-pointer flex items-center justify-center">
            <Pencil
              size={16}
              strokeWidth={1}
              onClick={() => {
                setOpenEdit(true);
                setOpenForm(true);
                setSelectedAttendance({
                  ...row.original,
                  employee: row.original.employee.name,
                });
                setOpenmultipul(!!row.original.end_date);
              }}
            />
          </div>
          <div className="h-6 w-6 rounded-full hover:bg-red-400 border border-gray-300 cursor-pointer flex items-center justify-center">
            <Trash
              size={16}
              strokeWidth={1}
              onClick={() => {
                setOpenDelete(true);
                setSelectedAttendance(row.original);
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  const createAtdanceMutation = useMutation({
    mutationFn: createAttendance,
    onSuccess: () => {
      toast("attendance created successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance"] }); // refresh list
    },
    onError: (error) => {
      toast("Failed to create attendance");
    },
  });
  const updateAtdanceMutation = useMutation({
    mutationFn: editAttendance,
    onSuccess: () => {
      toast("attendance updated successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance"] }); // refresh list
    },
    onError: (error) => {
      toast("Failed to create attendance");
    },
  });
  const deleteEmpMutation = useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      toast("Attendance delete successfully");
      queryClient.invalidateQueries({ queryKey: ["attendance"] }); // refresh list
    },
    onError: (error) => {
      toast("Failed to delete attendance");
    },
  });

  const handelsubmit = (data: any) => {
    createAtdanceMutation.mutate(data);
  };
  const handelUpdateSubmit = (data: any) => {
    updateAtdanceMutation.mutate(data);
  };

  const handleStudentdelete = (data: any) => {
    deleteEmpMutation.mutate(data.id);
    setOpenDelete(false);
  };

  const data = employeedd?.data?.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const besic_fields: Field[] = [
    {
      name: "employee",
      label: "Employee",
      type: "searchable-select",
      required: true,
      options: data,
    },
    {
      name: "description",
      label: "Leave Description",
      type: "text",
      required: true,
    },
  ];
  const singleday: Field[] = [
    { name: "start_date", label: "Leave Date", type: "date", required: true },
    {
      name: "is_half_day",
      label: "Half Day",
      type: "checkbox",
      required: false,
    },
  ];
  const multiday: Field[] = [
    { name: "start_date", label: "Start Date", type: "date", required: true },
    { name: "end_date", label: "End Date", type: "date", required: true },
  ];

  const fields: Field[] = [
    ...besic_fields,
    ...(openmultipul ? multiday : singleday),
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
      label: "Employee",
      type: "text",
      required: true,
      disabled: true,
    } as Field,
    ...fields.slice(1),
  ];
  const myFormSchema = z
    .object({
      employee: z.number().min(1, "Employee is required"),
      description: z.string().min(1, "Leave Description is required"),
      absence_type: z.string().min(1, "Absence Type is required"),
      start_date: z.date({
        required_error: "Leave Date is required",
        invalid_type_error: "Invalid date format",
      }),
      end_date: z
        .date({
          invalid_type_error: "Invalid end date",
        })
        .optional(),
    })
    .refine(
      (data) => {
        if (!data.end_date) return true;
        return data.end_date > data.start_date;
      },
      {
        path: ["end_date"],
        message: "End date must be after start date",
      }
    );
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
      <div className=" mx-9 my-2 w-[90%]">
        <div className=" w-full flex justify-between mb-2 items-end h-12 ">
          <h2>
            <b>Attendance</b>
          </h2>
          {openForm ? (
            <div className="flex items-center cursor-pointer ">
              <input
                type="checkbox"
                id="check"
                className="h-4 w-4  cursor-pointer"
                onChange={() => {
                  setOpenmultipul(!openmultipul);
                }}
                checked={openmultipul}
              />
              <label htmlFor="check" className="cursor-pointer">
                multipul Leaves
              </label>
            </div>
          ) : (
            <Button
              className={`bg-primary cursor-pointer dark:text-white ${
                openForm && "hidden"
              }`}
              onClick={() => {
                setOpenForm(true);
                setOpenEdit(false);
              }}
            >
              + Add New Leave
            </Button>
          )}
        </div>
        {openForm && (
          <div className="w-full h-auto rounded-lg border-2 p-2 ">
            <DynamicForm
              fields={openEdit ? editFields : fields}
              onSubmit={openEdit ? handelUpdateSubmit : handelsubmit}
              onCancel={() => setOpenForm(false)}
              submitButtonLabel={openEdit ? "update" : "save"}
              defaultValues={openEdit && selectedAttendance}
              schema={myFormSchema}
            />
          </div>
        )}
        {openDelete && (
          <DynamicDialogForm
            open={openDelete}
            mode="confirm"
            setOpen={setOpenDelete}
            title="Do You Want To Delete The Attendance"
            defaultValues={{ id: selectedAttendance.id }}
            onSubmit={handleStudentdelete}
          />
        )}
      </div>
      <div className="w-[90%] mx-5 h-40 mt-5 ">
        <TableComponent data={leavesData?.data || []} columns={columns} />
        <Pagination className="flex justify-end">
        <PaginationContent >
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      </div>
      <div className="">
      
      </div>
    </div>
  );
}

export default page;
