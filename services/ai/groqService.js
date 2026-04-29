import { groqClient } from "../../config/groq.js";
import Chat from "../../models/Chat.js";

export const generateEmotionAndResponse = async ({ text, userId }) => {
  // fetch conv history
  const history = await Chat.find({ userId })
    .sort({ createdAt: 1 })
    .limit(10)
    .lean();

  const message = history.map((chat) => ({
    role: chat.role,
    content: chat.content,
  }));

  const prompt = `
 User message: "${text}"

Step 1: Detect emotion STRICTLY from:
[joy, sadness, anger, anxiety, neutral]

Rules:
- If message contains "sad" → MUST return "sadness"
- If message contains "happy" → MUST return "joy"
- If message contains "angry" → MUST return "anger"
- If message contains "worried", "nervous" → MUST return "anxiety"
- Do NOT output neutral if clear emotion exists

Step 2: Respond like a meditation coach:
- Max 2 sentences
- Calm and supportive
- One actionable suggestion

Return ONLY JSON:
{
  "emotion": "one of [joy, sadness, anger, anxiety, neutral]",
  "response": "your response here"
}
 `;

  try {
    const res = await groqClient.post("/chat/completions", {
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an emotion classifier." },
        ...message,
        { role: "user", content: prompt },
      ],
    });

    const raw = res.data?.choices?.[0]?.message?.content?.trim();

    console.log("EMOTION RAW:", raw);

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return {
        emotion: "neutral",
        response: "Take a deep breath and relax for a moment.",
      };
    }

    return {
      emotion: parsed.emotion || "neutral",
      response: parsed.response || "Take a deep breath and relax.",
    };
  } catch (err) {
    console.log("ERROR:", err.message);
    return {
      emotion: "neutral",
      response: "Take a deep breath and relax for a moment.",
    };
  }
};
