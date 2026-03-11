import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export function useActivateClerk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, email }: { id: string; email: string }) => {
      // 1. Trigger the n8n webhook
      const webhookRes = await fetch("https://robertpjd1.app.n8n.cloud/webhook/unlock-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!webhookRes.ok) {
        throw new Error("Failed to trigger webhook activation");
      }

      // 2. Update the status in Supabase
      const { data, error } = await supabase
        .from("clerks")
        .update({ status: "Activation Sent" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate the clerks query to refetch data
      queryClient.invalidateQueries({ queryKey: ["clerks"] });
      // Also invalidate kpis to update the pending count
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
    },
  });
}

export function useUploadKbDoc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(process.env.NEXT_PUBLIC_N8N_UPLOAD_WEBHOOK_URL!, {
        method: "POST",
        body: formData, // Browser automatically sets Content-Type to multipart/form-data with bounds
      });
      if (!res.ok) {
        throw new Error("Failed to upload document");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kb-docs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
    },
  });
}

export function useDeleteKbDoc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ doc_id }: { doc_id: string }) => {
      const res = await fetch(process.env.NEXT_PUBLIC_N8N_DELETE_WEBHOOK_URL!, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id }),
      });
      if (!res.ok) {
        throw new Error("Failed to delete document");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kb-docs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
    },
  });
}
