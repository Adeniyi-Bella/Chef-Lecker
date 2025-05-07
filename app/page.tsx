import { BackgroundToggle } from "@/components/background-toggle"
import { MealList } from "@/components/meal-list"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen text-black dark:text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Cooking App</h1>
        <BackgroundToggle />
      </div>
      <MealList />
    </main>
  )
}
