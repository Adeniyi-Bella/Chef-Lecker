import { create } from "zustand"

interface MealState {
  isAddMealOpen: boolean
  setIsAddMealOpen: (open: boolean) => void
}

export const useMealStore = create<MealState>((set) => ({
  isAddMealOpen: false,
  setIsAddMealOpen: (open) => set({ isAddMealOpen: open }),
}))

// /lib/store.ts

type ToastVariant = "success" | "error"

interface ToastState {
  message: string
  variant: ToastVariant
  visible: boolean
  setToast: (message: string, variant?: ToastVariant) => void
  closeToast: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  variant: "success",
  visible: false,
  setToast: (message, variant = "success") =>
    set({ message, variant, visible: true }),
  closeToast: () => set({ visible: false }),
}))
