"use client"

import { useEffect } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMealStore } from "@/lib/store"
import { useMeals } from "@/lib/hooks/use-meals"
import { MealCard } from "@/components/meal-card"
import { AddMealDialog } from "@/components/add-meal-dialog"
import { EmptyState } from "@/components/empty-state"

export function MealList() {
  const { isAddMealOpen, setIsAddMealOpen } = useMealStore()
  const { data: meals, isLoading, error } = useMeals()

  useEffect(() => {
    if (error) {
      console.error("Error fetching meals:", error)
    }
  }, [error])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Meals</h2>
        <Button onClick={() => setIsAddMealOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Meal
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : meals && meals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <AddMealDialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen} />
    </div>
  )
}
