import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(req: NextRequest) {
  const { doc_id } = await req.json();

  if (!doc_id) {
    return NextResponse.json({ error: "doc_id is required" }, { status: 400 });
  }

  const { data: doc, error: fetchError } = await supabaseAdmin
    .from("kb_documents")
    .select("file_path, filename")
    .eq("id", doc_id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  try {
    await fetch(process.env.NEXT_PUBLIC_N8N_DELETE_WEBHOOK_URL!, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doc_id, filename: doc.filename }),
    });
  } catch (err) {
    console.error("Failed to call n8n delete webhook:", err);
  }

  await supabaseAdmin.storage.from("kb-documents").remove([doc.file_path]);

  const { error: deleteError } = await supabaseAdmin
    .from("kb_documents")
    .delete()
    .eq("id", doc_id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
