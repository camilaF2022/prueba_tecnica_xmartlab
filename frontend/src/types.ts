export type Token = {
  access: string;
  refresh: string;
};

export type TaskStatud = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatud;
  created_at: string;
};