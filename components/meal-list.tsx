"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMealStore } from "@/lib/store"
import { useMeals } from "@/lib/hooks/use-meals"
import { MealCard } from "@/components/meal-card"
import { AddMealDialog } from "@/components/add-meal-dialog"
import { EmptyState } from "@/components/empty-state"
import { Toast } from "./ui/notification"
import { SearchBar } from "./search-bar"

export function MealList() {
  const { isAddMealOpen, setIsAddMealOpen } = useMealStore()
  const { data: meals, isLoading, error } = useMeals()
  const [searchQuery, setSearchQuery] = useState("")
  const [noResults, setNoResults] = useState(false)

  useEffect(() => {
    if (error) {
      console.error("Error fetching meals:", error)
    }
  }, [error])

  // Filter meals based on search query - only by name
  const filteredMeals = useMemo(() => {
    if (!searchQuery.trim() || !meals) return meals

    const query = searchQuery.toLowerCase().trim()

    return meals.filter((meal) => {
      // Search only in meal name
      return meal.name.toLowerCase().includes(query)
    })
  }, [meals, searchQuery])

  // Update noResults state when filtered meals change
  useEffect(() => {
    if (searchQuery && filteredMeals && filteredMeals.length === 0) {
      setNoResults(true)
    } else {
      setNoResults(false)
    }
  }, [filteredMeals, searchQuery])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dishes</h2>
        <Button onClick={() => setIsAddMealOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add a new Dish
        </Button>
      </div>

      <div className="w-full">
        <SearchBar onSearch={setSearchQuery} placeholder="Search by dish name..." />
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
      ) : noResults ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            No meals match your search for "{searchQuery}". Try a different search term.
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      ) : filteredMeals && filteredMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} searchQuery={searchQuery} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
      <AddMealDialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen} />
      <Toast />
    </div>
  )
}
