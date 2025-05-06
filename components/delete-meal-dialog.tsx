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
import { useToastStore } from "@/lib/store"
import type { Meal } from "@/lib/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface DeleteMealDialogProps {
  meal: Meal
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteMealDialog({ meal, open, onOpenChange }: DeleteMealDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const deleteMealMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/meals/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete meal")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] })
      onOpenChange(false)
      useToastStore.getState().setToast("Meal deleted successfully!", "success")

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

  const handleDelete = () => {
    deleteMealMutation.mutate(meal.id)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
          <AlertDialogDescription>
            Diese würde die Gericht loschen &quot;{meal.name}&quot;. Diese Aktion kann nicht rückgängig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMealMutation.isPending ? "Löschen..." : "Löschen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
