import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.93.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { capturedImage } = await req.json();
    if (!capturedImage) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch students with photos
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, admission_number, profiles(full_name, email, avatar_url)")
      .not("profiles.avatar_url", "is", null);

    if (studentsError) throw studentsError;

    const studentsWithPhotos = (students || []).filter(
      (s: any) => s.profiles?.avatar_url
    );

    if (studentsWithPhotos.length === 0) {
      return new Response(JSON.stringify({
        recognized: false,
        message: "No students with photos found in the system",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build the prompt with student references
    const studentList = studentsWithPhotos.map((s: any, i: number) => 
      `Student ${i + 1}: Name="${s.profiles.full_name}", ID="${s.admission_number || s.id}"`
    ).join("\n");

    const studentPhotoUrls = studentsWithPhotos.map((s: any) => s.profiles.avatar_url);

    // Use Gemini vision to compare faces
    const messages: any[] = [
      {
        role: "system",
        content: `You are a face recognition system for a college attendance system. You will receive a captured photo and reference student photos. Your job is to determine if the captured face matches any of the registered students.

Registered students:
${studentList}

IMPORTANT: Respond ONLY with a JSON object in this exact format:
- If matched: {"recognized": true, "studentIndex": <0-based index>, "confidence": <0.0-1.0>}
- If not matched: {"recognized": false, "confidence": 0}

Do NOT include any other text.`,
      },
      {
        role: "user",
        content: [
          { type: "text", text: "This is the captured photo from the camera. Compare it against the registered student photos and identify if it matches any student." },
          { type: "image_url", image_url: { url: capturedImage } },
          ...studentPhotoUrls.map((url: string) => ({
            type: "image_url",
            image_url: { url },
          })),
        ],
      },
    ];

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        stream: false,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted, please add credits" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse the AI response
    let result: { recognized: boolean; studentIndex?: number; confidence: number };
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({
        recognized: false,
        message: "Could not process face recognition result",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (result.recognized && result.studentIndex !== undefined && result.studentIndex < studentsWithPhotos.length) {
      const matched = studentsWithPhotos[result.studentIndex] as any;

      // Record attendance
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const timeStr = now.toTimeString().split(" ")[0].slice(0, 5);

      // Check if already marked today
      const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("student_id", matched.id)
        .eq("date", dateStr)
        .maybeSingle();

      if (!existing) {
        await supabase.from("attendance").insert({
          student_id: matched.id,
          date: dateStr,
          status: "present",
          check_in: timeStr,
        });
      }

      return new Response(JSON.stringify({
        recognized: true,
        confidence: result.confidence,
        student: {
          id: matched.id,
          full_name: matched.profiles.full_name,
          admission_number: matched.admission_number,
          avatar_url: matched.profiles.avatar_url,
        },
        timestamp: now.toLocaleString(),
        alreadyMarked: !!existing,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      recognized: false,
      confidence: result.confidence || 0,
      message: "Face not recognized. Please try again or contact admin.",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("face-recognition error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
