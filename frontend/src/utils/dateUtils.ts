export const getDaysUntilDue = (dueDateStr: string): number => {
  if (!dueDateStr) return 0;
  try {
    const due = new Date(dueDateStr);
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
    const due = new Date(dueDateStr);
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
