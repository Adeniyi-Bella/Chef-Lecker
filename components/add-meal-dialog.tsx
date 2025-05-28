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
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [comments, setComments] = useState("")

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
    setServings(0)
    setServingsError("")
    setComments("")

  }


  function generateMealPrompt({
    name,
    country,
    ingredients,
    tags,
    comments,
  }: {
    name?: string;
    country?: string;
    ingredients?: { name: string; amount: string }[];
    tags?: string[];
    comments?: string;
  }) {
    let prompt = `Generate a complete meal JSON object based on the fields provided. If a field is missing, fill it in with a plausible value.\n\n`;

    prompt += `Provided input:\n{\n`;
    if (name) prompt += `  "Dish name": "${name}",\n`;
    if (country) prompt += `  "Country": "${country}",\n`;
    if (ingredients?.length) prompt += `  "ingredients": ${JSON.stringify(ingredients)},\n`;
    if (tags?.length) prompt += `  "tags": ${JSON.stringify(tags)},\n`;
    if (comments) prompt += `  "comments": "${comments}",\n`;
    prompt += `}\n\n`;

    prompt += `Generate the output strictly in the following JSON format:\n`;
    prompt += `{\n  "Dish name": "",\n  "Country": "",\n  "ingredients": [ { "name": "", "amount": "" }, ... ],\n`;
    prompt += `  "preparation": [ "Step 1", "Step 2", ... ],\n  "tags": [ "tag1", "tag2" ],\n  "How many people": "",\n  "comments": ""\n}\n\n`;
    prompt += `Only return valid JSON. Do not explain.`;

    return prompt;
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
          <div className="flex items-center gap-2 justify-around">

            <Button
              type="button"
              size="sm"
              disabled={isAiLoading}
              onClick={async () => {
                setIsAiLoading(true)

                try {

                  const prompt = generateMealPrompt({ name, country, ingredients, tags, comments })
                  const res = await fetch("/api/ai-complete-meal", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt }),
                  })

                  const data = await res.json()

                  setName(data["Dish name"] || "")
                  setCountry(data["Country"] || "")
                  setIngredients(data.ingredients || [{ name: "", amount: "" }])
                  setPreparationSteps(data.preparation || [""])
                  setTags(data.tags || [])
                  setServings(data["How many people"] || 2)
                } catch (error) {
                  console.error("AI request failed", error)
                  setFormError("Failed to auto-complete with AI. Try again.")
                } finally { setIsAiLoading(false) }

              }}
            >
              {isAiLoading ? "Completing..." : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Complete form with AI
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={resetForm}
            >
              <X className="h-4 w-4 mr-1" />
              Clear Form
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any additional comments for AI to consider..."
            />
          </div>

          <DialogDescription>Fill form manually or auto complete form with AI or partially fill the form and complete the remaining part of the form with AI.</DialogDescription>

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
                <Input placeholder="Name of Ingredient" value={ingredient.name} onChange={(e) => updateIngredientName(index, e.target.value)} />
                <Input placeholder="Qty (kg)" value={ingredient.amount} onChange={(e) => updateIngredientAmount(index, e.target.value)} />
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
