export const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
export const ENDPOINTS = {
  STUDENT: "/employee",
  HOLIDAYS: "/holidays",
  ATTENDANCE :"/attendance",
  PROJECT :"/projects",
  DASHBOARD : "/holidays/dashboard"
}

export const PATHS = {
  EMP_PROFILE : "/app/employee",
  SETTINGS : '/app/settings',
}