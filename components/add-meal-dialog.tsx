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
// import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToastStore } from "@/lib/store"
import { createMeal } from "@/lib/services/MealServices"
import { AddMealDialogProps, Ingredient, MealData } from "@/types/services/IMealService"
import { TagInput } from "./tag-input"

export function AddMealDialog({ open, onOpenChange, onSuccess }: AddMealDialogProps) {
  // const { toast } = useToast()
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [country, setCountry] = useState("")
  const [userName, setUserName] = useState("")
  const [preparationSteps, setPreparationSteps] = useState<string[]>([""])
  const [preparationError, setPreparationError] = useState<string[]>([""])
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", amount: "" }])
  const [formError, setFormError] = useState<string | null>(null)
  const [nameError, setNameError] = useState("")
  const [userNameError, setUserNameError] = useState("")
  const [ingredientsError, setIngredientsError] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [servings, setServings] = useState(2)
  const [servingsError, setServingsError] = useState("")

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
    },
  })

  const resetForm = () => {
    setName("")
    setCountry("")
    setUserName("")
    setPreparationSteps([""])
    setIngredients([{ name: "", amount: "" }])
    setNameError("")
    setTags([])
    setUserNameError("")
    setPreparationError([""])
    setIngredientsError([])
    setFormError(null)
    setServings(2)
    setServingsError("")

  }

  const validateForm = () => {
    let isValid = true
    setFormError(null)

    if (!name.trim()) {
      setNameError("Dish name is required")
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

    const newPreparationError = preparationSteps.map((step) => {
      if (!step.trim()) {
        isValid = false
        return "This step cannot be empty"
      }
      return ""
    })
    setPreparationError(newPreparationError)

    if (servings < 1) {
      setServingsError("Number of servings must be at least 1")
      isValid = false
    } else {
      setServingsError("")
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
    const updated = [...ingredients]
    updated[index].name = value
    setIngredients(updated)
  }

  const updateIngredientAmount = (index: number, value: string) => {
    const updated = [...ingredients]
    updated[index].amount = value
    setIngredients(updated)
  }

  const addPreparationStep = () => {
    setPreparationSteps([...preparationSteps, ""])
    setPreparationError([...preparationError, ""])
  }

  const removePreparationStep = (index: number) => {
    if (preparationSteps.length > 1) {
      const updatedSteps = [...preparationSteps]
      updatedSteps.splice(index, 1)
      setPreparationSteps(updatedSteps)

      const updatedErrors = [...preparationError]
      updatedErrors.splice(index, 1)
      setPreparationError(updatedErrors)
    }
  }

  const updatePreparationStep = (index: number, value: string) => {
    const updatedSteps = [...preparationSteps]
    updatedSteps[index] = value
    setPreparationSteps(updatedSteps)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!validateForm()) return

    const validIngredients = ingredients.filter((i) => i.name.trim() && i.amount.trim())

    const mealData: MealData = {
      name,
      userName,
      preparation: preparationSteps,
      ingredients: validIngredients,
      country,
      tags,
      servings
    }

    console.log("Meal data to be submitted:", mealData);
    

    addMealMutation.mutate(mealData)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm()
      onOpenChange(isOpen)
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Dishes</DialogTitle>
          <DialogDescription>Add a new meal with ingredients and preparation instructions.</DialogDescription>
        </DialogHeader>

        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <Label htmlFor="userName">Your Name</Label>
            <Input id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />
            {userNameError && <p className="text-sm text-red-500">{userNameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name of Dish</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country of Dish</Label>
            <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
            {/* {nameError && <p className="text-sm text-red-500">{nameError}</p>} */}
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
                <Input placeholder="Zutaten name" value={ingredient.name} onChange={(e) => updateIngredientName(index, e.target.value)} />
                <Input placeholder="Menge (kg)" value={ingredient.amount} onChange={(e) => updateIngredientAmount(index, e.target.value)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)} disabled={ingredients.length <= 1}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {ingredientsError.some(e => e) && (
              <p className="text-sm text-red-500 mt-1">All ingredients must have both name and amount</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagInput value={tags} onChange={setTags} />
            <p className="text-xs text-muted-foreground">
              Add tags like vegan, easy, quick, beef, etc. to help with filtering
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Preparation Steps</Label>
              <Button type="button" variant="outline" size="sm" onClick={addPreparationStep}>
                <Plus className="h-4 w-4 mr-1" />
                Add New Step
              </Button>
            </div>
            {preparationSteps.map((step, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Textarea
                  placeholder={`Step ${index + 1}`}
                  value={step}
                  onChange={(e) => updatePreparationStep(index, e.target.value)}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removePreparationStep(index)} disabled={preparationSteps.length <= 1}>
                  <X className="h-4 w-4" />
                </Button>
                {preparationError[index] && <p className="text-sm text-red-500">{preparationError[index]}</p>}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="servings">Number of Servings</Label>
            <Input
              id="servings"
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(Number.parseInt(e.target.value) || 0)}
              placeholder="Enter number of servings"
            />
            {servingsError && <p className="text-sm text-red-500">{servingsError}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={addMealMutation.isPending}>
              {addMealMutation.isPending ? "Adding..." : "Add Dish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
