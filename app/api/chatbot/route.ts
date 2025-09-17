import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Server misconfigured: missing GOOGLE_GEMINI_API_KEY" }, { status: 500 })
    }

    const { message, history, language } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid request: missing message" }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const systemPreamble = language === "hi"
      ? `आप एक सहानुभूतिपूर्ण, युवा-हितैषी मानसिक स्वास्थ्य सहायक हैं, जो कॉलेज छात्रों की चुनौतियों (करियर, अकादमिक, रिश्ते) पर केंद्रित है। आप पेशेवर निदान नहीं देते। यदि संकट के संकेत हों, तो स्थानीय आपातकालीन सेवाओं/क्राइसिस हेल्पलाइन का सुझाव दें। आपकी शैली: गर्मजोशी, सरल भाषा, छोटे पैराग्राफ, व्यावहारिक अगले कदम, और सशक्तिकरण।`
      : `You are an empathetic, youth-friendly mental health assistant focused on college students' challenges (career, academics, relationships). You do not provide professional diagnosis. If crisis intent appears, advise contacting local emergency services or a crisis hotline. Tone: warm, relatable, concise paragraphs, practical next steps, and empowerment.`

    const conversation = [
      { role: "user", parts: [{ text: systemPreamble }] },
      ...((Array.isArray(history) ? history : []) as Array<{ sender: string; content: string }>).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ]

    const result = await model.generateContent({ contents: conversation })
    const text = result.response.text()

    return NextResponse.json({ reply: text })
  } catch (err: any) {
    console.error("/api/chatbot error", err)
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 })
  }
} 