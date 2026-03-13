import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { full_name, email, location } = await req.json();

    if (!full_name || !email || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const registration_token = crypto.randomUUID();
    
    const { data, error } = await supabaseAdmin
      .from("clerks")
      .insert({
        full_name,
        email,
        location,
        status: "Pending Confirmation",
        registration_token,
        invited_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Admin Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
