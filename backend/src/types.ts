export type ActivityPriority = "LOW" | "MEDIUM" | "HIGH";
export type ActivityStatus = "PENDING" | "COMPLETED";
export interface User {
  id: number;
  name: string;
  email: string;
}
export interface StoredUser extends User {
  password_hash: string;
}
export interface Subject {
  id: number;
  name: string;
  professor: string;
  activityCount: number;
  pendingCount: number;
}
export interface Category {
  id: number;
  name: string;
}
export interface ActivityInput {
  title: string;
  description: string;
  subjectId: number;
  categoryId: number;
  dueDate: string;
  priority: ActivityPriority;
  status: ActivityStatus;
}
export interface Activity extends ActivityInput {
  id: number;
  subject: string;
  category: string;
  dueDateLabel: string;
}
export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
}
