export function groupCount(data: any[], leaveCriteria: any[]) {
  const groupedCount = data.reduce((acc: Record<string, number>, item: any) => {
    const key = item.absence_type;
    
    if (item.end_date != "") {
      const end_date = new Date(item.end_date);
      const start_date = new Date(item.start_date);
      // Get time difference in milliseconds
      const diffTime = Math.abs(end_date.getTime() - start_date.getTime());

      // Convert milliseconds to days
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      acc[key] = (acc[key] || 0) + diffDays;
    } else if(item.is_half_day) {
      acc[key] = (acc[key] || 0) + 0.5;
    } else {
      acc[key] = (acc[key] || 0) + 1;
    }

    return acc;
  }, {});
  let leavesum = 0;
  let totalsum = 0;

  const result = leaveCriteria.map((type: any) => {
    const leaves_taken = groupedCount[type.type] ?? 0;
    leavesum += leaves_taken;
    totalsum += type.days;
    return {
      ...type,
      leaves_taken,
    };
  });
  const totaldata = {
    id: 0,
    type: "Total",
    leaves_taken: leavesum,
    days: totalsum,
    theme: "#ff0",
  };
  return [...result, totaldata];
}
