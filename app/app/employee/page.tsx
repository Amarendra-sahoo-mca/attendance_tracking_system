"use client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import TableComponent from "@/components/TanstackTable";
import { ColumnDef } from "@tanstack/react-table";
import DynamicDialogForm from "@/components/dialog";
import { DynamicForm } from "@/components/form";
import { PATHS } from "@/constants/end_points";
import { ThreeDot } from "react-loading-indicators";
import { employeeData } from "./manage_employee";

function Student() {
  const {
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
  } = employeeData();

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
            submitButtonLabel={openEdit ? "update" : "save"}
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
