import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
  apiKey: process.env.NEXT_PUBLIC_OPENAI,
})

export async function POST(request: Request) {
    try {
      const body = await request.json()
      const { prompt } = body
  
      if (!prompt || typeof prompt !== "string") {
        return NextResponse.json({ error: "Invalid or missing prompt" }, { status: 400 })
      }
  
      console.log("API: Completing meal from prompt:", prompt)
  
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      })
  
      const message = completion.choices[0]?.message?.content
  
      if (!message) {
        console.error("API: No content returned by model")
        return NextResponse.json({ error: "No content returned by model" }, { status: 500 })
      }
  
      const parsed = JSON.parse(message)
      console.log("API: Parsed AI response:", parsed)
  
      return NextResponse.json(parsed)
    } catch (err: any) {
      console.error("AI Meal Completion Error:", err)
  
      if (err instanceof SyntaxError) {
        return NextResponse.json({ error: "Failed to parse model output as JSON" }, { status: 500 })
      }
  
      return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 })
    }
  }
