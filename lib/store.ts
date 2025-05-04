import { create } from "zustand"

interface MealState {
  isAddMealOpen: boolean
  setIsAddMealOpen: (open: boolean) => void
}

export const useMealStore = create<MealState>((set) => ({
  isAddMealOpen: false,
  setIsAddMealOpen: (open) => set({ isAddMealOpen: open }),
}))
