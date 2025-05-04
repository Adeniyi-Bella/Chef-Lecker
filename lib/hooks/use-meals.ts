"use client"

import { useState, useEffect, useCallback } from "react"
import type { Meal } from "@/lib/types"
import type { MealFormValues } from "@/lib/validations/meal"

// Custom hooks
export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMeals = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log("Fetching meals from API...")

      const response = await fetch("/api/meals")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Meals fetched successfully:", data?.length || 0, "meals")
      setMeals(data || [])
    } catch (err) {
      console.error("Error fetching meals:", err)
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMeals()

    // Set up polling for updates every 30 seconds
    // const intervalId = setInterval(() => {
    //   fetchMeals()
    // }, 30000)

    // return () => clearInterval(intervalId)
  }, [fetchMeals])

  return { data: meals, isLoading, error, refetch: fetchMeals }
}

export function useAddMeal() {
  const [isPending, setIsPending] = useState(false)
  const { refetch } = useMeals()

  const mutate = async (
    meal: MealFormValues,
    options?: { onSuccess?: () => void; onError?: (error: Error) => void },
  ) => {
    try {
      setIsPending(true)

      // Log the meal data for debugging
      console.log("Adding meal with data:", meal)

      // Ensure ingredients is an array
      const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : []

      const newMeal = {
        name: meal.name,
        userName: meal.userName,
        preparation: meal.preparation,
        ingredients: ingredients,
      }

      console.log("Sending to API:", newMeal)

      const response = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMeal),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Meal added successfully:", data)

      await refetch()
      options?.onSuccess?.()
      return data
    } catch (err) {
      console.error("Error in useAddMeal:", err)
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      options?.onError?.(error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending }
}

export function useUpdateMeal() {
  const [isPending, setIsPending] = useState(false)
  const { refetch } = useMeals()

  const mutate = async (
    mealData: MealFormValues & { id: string },
    options?: { onSuccess?: () => void; onError?: (error: Error) => void },
  ) => {
    try {
      setIsPending(true)
      const { id, ...meal } = mealData

      // Ensure ingredients is an array
      const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : []

      const updatedMeal = {
        name: meal.name,
        userName: meal.userName,
        preparation: meal.preparation,
        ingredients: ingredients,
      }

      console.log("Updating meal:", id, updatedMeal)

      const response = await fetch(`/api/meals/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMeal),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Meal updated successfully:", data)

      await refetch()
      options?.onSuccess?.()
      return data
    } catch (err) {
      console.error("Error in useUpdateMeal:", err)
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      options?.onError?.(error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending }
}

export function useDeleteMeal() {
  const [isPending, setIsPending] = useState(false)
  const { refetch } = useMeals()

  const mutate = async (id: string, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
    try {
      setIsPending(true)
      console.log("Deleting meal:", id)

      const response = await fetch(`/api/meals/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
      }

      console.log("Meal deleted successfully")
      await refetch()
      options?.onSuccess?.()
    } catch (err) {
      console.error("Error in useDeleteMeal:", err)
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      options?.onError?.(error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending }
}
