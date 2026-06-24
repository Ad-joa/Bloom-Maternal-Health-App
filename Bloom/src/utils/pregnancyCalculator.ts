export type PregnancyDetails = {
  weeks: number;
  days: number;
  trimester: 1 | 2 | 3;
  dueDate: string; // YYYY-MM-DD
  trimesterLabel: string;
  totalDays: number;
};

export const calculatePregnancyDetails = (lmpDateString: string): PregnancyDetails | null => {
  if (!lmpDateString) return null;

  const lmpDate = new Date(lmpDateString);
  if (isNaN(lmpDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lmpDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lmpDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const totalDays = diffDays < 0 ? 0 : diffDays;

  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;

  let trimester: 1 | 2 | 3 = 1;
  let trimesterLabel = 'First Trimester';
  if (weeks >= 28) {
    trimester = 3;
    trimesterLabel = 'Third Trimester';
  } else if (weeks >= 13) {
    trimester = 2;
    trimesterLabel = 'Second Trimester';
  }

  // Due date is standard 280 days (40 weeks) from LMP
  const dueDate = new Date(lmpDate.getTime());
  dueDate.setDate(dueDate.getDate() + 280);

  const year = dueDate.getFullYear();
  const month = String(dueDate.getMonth() + 1).padStart(2, '0');
  const date = String(dueDate.getDate()).padStart(2, '0');
  const dueDateString = `${year}-${month}-${date}`;

  return {
    weeks,
    days,
    trimester,
    dueDate: dueDateString,
    trimesterLabel,
    totalDays
  };
};
