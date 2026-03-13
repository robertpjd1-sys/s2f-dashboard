import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export function useActivateClerk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, email }: { id: string; email: string }) => {
      const webhookRes = await fetch("https://robertpjd1.app.n8n.cloud/webhook/unlock-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!webhookRes.ok) {
        throw new Error("Failed to trigger webhook activation");
      }

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
      queryClient.invalidateQueries({ queryKey: ["clerks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
    },
  });
}

export function useUploadKbDoc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/kb/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to upload document");
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
      const res = await fetch("/api/kb/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete document");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kb-docs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
    },
  });
}

export function useResolveQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, resolution, question }: { id: string; resolution: string; question: string }) => {
      const webhookRes = await fetch("https://robertpjd1.app.n8n.cloud/webhook/s2f-resolve-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resolution, question }),
      });

      if (!webhookRes.ok) {
        throw new Error("Failed to trigger resolve webhook");
      }

      return webhookRes.json().catch(() => ({ success: true }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queries-feed"] });
      queryClient.invalidateQueries({ queryKey: ["query-feed-kpis"] });
    },
  });
}

export function useInviteClerk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ full_name, email, location }: { full_name: string; email: string; location: string }) => {
      const response = await fetch("/api/clerks/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name, email, location }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to invite clerk");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clerks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
    },
  });
}
