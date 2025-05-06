"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Meal } from "@/lib/types"
import { ViewMealDialog } from "@/components/view-meal-dialog"
import { EditMealDialog } from "@/components/edit-meal-dialog"
import { DeleteMealDialog } from "@/components/delete-meal-dialog"

interface MealCardProps {
  meal: Meal
}

export function MealCard({ meal }: MealCardProps) {
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Ensure meal has all required properties
  const safeMeal = {
    ...meal,
    ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
    created_at: meal.created_at || new Date().toISOString(),
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg line-clamp-1">{safeMeal.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Zeigen
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Bearbeitung
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Löschen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground">Hinzugefügt von {safeMeal.userName}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(safeMeal.created_at), "MMM d, yyyy")}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button variant="outline" size="sm" className="w-full" onClick={() => setIsViewOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Gericht Details Anzeigen
          </Button>
        </CardFooter>
      </Card>

      <ViewMealDialog meal={safeMeal} open={isViewOpen} onOpenChange={setIsViewOpen} />

      <EditMealDialog meal={safeMeal} open={isEditOpen} onOpenChange={setIsEditOpen} />

      <DeleteMealDialog meal={safeMeal} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
    </>
  )
}
