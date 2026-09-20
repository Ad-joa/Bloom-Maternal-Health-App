export const parseDateSafely = (dateStr: string): Date => {
  if (!dateStr) return new Date(NaN);
  
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // DD/MM/YYYY
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  } else if (dateStr.includes('-')) {
    const p2 = dateStr.split('T')[0].split('-');
    if (p2.length === 3) return new Date(parseInt(p2[0]), parseInt(p2[1]) - 1, parseInt(p2[2]));
  }
  
  return new Date(dateStr);
};

export const getDaysUntilDue = (dueDateStr: string): number => {
  if (!dueDateStr) return 0;
  try {
    const due = parseDateSafely(dueDateStr);
    if (isNaN(due.getTime())) return 0;
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  } catch (e) {
    return 0;
  }
};

export const getWeeksPregnant = (dueDateStr: string): number => {
  if (!dueDateStr) return 0;
  try {
    const due = parseDateSafely(dueDateStr);
    if (isNaN(due.getTime())) return 0;
    // Average pregnancy is 280 days (40 weeks)
    // If due date is X days away, then days pregnant = 280 - X
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 280) return 0; // Invalid or too far in future
    if (diffDays < 0) return 40;  // Past due
    
    const daysPregnant = 280 - diffDays;
    return Math.floor(daysPregnant / 7);
  } catch (e) {
    return 0;
  }
};

export const getCurrentTrimester = (dueDateStr: string): number => {
  const weeks = getWeeksPregnant(dueDateStr);
  if (weeks <= 12) return 1;
  if (weeks <= 26) return 2;
  return 3;
};

export const getTrimesterName = (trimester: number): string => {
  switch (trimester) {
    case 1: return "First Trimester";
    case 2: return "Second Trimester";
    case 3: return "Third Trimester";
    default: return "Trimester";
  }
};
