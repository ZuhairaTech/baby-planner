export type Priority = "High" | "Medium" | "Low" | "";

export type ShoppingStatus =
  | "Bought"
  | "Comparing"
  | "Wishlist"
  | "Waiting Sale"
  | "Not Needed"
  | "";

export interface ShoppingItem {
  id: number;
  category: string;
  item: string;
  brand: string;
  qty: string;
  priority: Priority;
  neededBy: string;
  budget: number | null;
  bestPrice: number | null;
  boughtPrice: number | null;
  store: string;
  link: string;
  status: ShoppingStatus;
  note: string;
}