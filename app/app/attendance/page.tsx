"use client";
import DynamicDialogForm from "@/components/dialog";
import { DynamicForm } from "@/components/form";
import TableComponent from "@/components/TanstackTable";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThreeDot } from "react-loading-indicators";
import PaginationControl from "@/components/dynamicPagination";
import { attendanceData } from "./manage_attendance";

function page() {
  const {
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
    createAtdanceMutation,
  } = attendanceData();
  const columns = [
    { header: "SL No", cell: ({ row }: any) => <span>{row.index + 1}</span> },
    {
      header: "employee",
      accessorKey: "employee.name",
    },
    { header: "absence type", accessorKey: "absence_type" },
    { header: "date", accessorKey: "start_date" },
    {
      header: "action",
      cell: ({ row }: any) => (
        <div className="flex justify-center gap-2">
          <div className="h-6 w-6 rounded-full hover:bg-green-400 border border-gray-300 cursor-pointer flex items-center justify-center">
            <Pencil
              size={16}
              strokeWidth={2}
              onClick={() => {
                setOpenEdit(true);
                setOpenForm(true);
                setSelectedAttendance({
                  ...row.original,
                  start_date: new Date(row.original.start_date),
                  end_date: row.original.end_date
                    ? new Date(row.original.end_date)
                    : new Date(),
                  employee: row.original.employee.name,
                });
                setOpenmultipul(!!row.original.end_date);
              }}
            />
          </div>
          <div className="h-6 w-6 rounded-full hover:bg-red-400 border border-gray-300 cursor-pointer flex items-center justify-center">
            <Trash
              size={16}
              strokeWidth={2}
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

  if (
    isLoading 
  ) {
    return (
      <div className="flex h-[90%] w-full mt-4 items-center justify-center">
        <ThreeDot variant="bounce" color="#3139cc" size="medium" text="" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-9 my-2 w-[90%]">
        <div className="w-full flex justify-between mb-2 items-end h-12">
          <h2>
            <b>Attendance</b>
          </h2>
          {openForm ? (
            <div className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="check"
                className="h-4 w-4"
                checked={openmultipul}
                onChange={() => setOpenmultipul(!openmultipul)}
              />
              <label htmlFor="check" className="ml-2 cursor-pointer">
                Multiple Leaves
              </label>
            </div>
          ) : (
            <Button
              className="bg-primary cursor-pointer dark:text-white"
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
          <div className="w-full h-auto rounded-lg border-2 p-2">
            <DynamicForm
              fields={openEdit ? editFields : fields}
              onSubmit={openEdit ? handelUpdateSubmit : handelsubmit}
              onCancel={() => setOpenForm(false)}
              submitButtonLabel={openEdit ? "Update" : "Save"}
              defaultValues={openEdit ? selectedAttendance : undefined}
              schema={openEdit ? myeditFormSchema : myFormSchema}
            />
          </div>
        )}

        {openDelete && (
          <DynamicDialogForm
            open={openDelete}
            mode="confirm"
            setOpen={setOpenDelete}
            title="Do You Want To Delete The Attendance?"
            defaultValues={{ id: selectedAttendance.id }}
            onSubmit={handleStudentdelete}
          />
        )}
      </div>

      <div className="w-[90%] mx-5 mt-5">
        <TableComponent data={paginatedData} columns={columns} />
        <PaginationControl
          totalPages={totalPages}
          onPageChange={(page: any) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default page;
