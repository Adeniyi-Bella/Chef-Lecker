import * as z from "zod"

const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  amount: z.string().min(1, "Amount is required"),
})

export const mealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  userName: z.string().min(1, "Your name is required"),
  preparation: z.string().min(1, "Preparation instructions are required"),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
})

export type MealFormValues = z.infer<typeof mealSchema>
