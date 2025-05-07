"use client"

import { format } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Meal } from "@/lib/types"
import { MealData } from "@/types/services/IMealService"

interface ViewMealDialogProps {
  meal: MealData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewMealDialog({ meal, open, onOpenChange }: ViewMealDialogProps) {
  const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : []
  const preparation: string[] = (() => {
    try {
      if (Array.isArray(meal.preparation)) return meal.preparation
      const parsed = JSON.parse(meal.preparation)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })()

  const tags: string[] = (() => {
    try {
      if (Array.isArray(meal.tags)) return meal.tags
      const parsed = JSON.parse(meal.tags)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{meal.name}</DialogTitle>
          <DialogDescription>
            Added by {meal.userName} on {format(new Date(meal.created_at!), "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Ingredients</h3>
            {ingredients.length > 0 ? (
              <ul className="space-y-1 list-decimal list-inside">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{ingredient.name}</span>: {ingredient.amount}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No ingredients listed</p>
            )}
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium mb-2">Preparation Description</h3>
            {preparation.length > 0 ? (
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {preparation.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">No Listed Preparation</p>
            )}
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Country:</span> {meal.country}
            </p>
            <p className="text-sm">
              <span className="font-medium">Portions:</span> {meal.servings}
            </p>
            {tags.length > 0 && (
              <div>
                <span className="font-medium text-sm">Tags:</span>
                <ul className="list-disc list-inside text-sm mt-1">
                  {tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
