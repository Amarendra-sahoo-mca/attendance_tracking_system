export function parseHolidayRange(date:string, endDate:string) {
  const dates = [];
  const start = new Date(date);
  const end = endDate ? new Date(endDate) : new Date(date);
  
  while (start <= end) {
    dates.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }

  return dates;
}

export function getRemainingWorkingDays(holidays:any[]) {
  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31); // Dec 31

  const allHolidayDates:any[] = [];

  // Flatten all holidays (single and multi-day)
  holidays.forEach((holiday) => {
    const holidayDates = parseHolidayRange(holiday.date, holiday.endDate);
    allHolidayDates.push(...holidayDates.map(d => d.toDateString()));
  });

  const holidaySet = new Set(allHolidayDates);
  let date = new Date(today);
  let workingDays = 0;

  while (date <= endOfYear) {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    const dateNum = date.getDate();

    const is2ndOr4thSaturday =
      day === 6 &&
      ((dateNum > 7 && dateNum <= 14) || (dateNum > 21 && dateNum <= 28));

    const isHoliday = holidaySet.has(date.toDateString());

    if (day !== 0 && !is2ndOr4thSaturday && !isHoliday) {
      workingDays++;
    }

    date.setDate(date.getDate() + 1);
  }

  return workingDays;
}


export function getWorkingDaysIn2025(holidayList:any[]) {
  const year = new Date().getFullYear();
  const holidaysByMonth: { [key: number]: Set<number> } = {};
 const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Step 1: Convert holidays into month-wise map
  holidayList.forEach((holiday) => {
    const start = new Date(holiday.date);
    const end = holiday.endDate ? new Date(holiday.endDate) : start;

    let current = new Date(start);
    while (current <= end) {
      const month = current.getMonth() + 1;
      const day = current.getDate();

      if (!holidaysByMonth[month]) holidaysByMonth[month] = new Set();
      holidaysByMonth[month].add(day);

      current.setDate(current.getDate() + 1);
    }
  });

  const workingDays: { [key: string]: number } = {};

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const sundays = [];
    const saturdays = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0) sundays.push(day); // Sunday
      if (dayOfWeek === 6) saturdays.push(day); // Saturday
    }

    // Only 2nd and 4th Saturdays
    const secondAndFourthSaturdays = [saturdays[1], saturdays[3]].filter(Boolean);
    const allSundays = sundays;

    const holidays = holidaysByMonth[month + 1] || new Set();

    const nonWorkingDays = new Set([
      ...allSundays,
      ...secondAndFourthSaturdays,
      ...holidays
    ]);

    const totalWorkingDays = daysInMonth - nonWorkingDays.size;
     workingDays[monthNames[month]] = totalWorkingDays;
  }

  return Object.entries(workingDays);
}



// console.log(getWorkingDaysIn2025(Holidays));
export function getDuration(fromDateStr:string) {
  const fromDate = new Date(fromDateStr);
  const toDate = new Date();

  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years}y ${months}m ${days}d`;
}

