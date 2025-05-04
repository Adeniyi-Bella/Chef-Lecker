"use client"

import { UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMealStore } from "@/lib/store"

export function EmptyState() {
  const { setIsAddMealOpen } = useMealStore()

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
