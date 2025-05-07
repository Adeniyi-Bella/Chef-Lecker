export interface AddMealDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
  }
  
  
  export interface Ingredient {
    name: string
    amount: string
  }
  
  export interface MealData {
    id?: string
    name: string
    userName: string
    preparation: string[]
    ingredients: Ingredient[]
    country: string
    tags: string[]
    servings: number
    created_at?: string
  }

  export interface EditMealDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    meal: MealData | null
  }