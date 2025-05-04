import { MealList } from "@/components/meal-list"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Cooking App</h1>
      <MealList />
    </main>
  )
}
