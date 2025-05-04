"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Meal } from "@/lib/types"
import { useUpdateMeal } from "@/lib/hooks/use-meals"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EditMealDialogProps {
  meal: Meal
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMealDialog({ meal, open, onOpenChange }: EditMealDialogProps) {
  const { toast } = useToast()
  const updateMealMutation = useUpdateMeal()

  const [name, setName] = useState(meal.name)
  const [userName, setUserName] = useState(meal.userName)
  const [preparation, setPreparation] = useState(meal.preparation)
  const [ingredients, setIngredients] = useState(meal.ingredients)
  const [formError, setFormError] = useState<string | null>(null)

  const [nameError, setNameError] = useState("")
  const [userNameError, setUserNameError] = useState("")
  const [preparationError, setPreparationError] = useState("")
  const [ingredientsError, setIngredientsError] = useState<string[]>([])

  // Reset form when meal changes or dialog opens
  useEffect(() => {
    if (open) {
      setName(meal.name)
      setUserName(meal.userName)
      setPreparation(meal.preparation)
      setIngredients(meal.ingredients || [])
      setNameError("")
      setUserNameError("")
      setPreparationError("")
      setIngredientsError((meal.ingredients || []).map(() => ""))
      setFormError(null)
    }
  }, [meal, open])

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }])
    setIngredientsError([...ingredientsError, ""])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients]
      newIngredients.splice(index, 1)
      setIngredients(newIngredients)

      const newErrors = [...ingredientsError]
      newErrors.splice(index, 1)
      setIngredientsError(newErrors)
    }
  }

  const updateIngredientName = (index: number, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index].name = value
    setIngredients(newIngredients)
  }

  const updateIngredientAmount = (index: number, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index].amount = value
    setIngredients(newIngredients)
  }

  const validateForm = () => {
    let isValid = true
    setFormError(null)

    if (!name.trim()) {
      setNameError("Meal name is required")
      isValid = false
    } else {
      setNameError("")
    }

    if (!userName.trim()) {
      setUserNameError("Your name is required")
      isValid = false
    } else {
      setUserNameError("")
    }

    if (!preparation.trim()) {
      setPreparationError("Preparation instructions are required")
      isValid = false
    } else {
      setPreparationError("")
    }

    const newIngredientsError = ingredients.map((ingredient) => {
      if (!ingredient.name.trim() || !ingredient.amount.trim()) {
        isValid = false
        return "Both name and amount are required"
      }
      return ""
    })

    setIngredientsError(newIngredientsError)

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!validateForm()) {
      return
    }

    try {
      // Clean up ingredients data
      const validIngredients = ingredients.filter((ingredient) => ingredient.name.trim() && ingredient.amount.trim())

      const mealData = {
        id: meal.id,
        name,
        userName,
        preparation,
        ingredients: validIngredients,
      }

      await updateMealMutation.mutate(mealData, {
        onSuccess: () => {
          toast({
            title: "Meal updated",
            description: "Your meal has been updated successfully.",
          })
          onOpenChange(false)
        },
        onError: (error) => {
          console.error("Error in edit meal form:", error)
          setFormError(error.message || "Failed to update meal. Please try again.")
          toast({
            title: "Error",
            description: "Failed to update meal. Please try again.",
            variant: "destructive",
          })
        },
      })
    } catch (err) {
      console.error("Unexpected error in edit meal form:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setFormError(errorMessage)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Meal</DialogTitle>
          <DialogDescription>Make changes to your meal recipe.</DialogDescription>
        </DialogHeader>

        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Meal Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter meal name"
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-userName">Your Name</Label>
            <Input
              id="edit-userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
            />
            {userNameError && <p className="text-sm text-red-500">{userNameError}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Ingredients</Label>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-1" />
                Add Ingredient
              </Button>
            </div>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <div className="flex-1">
                  <Input
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => updateIngredientName(index, e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Amount"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredientAmount(index, e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length <= 1}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
            {ingredientsError.some((error) => error) && (
              <p className="text-sm text-red-500 mt-1">All ingredients must have both name and amount</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-preparation">Preparation Instructions</Label>
            <Textarea
              id="edit-preparation"
              value={preparation}
              onChange={(e) => setPreparation(e.target.value)}
              placeholder="Enter preparation instructions"
              className="min-h-[120px]"
            />
            {preparationError && <p className="text-sm text-red-500">{preparationError}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMealMutation.isPending}>
              {updateMealMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
