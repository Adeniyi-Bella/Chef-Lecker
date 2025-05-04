import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("API: Fetching meals")
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("meals").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("API Error fetching meals:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Ensure ingredients is always an array
    const processedData =
      data?.map((meal) => ({
        ...meal,
        ingredients: Array.isArray(meal.ingredients)
          ? meal.ingredients
          : typeof meal.ingredients === "string"
            ? JSON.parse(meal.ingredients)
            : [],
      })) || []

    console.log(`API: Successfully fetched ${processedData.length} meals`)
    return NextResponse.json(processedData)
  } catch (error) {
    console.error("API: Internal server error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log("API: Adding new meal")
    const meal = await request.json()
    console.log("API: Meal data received:", meal)

    const supabase = createServerSupabaseClient()

    // Ensure ingredients is properly formatted for the database
    const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : []

    const newMeal = {
      name: meal.name,
      userName: meal.userName,
      preparation: meal.preparation,
      ingredients: ingredients,
      created_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("API: Formatted meal data for insertion:", newMeal)

    const { data, error } = await supabase.from("meals").insert([newMeal]).select()

    if (error) {
      console.error("API Error adding meal:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("API: Meal added successfully:", data?.[0]?.id)
    return NextResponse.json(data?.[0] || {})
  } catch (error) {
    console.error("API: Internal server error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
