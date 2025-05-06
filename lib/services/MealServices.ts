import { MealData } from "@/types/services/IMealService"

// Simulate API call – replace with real API call
export async function createMeal(meal: MealData): Promise<void> {
    const response = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meal),
    })
  
    if (!response.ok) {
      throw new Error("Failed to add meal")
    }
  }

  // Simulate API call – replace with real API call
export async function updateMeal(meal: MealData): Promise<void> {
  const response = await fetch(`/api/meals/${meal.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meal),
  })

  if (!response.ok) {

    throw new Error("Failed to update meal")
  }
}