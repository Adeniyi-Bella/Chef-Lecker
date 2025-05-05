"use client"

import type React from "react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToastStore } from "@/lib/store"

interface AddMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void // new prop
}


interface Ingredient {
  name: string
  amount: string
}

interface MealData {
  name: string
  userName: string
  preparation: string
  ingredients: Ingredient[]
}

// Simulate API call – replace with real API call
async function createMeal(meal: MealData): Promise<void> {
  const response = await fetch("/api/meals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meal),
  })

  if (!response.ok) {
    throw new Error("Failed to add meal")
  }
}

export function AddMealDialog({ open, onOpenChange, onSuccess }: AddMealDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const addMealMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      resetForm()
      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ["meals"] })
      useToastStore.getState().setToast("Meal added successfully!", "success")
    },
    onError: (error: any) => {
      console.error("Error adding meal:", error)
      setFormError(error.message || "Failed to add meal. Please try again.")
      toast({
        title: "Error",
        description: "Failed to add meal. Please try again.",
        variant: "destructive",
      })
    },
  })

  const [name, setName] = useState("")
  const [userName, setUserName] = useState("")
  const [preparation, setPreparation] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", amount: "" }])
  const [formError, setFormError] = useState<string | null>(null)
  const [nameError, setNameError] = useState("")
  const [userNameError, setUserNameError] = useState("")
  const [preparationError, setPreparationError] = useState("")
  const [ingredientsError, setIngredientsError] = useState<string[]>([])

  const resetForm = () => {
    setName("")
    setUserName("")
    setPreparation("")
    setIngredients([{ name: "", amount: "" }])
    setNameError("")
    setUserNameError("")
    setPreparationError("")
    setIngredientsError([])
    setFormError(null)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!validateForm()) {
      return
    }

    const validIngredients = ingredients.filter((ingredient) => ingredient.name.trim() && ingredient.amount.trim())

    const mealData: MealData = {
      name,
      userName,
      preparation,
      ingredients: validIngredients,
    }

    addMealMutation.mutate(mealData)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm()
        }
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Meal</DialogTitle>
          <DialogDescription>Add a new meal with ingredients and preparation instructions.</DialogDescription>
        </DialogHeader>

        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Meal Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter meal name" />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">Your Name</Label>
            <Input
              id="userName"
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
            <Label htmlFor="preparation">Preparation Instructions</Label>
            <Textarea
              id="preparation"
              value={preparation}
              onChange={(e) => setPreparation(e.target.value)}
              placeholder="Enter preparation instructions"
              className="min-h-[120px]"
            />
            {preparationError && <p className="text-sm text-red-500">{preparationError}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addMealMutation.isPending}>
              {addMealMutation.isPending ? "Adding..." : "Add Meal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
