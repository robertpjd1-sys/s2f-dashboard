import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { Database } from "./database.types";

export function useDashboardKpis() {
  return useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: async () => {
      // Fetch active clerks count
      const { count: activeClerksCount, error: clerksError } = await supabase
        .from("clerks")
        .select("*", { count: "exact", head: true })
        .eq("status", "Active");

      if (clerksError) throw clerksError;

      // Fetch pending clerk activations
      const { count: pendingClerksCount, error: pendingError } = await supabase
        .from("clerks")
        .select("*", { count: "exact", head: true })
        .eq("status", "Pending Registration");

      // Fetch total documents ingested
      const { count: documentsCount, error: docsError } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true });

      if (docsError) throw docsError;
      
      // Fetch total chunks
      const { count: chunksCount, error: chunksError } = await supabase
        .from("chunks")
        .select("*", { count: "exact", head: true });

      return {
        activeClerks: activeClerksCount || 0,
        pendingClerks: pendingClerksCount || 0,
        totalDocuments: documentsCount || 0,
        totalChunks: chunksCount || 0,
      };
    },
  });
}

export function useClerks() {
  return useQuery({
    queryKey: ["clerks"],
    queryFn: async (): Promise<Database["public"]["Tables"]["clerks"]["Row"][]> => {
      const { data, error } = await supabase
        .from("clerks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Database["public"]["Tables"]["clerks"]["Row"][];
    },
  });
}

export function useKnowledgeBaseDocs() {
  return useQuery({
    queryKey: ["kb-docs"],
    queryFn: async (): Promise<Database["public"]["Tables"]["documents"]["Row"][]> => {
      const res = await fetch(process.env.NEXT_PUBLIC_N8N_LIST_WEBHOOK_URL!);
      if (!res.ok) {
        throw new Error("Failed to fetch knowledge base documents");
      }
      const data = await res.json();
      return data as Database["public"]["Tables"]["documents"]["Row"][];
    },
  });
}
