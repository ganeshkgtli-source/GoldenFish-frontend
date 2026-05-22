import type { ReactNode } from "react";

export type FilterType =
  | "search"
  | "select"
  | "date-range"
  | "sort"
  | "toggle"
  | "reset";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  type: FilterType;

  key: string;

  label?: string;

  placeholder?: string;

  options?: FilterOption[];
}

export interface TableCardProps {
  title: string;

  subtitle?: string;

  children: ReactNode;
}

export type Column<T> = {
  key: keyof T | string;

  title: string;

  render?: (row: T) => ReactNode;

  className?: string;
};

export type DataTableProps<T> = {
  columns: Column<T>[];

  data: T[];

  emptyText?: string;

  minWidth?: string;
virtualized?: boolean;
  loading?: boolean;
};