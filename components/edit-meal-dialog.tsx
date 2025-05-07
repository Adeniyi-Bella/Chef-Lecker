"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToastStore } from "@/lib/store"
import { updateMeal } from "@/lib/services/MealServices"
import { EditMealDialogProps, Ingredient, MealData } from "@/types/services/IMealService"
import { TagInput } from "./tag-input"

export function EditMealDialog({ open, onOpenChange, meal }: EditMealDialogProps) {
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [userName, setUserName] = useState("")
  const [country, setCountry] = useState("")
  const [preparationSteps, setPreparationSteps] = useState<string[]>([""])
  const [preparationError, setPreparationError] = useState<string[]>([""])
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", amount: "" }])
  const [ingredientsError, setIngredientsError] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [nameError, setNameError] = useState("")
  const [userNameError, setUserNameError] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [servings, setServings] = useState(meal!.servings)
    const [servingsError, setServingsError] = useState("")
  

  const editMealMutation = useMutation({
    mutationFn: updateMeal,
    onSuccess: () => {
      resetForm()
      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ["meals"] })
      useToastStore.getState().setToast("Meal edited successfully!", "success")
    },
    onError: (error: any) => {
      console.error("Error updating meal:", error)
      setFormError(error.message || "Failed to update meal. Please try again.")
    },
  })

  useEffect(() => {
    if (meal) {
      setName(meal.name)
      setUserName(meal.userName)
      setCountry(meal.country || "")
      setServings(meal.servings )

      const prepareTags: string[] = (() => {
        if (Array.isArray(meal.tags)) return meal.tags
        try {
          const parsed = JSON.parse(meal.tags)
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      })()

      setTags(prepareTags)

      const preparation: string[] = (() => {
        if (Array.isArray(meal.preparation)) return meal.preparation
        try {
          const parsed = JSON.parse(meal.preparation)
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      })()

      setPreparationSteps(preparation)
      setIngredients(meal.ingredients.length ? meal.ingredients : [{ name: "", amount: "" }])
      setPreparationError(preparation?.map(() => "") || [""])
      setIngredientsError(meal.ingredients.map(() => "") || [""])
    }
  }, [meal])

  const resetForm = () => {
    setName("")
    setUserName("")
    setCountry("")
    setPreparationSteps([""])
    setPreparationError([""])
    setIngredients([{ name: "", amount: "" }])
    setIngredientsError([""])
    setFormError(null)
    setNameError("")
    setUserNameError("")
    setTags([""])
    setServings(0)
    setServingsError("")
  }

  const validateForm = () => {
    let isValid = true

    if (!name.trim()) {
      setNameError("Meal name is required")
      isValid = false
    } else setNameError("")

    if (!userName.trim()) {
      setUserNameError("Your name is required")
      isValid = false
    } else setUserNameError("")

    if (servings < 1) {
      setServingsError("Number of servings must be at least 1")
      isValid = false
    } else {
      setServingsError("")
    }

    const newPrepErrors = preparationSteps.map((step) => (!step.trim() ? "Step cannot be empty" : ""))
    if (newPrepErrors.some((err) => err !== "")) isValid = false
    setPreparationError(newPrepErrors)

    const newIngredientErrors = ingredients.map((ing) =>
      !ing.name.trim() || !ing.amount.trim() ? "Both name and amount are required" : ""
    )
    if (newIngredientErrors.some((err) => err !== "")) isValid = false
    setIngredientsError(newIngredientErrors)

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!validateForm()) return

    const cleanedSteps = preparationSteps.filter((s) => s.trim())
    const validIngredients = ingredients.filter((i) => i.name.trim() && i.amount.trim())

    const mealData: MealData = {
      id: meal?.id || "",
      name,
      userName,
      tags,
      country,
      preparation: cleanedSteps,
      ingredients: validIngredients,
      servings
    }

    editMealMutation.mutate(mealData)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) resetForm(); onOpenChange(isOpen) }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit and Update Details of Dish</DialogTitle>
        </DialogHeader>

        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-2">
            <Label htmlFor="userName"> Your Name</Label>
            <Input id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />
            {userNameError && <p className="text-sm text-red-500">{userNameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name"> Name of Dish</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country of Dish</Label>
            <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagInput value={tags} onChange={setTags} />
            <p className="text-xs text-muted-foreground">
              Add tags like vegan, easy, quick, beef, etc. to help with filtering
            </p>
          </div>

          <div className="space-y-2">
            <Label>Preparation Steps</Label>
            {preparationSteps.map((step, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Textarea
                  value={step}
                  onChange={(e) => {
                    const updated = [...preparationSteps]
                    updated[index] = e.target.value
                    setPreparationSteps(updated)
                  }}
                  placeholder={`Step ${index + 1}`}
                  className="min-h-[80px]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const updatedSteps = preparationSteps.filter((_, i) => i !== index)
                    const updatedErrors = preparationError.filter((_, i) => i !== index)
                    setPreparationSteps(updatedSteps)
                    setPreparationError(updatedErrors)
                  }}
                  disabled={preparationSteps.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {preparationError.some((e) => e) && (
              <p className="text-sm text-red-500">Please remove step or fill.</p>
            )}
            <Button type="button" variant="outline" size="sm" onClick={() => {
              setPreparationSteps([...preparationSteps, ""])
              setPreparationError([...preparationError, ""])
            }}>
              <Plus className="h-4 w-4 mr-1" />
              Add New Steps
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Ingredients</Label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Name"
                  value={ingredient.name}
                  onChange={(e) => {
                    const updated = [...ingredients]
                    updated[index].name = e.target.value
                    setIngredients(updated)
                  }}
                />
                <Input
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) => {
                    const updated = [...ingredients]
                    updated[index].amount = e.target.value
                    setIngredients(updated)
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newIngredients = ingredients.filter((_, i) => i !== index)
                    const newErrors = ingredientsError.filter((_, i) => i !== index)
                    setIngredients(newIngredients)
                    setIngredientsError(newErrors)
                  }}
                  disabled={ingredients.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {ingredientsError.some((e) => e) && (
              <p className="text-sm text-red-500">Please remove ingredient or fill.</p>
            )}
            <Button type="button" variant="outline" size="sm" onClick={() => {
              setIngredients([...ingredients, { name: "", amount: "" }])
              setIngredientsError([...ingredientsError, ""])
            }}>
              <Plus className="h-4 w-4 mr-1" />
              Add New Ingredient
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servings">Number of Servings</Label>
            <Input
              id="servings"
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(Number.parseInt(e.target.value))}
              placeholder="Enter number of servings"
            />
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
            <Button type="submit" disabled={editMealMutation.isPending}>
              {editMealMutation.isPending ? "Updating..." : "Update Dish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
