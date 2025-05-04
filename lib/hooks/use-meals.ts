"use client"

import type { Meal } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"

export function useMeals() {
  return useQuery<Meal[], Error>({
    queryKey: ["meals"],
    queryFn: async () => {
      console.log("Fetching meals from API...")
      const response = await fetch("/api/meals")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Meals fetched successfully:", data?.length || 0, "meals")
      return data || []
    },
  })
}
