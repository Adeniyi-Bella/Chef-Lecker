import { supabase } from "./supabase"

export async function setupDatabase() {
  try {
    console.log("Setting up database...")

    // Check if the meals table exists
    const { data: tableExists, error: tableCheckError } = await supabase.from("meals").select("id").limit(1)

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.log("Creating meals table...")

      // Create the meals table
      const { error: createTableError } = await supabase.rpc("create_meals_table")

      if (createTableError) {
        console.error("Error creating meals table:", createTableError)
        return false
      }

      console.log("Meals table created successfully")
    } else {
      console.log("Meals table already exists")
    }

    // Check if the ingredients column exists
    const { data: columns, error: columnsError } = await supabase.rpc("get_table_columns", { table_name: "meals" })

    if (columnsError) {
      console.error("Error checking columns:", columnsError)
      return false
    }

    const hasIngredientsColumn = columns.some((col: any) => col.column_name === "ingredients")

    if (!hasIngredientsColumn) {
      console.log("Adding ingredients column...")

      // Add the ingredients column
      const { error: addColumnError } = await supabase.rpc("add_ingredients_column")

      if (addColumnError) {
        console.error("Error adding ingredients column:", addColumnError)
        return false
      }

      console.log("Ingredients column added successfully")
    } else {
      console.log("Ingredients column already exists")
    }

    return true
  } catch (error) {
    console.error("Error setting up database:", error)
    return false
  }
}
