export type ActivityPriority = "LOW" | "MEDIUM" | "HIGH";
export type ActivityStatus = "PENDING" | "COMPLETED";

export interface ActivityInput {
  title: string;
  description: string;
  subject: string;
  category: string;
  dueDate: string;
  dueDateLabel: string;
  priority: ActivityPriority;
  status: ActivityStatus;
}

export interface Activity extends ActivityInput {
  id: number;
}
