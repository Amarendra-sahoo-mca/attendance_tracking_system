"use client";
import CountUp from "@/components/ui/count_up";
import { getOneEmp } from "@/service/employee.api";
import { useQuery } from "@tanstack/react-query";
import { url } from "inspector";
import { Filter } from "lucide-react";
import { useParams } from "next/navigation";
import { ThreeDot } from "react-loading-indicators";

export default function ProfilePage() {
  const params = useParams();
  const id = params.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employee_profile", id],
    queryFn: () => getOneEmp(String(id)),
    enabled: !!id, // prevents firing query until id is available
  });

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
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const cardClick = (type:string)=>{
    const responce = data.attendance.filter((item:any)=>item.absence_type == type);
    console.log(responce);
  }

  return (
    <>
      <div className="flex h-10/12 w-full  mt-4 gap-1">
        <div className="h-full w-88  ml-10 rounded-lg border-1 shadow-lg dark:bg-[#93898e11]">
          <div
            className="h-55 w-[90%] my-2 mx-auto overflow-hidden border-2 rounded-full shadow-lg bg-[#f7f7f7]"
            // style={{backgroundImage:"linear-gradient(140deg, #667eea 10%, #fff 80%)"}}
          >
            <img
              src="https://i.pinimg.com/736x/87/14/55/8714556a52021ba3a55c8e7a3547d28c.jpg"
              alt=""
              className="w-full scale-100 mt-4  "
            />
          </div>
          <div className="w-full h-[54.6%] pl-3 mt-2 text-center">
            <p className=" my-2 uppercase font-bold">{data.name}</p>
            <div className="bg-[#f8f9fa] p-2 flex w-[95%] gap-2 my-1.5 shadow-lg rounded-lg dark:bg-[#93898e42]"
            onClick={() => navigator.clipboard.writeText(data.employee_id)}
            >
              <div className="mt-2">🆔</div>
              <div className="text-left">
                <p className="text-sm">Employee ID</p>
                <p className="text-sm font-bold">{data.employee_id}</p>
              </div>
            </div>
            <div className="bg-[#f8f9fa] p-2 flex w-[95%] gap-2 my-1.5 shadow-lg rounded-lg dark:bg-[#93898e42]"
            onClick={() => navigator.clipboard.writeText(data.DOJ)}
            >
              <div className="mt-2">📅</div>
              <div className="text-left">
                <p className="text-sm text-left">Join Date</p>
                <p className="text-sm font-bold">{data.DOJ}</p>
              </div>
            </div>
            <div className="bg-[#f8f9fa] p-2 flex w-[95%] gap-1 my-1.5 shadow-lg rounded-lg dark:bg-[#93898e42]"
            onClick={() => navigator.clipboard.writeText(data.experience)}
            >
              <div className="mt-2 text-xl">⏱️</div>
              <div className="text-left">
                <p className="text-sm text-left">Experience</p>
                <p className="text-sm font-bold">{data.experience}</p>
              </div>
            </div>
            <div className="bg-[#f8f9fa] p-2 flex w-[95%] gap-2 my-1.5 overflow-hidden shadow-lg rounded-lg  dark:bg-[#93898e42]"
            onClick={() => navigator.clipboard.writeText(data.user.email)}
            >
              <div className="mt-2">✉️</div>
              <div className="text-left">
                <p className="text-sm text-left">Email</p>
                <p className="text-sm font-bold truncate max-w-[200px]">{data.user.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-2/3 w-full px-5 grid grid-cols-3 ">
          {data?.leave_info.map((item: any) => (
            <div
              key={item.id}
              className="h-25 w-[95%] border-t-1 border-l-1 py-1 px-2 shadow-lg dark:shadow-primary cursor-pointer rounded-lg"
              style={{
                backgroundImage: `linear-gradient(135deg, white 10%, ${item.theme} 80%`,
              }}
              onClick={()=>cardClick(item.type)}
            >
              <div className="h-1/2 ">
                <p className="text-2xl font-bold text-[#090909b8]">
                  {item.type}
                </p>
              </div>
              <div className="h-1/2 ">
                <p className="text-4xl text-[#090909b8] font-bold mr-2 text-right">
                  <CountUp
                    from={0}
                    to={item.leaves_taken}
                    separator=","
                    direction="up"
                    duration={0.5}
                    className="count-up-text font-bold text-4xl mt-3"
                  />
                  /{item.days}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
