"use client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import TableComponent from "@/components/TanstackTable";
import { ColumnDef } from "@tanstack/react-table";
import DynamicDialogForm from "@/components/dialog";
import { DynamicForm } from "@/components/form";
import { PATHS } from "@/constants/end_points";
import { ThreeDot } from "react-loading-indicators";
import PaginationControl from "@/components/dynamicPagination";
import {ProjectData} from './manage_Project';

// Utility function to format date from ISO string to DD-MM-YYYY
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function Project() {
  const {
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
     paginatedData,
    totalPages,
    setSelectedStudent,
    setCurrentPage
  } = ProjectData();

  const columns: ColumnDef<any>[] = [
    { header: "SL No", cell: ({ row }) => <span>{row.index + 1}</span> },
    {
      header: "name",
      accessorKey: "name",
    },
    { header: "cost", accessorKey: "cost" , cell:({row})=>(
      <div className="">
        &#8377;&nbsp;{row.original.cost?.toLocaleString()}
      </div>
    )},
    { header: "start date", accessorKey: "start_date", cell:({row})=>(
      <div className="">
        {formatDate(row.original.start_date)}
      </div>
    ) },
    { header: "end date", accessorKey: "end_date", cell:({row})=>(
      <div className="">
        {formatDate(row.original.end_date)}
      </div>
    ) },
    {
      header: "action",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <div className="h-6 w-6 rounded-full hover:bg-green-400 border border-gray-300 cursor-pointer flex items-center justify-center">
            <Pencil
              size={16}
              strokeWidth={2}
              onClick={(e: any) => {
                e.stopPropagation();
                setOpenEdit(true);
                setOpenForm(true);
                setSelectedStudent(row.original);
              }}
            />
          </div>
          <div className="h-6 w-6 rounded-full hover:bg-red-400 border border-gray-300 cursor-pointer flex items-center justify-center">
            <Trash
              size={16}
              strokeWidth={2}
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
          <b>Project</b>
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
          + Add New Project
        </Button>
      </div>
      {openForm && (
        <div className="w-[90%] ml-8 h-auto rounded-lg border-2 p-2 ">
          <DynamicForm
            fields={ProjectFields}
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
          data={paginatedData || []}
          columns={columns}
          
        />
        <PaginationControl
                  totalPages={totalPages}
                  onPageChange={(page: any) => setCurrentPage(page)}
                />
      </div>
    </div>
  );
}

export default Project;
