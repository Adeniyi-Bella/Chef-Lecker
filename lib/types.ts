export interface Ingredient {
  name: string
  amount: string
}

export interface Meal {
  id: string
  name: string
  userName: string
  preparation: string[]
  ingredients: Ingredient[]
  created_at: string
  updatedAt: string
}
