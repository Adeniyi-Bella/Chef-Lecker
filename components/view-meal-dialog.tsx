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

interface ViewMealDialogProps {
  meal: Meal
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewMealDialog({ meal, open, onOpenChange }: ViewMealDialogProps) {
  // Ensure ingredients is an array
  const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{meal.name}</DialogTitle>
          <DialogDescription>
            Added by {meal.userName} on {format(new Date(meal.created_at), "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Ingredients</h3>
            {ingredients.length > 0 ? (
              <ul className="space-y-1">
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
            <h3 className="text-sm font-medium mb-2">Preparation Instructions</h3>
            <p className="text-sm whitespace-pre-line">{meal.preparation}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
