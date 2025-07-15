
export interface Transaction {
  id: string;
  user_id?: string;
  type: 'entrada' | 'saída';
  description: string;
  amount: number;
  date: string; // Consider using Date type if appropriate, but string for now as in original
  category?: string;
  specificType?: string;
}

export interface Category {
  id?: string;
  user_id?: string;
  name: string;
  color: string;
}

export interface MonthlyData {
  name: string; // Mês
  expenses: number;
  income: number;
}

export interface User {
  id: string;
  email?: string | null;
  reset_option?: string;
  especificar_tipo?: boolean;
  // Add other user properties if needed
}

export interface Archive {
  id: string;
  user_id: string;
  period_type: string;
  period_start: string;
  period_end: string;
  total_income: number;
  total_expenses: number;
  total_balance: number;
  transactions_data: Transaction[];
  created_at: string;
}

// For toast function signature, if complex
export type ToastFunction = (options: {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  // Add other toast options if necessary
}) => void;
