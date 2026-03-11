import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const category = formData.get("category") as string;
  const uploadedBy = formData.get("uploaded_by") as string;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

  const { error: storageError } = await supabaseAdmin.storage
    .from("kb-documents")
    .upload(filePath, buffer, { contentType: file.type });

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  const { data: urlData } = await supabaseAdmin.storage
    .from("kb-documents")
    .createSignedUrl(filePath, 60 * 60 * 24 * 7);

  const { data: doc, error: dbError } = await supabaseAdmin
    .from("kb_documents")
    .insert({
      filename: file.name,
      file_path: filePath,
      file_size: file.size,
      uploaded_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (dbError) {
    await supabaseAdmin.storage.from("kb-documents").remove([filePath]);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  try {
    await fetch(process.env.NEXT_PUBLIC_N8N_UPLOAD_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doc_id: doc.id,
        filename: file.name,
        file_path: filePath,
        file_url: urlData?.signedUrl,
        category: category || "General",
        uploaded_by: uploadedBy || "Admin",
        file_size: file.size,
      }),
    });
  } catch (err) {
    console.error("Failed to call n8n upload webhook:", err);
  }

  return NextResponse.json(doc);
}
