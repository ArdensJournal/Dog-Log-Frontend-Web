// Task type definitions
export interface Task {
  _id: string;
  name: string;
  description?: string;
  date: string;
  isCompleted: boolean;
  dog: {
    _id: string;
    name: string;
  };
  vaccine?: {
    _id: string;
    name: string;
  };
  addedBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}