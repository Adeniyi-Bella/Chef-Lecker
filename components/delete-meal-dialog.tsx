"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Meal } from "@/lib/types"
import { useDeleteMeal } from "@/lib/hooks/use-meals"

interface DeleteMealDialogProps {
  meal: Meal
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteMealDialog({ meal, open, onOpenChange }: DeleteMealDialogProps) {
  const { toast } = useToast()
  const deleteMealMutation = useDeleteMeal()

  const handleDelete = () => {
    deleteMealMutation.mutate(meal.id, {
      onSuccess: () => {
        toast({
          title: "Meal deleted",
          description: "The meal has been deleted successfully.",
        })
        onOpenChange(false)
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to delete meal. Please try again.",
          variant: "destructive",
        })
        console.error("Error deleting meal:", error)
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the meal &quot;{meal.name}&quot;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMealMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
