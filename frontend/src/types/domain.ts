export type ActivityStatus = "PENDING" | "COMPLETED";
export type ActivityPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Activity {
  id: number;
  title: string;
  description: string;
  subject: string;
  category: string;
  dueDate: string;
  dueDateLabel: string;
  priority: ActivityPriority;
  status: ActivityStatus;
}

export interface Subject {
  id: number;
  name: string;
  professor: string;
  activityCount: number;
  pendingCount: number;
}
