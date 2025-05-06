"use client"

import { UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMealStore } from "@/lib/store"

interface EmptyStateProps {
  searchQuery?: string
  onClearSearch?: () => void
}

export function EmptyState({ searchQuery, onClearSearch }: EmptyStateProps) {
  const { setIsAddMealOpen } = useMealStore()

  // If we have a search query but no results
  if (searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <UtensilsCrossed className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No results found</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          No meals match your search for "{searchQuery}". Try a different search term.
        </p>
        <Button onClick={onClearSearch}>Clear Search</Button>
      </div>
    )
  }

  // Default empty state when no meals exist
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <UtensilsCrossed className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No meals found</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        You haven't added any meals yet. Start by adding your favorite recipe.
      </p>
      <Button onClick={() => setIsAddMealOpen(true)}>Add Your First Meal</Button>
    </div>
  )
}
