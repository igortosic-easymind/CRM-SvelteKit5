// Auth types
export interface User {
  id: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Client types
export type LeadStatus = "cold" | "warm" | "hot";

export interface Client {
  id: number;
  created_at: string;
  company_name: string;
  first_name: string;
  last_name: string;
  position: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  lead: string;
  related_name: string;
  linkedin_connection: string;
  comments: string;
  first_contact: string | undefined;
  description_contact: string;
  date_of_last_contact: string;
  description_contact_more: string;
  follow_up_action: string;
  date_of_next_contact: string;
  new_business: string;
  recommendation: string;
  owner_id: number;
  latest_task_id?: number;
  task_count?: number;
}

export type CreateClientData = Omit<
  Client,
  "id" | "created_at" | "owner_id" | "date_of_last_contact" | "date_of_next_contact"
>;

export interface UpdateClientData extends CreateClientData {
  id: number;
}

//state types
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Task types
export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type TaskType = "follow-up" | "meeting" | "call" | "email" | "other";
export type TaskCreationSource = "manual" | "client" | "calendar" | "follow-up";

export interface Task {
  id: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  title: string;
  description: string;
  status: TaskStatus;
  client_id?: number;
  due_date?: string;
  priority?: TaskPriority;
  type?: TaskType;
  owner_id: number;
}

export type CreateTaskData = Omit<Task, "id" | "created_at" | "updated_at" | "completed_at" | "owner_id">;
export type UpdateTaskData = Omit<Task, "created_at" | "updated_at" | "owner_id">;

export interface TaskCreationContext {
  source: TaskCreationSource;
  client_id?: number;
  date?: string;
  event_id?: string;
  follow_up_action?: string;
  prefilled_data?: {
    title?: string;
    description?: string;
    type?: TaskType;
  };
}

// Calendar types
export type CalendarEventType = "meeting" | "call" | "follow-up" | "deadline" | "personal" | "other";
export type CalendarEventStatus = "scheduled" | "completed" | "cancelled" | "rescheduled";
export type CalendarEventRecurrence = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_date: string; // ISO string
  end_date: string; // ISO string
  all_day: boolean;
  type: CalendarEventType;
  status: CalendarEventStatus;
  client_id?: number; // Optional link to client
  task_id?: number; // Optional link to task
  location?: string;
  recurrence: CalendarEventRecurrence;
  recurrence_end?: string; // ISO string
  created_at: string; // ISO string
  updated_at: string; // ISO string
  owner_id: number;
}

export type CreateCalendarEventData = Omit<CalendarEvent, "id" | "created_at" | "updated_at" | "owner_id">;

export type UpdateCalendarEventData = Partial<CreateCalendarEventData> & {
  id: number;
};
