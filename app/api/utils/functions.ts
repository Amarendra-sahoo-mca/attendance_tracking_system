export function groupCount(data: any[], leaveCriteria: any[]) {
  const groupedCount = data.reduce((acc: Record<string, number>, item: any) => {
    const key = item.absence_type;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const result = leaveCriteria.map((type: any) => ({
    ...type,
    leaves_taken: groupedCount[type.type] || 0,  
  }));

  return result;
}
