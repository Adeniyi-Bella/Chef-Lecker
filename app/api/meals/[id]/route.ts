import { createServerSupabaseClient } from "@/lib/supabase"
import { count } from "console"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`API: Fetching meal with ID: ${params.id}`)
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("meals").select("*").eq("id", params.id).single()

    if (error) {
      console.error("API Error fetching meal:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 })
    }

    // Ensure ingredients is always an array
    const processedData = {
      ...data,
      ingredients: Array.isArray(data.ingredients)
        ? data.ingredients
        : typeof data.ingredients === "string"
          ? JSON.parse(data.ingredients)
          : [],
    }

    console.log("API: Successfully fetched meal")
    return NextResponse.json(processedData)
  } catch (error) {
    console.error("API: Internal server error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`API: Updating meal with ID: ${params.id}`)
    const meal = await request.json()
    console.log("API: Update data received:", meal)

    const supabase = createServerSupabaseClient()

    // Ensure ingredients is properly formatted for the database
    const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : []

    const updatedMeal = {
      country: meal.country,
      tags: meal.tags,
      servings: meal.servings,
      name: meal.name,
      userName: meal.userName,
      preparation: meal.preparation,
      ingredients: ingredients,
      updatedAt: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("meals").update(updatedMeal).eq("id", params.id).select()

    if (error) {
      console.error("API Error updating meal:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("API: Meal updated successfully")
    return NextResponse.json(data?.[0] || {})
  } catch (error) {
    console.error("API: Internal server error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const id = context.params.id
    console.log(`API: Deleting meal with ID: ${id}`)

    const { error } = await supabase.from("meals").delete().eq("id", id)

    if (error) {
      console.error("API Error deleting meal:", error)
      return new Response("Failed to delete meal", { status: 500 })
    }

    console.log("API: Meal deleted successfully")
    return new Response(null, { status: 200 })
  } catch (err) {
    console.error("API Unexpected error:", err)
    return new Response("Unexpected error", { status: 500 })
  }
}
