import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const stats = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      // Fallback if no API key is set
      console.warn("ANTHROPIC_API_KEY is not set. Returning fallback data.");
      return NextResponse.json({
        greeting: `Good morning, Cosmina! Today we have ${stats.queriesToday || 0} queries with ${stats.unansweredTotal || 0} needing attention. You have ${stats.activeClerks || 0} active clerks on the platform. Have a wonderful day!`,
        action: `Review the ${stats.unansweredTotal || 0} unanswered queries to maintain our resolution rate.`,
      });
    }

    const systemPrompt = `You are a helpful AI assistant powering a dashboard for a user named Cosmina. Your job is to generate a beautiful, warm morning briefing and a single smart action based on the live stats provided. 
    
Return a JSON object with exactly two keys:
1. "greeting": A warm 3-sentence morning briefing addressed to "Cosmina" summarising the day's stats.
2. "action": One specific recommended action for Cosmina today based on these stats. Keep it concise and actionable.

Stats for today:
${JSON.stringify(stats, null, 2)}
`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", // As requested by user, falling back to standard if invalid
        max_tokens: 1000,
        messages: [
          { role: "user", content: systemPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Anthropic API Error:", errorData);
      
      // If the specific requested model fails (it's a future date), fallback to standard sonnet
      if (response.status === 400 || response.status === 404) {
         const fallbackResponse = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.ANTHROPIC_API_KEY,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-3-5-sonnet-20241022",
              max_tokens: 1000,
              messages: [
                { role: "user", content: systemPrompt + "\n\nCRITICAL: You must return valid JSON, and only JSON, starting with '{'." }
              ],
            }),
          });
          
          if (fallbackResponse.ok) {
            const fbData = await fallbackResponse.json();
            const textContent = fbData.content[0].text;
            
            try {
              // Parse out json if there is any markdown backticks
              const jsonStr = textContent.replace(/```json\n?|\n?```/g, '');
              const parsed = JSON.parse(jsonStr);
              return NextResponse.json(parsed);
            } catch (e) {
               return NextResponse.json({
                  greeting: `Good morning, Cosmina! Today we have ${stats.queriesToday || 0} queries with ${stats.unansweredTotal || 0} needing attention. Have a wonderful day!`,
                  action: `Review the ${stats.unansweredTotal || 0} unanswered queries.`,
                });
            }
          }
      }

      throw new Error("Failed to generate AI briefing");
    }

    const data = await response.json();
    const textContent = data.content[0].text;
    
    // Safety parse for JSON code blocks
    const jsonStr = textContent.replace(/```json\n?|\n?```/g, '');
    let parsedData = { greeting: "", action: "" };
    try {
      parsedData = JSON.parse(jsonStr);
    } catch (err) {
      console.error("Failed to parse Claude JSON response:", textContent);
      parsedData = {
        greeting: "Good morning, Cosmina! Looking at your dashboard today.",
        action: "Review your unanswered queries.",
      };
    }

    // Generate audio with ElevenLabs
    let audioBase64 = null;
    if (process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID && parsedData.greeting) {
      try {
        const ttsResponse = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": process.env.ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
              model_id: "eleven_multilingual_v2",
              text: parsedData.greeting,
            }),
          }
        );

        if (ttsResponse.ok) {
          const audioBuffer = await ttsResponse.arrayBuffer();
          audioBase64 = Buffer.from(audioBuffer).toString("base64");
        } else {
          console.error("ElevenLabs API Error:", await ttsResponse.text());
        }
      } catch (ttsErr) {
        console.error("ElevenLabs Generation Error:", ttsErr);
      }
    }

    return NextResponse.json({
      ...parsedData,
      audio: audioBase64
    });
  } catch (err) {
    console.error("Briefing Generation Error:", err);
    return NextResponse.json(
      { error: "Failed to generate briefing" },
      { status: 500 }
    );
  }
}
