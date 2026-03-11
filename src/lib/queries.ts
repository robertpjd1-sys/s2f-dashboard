import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { Database } from "./database.types";

export type KbDocument = {
  id: number;
  filename: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
  created_at: string;
};

export function useDashboardKpis() {
  return useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: async () => {
      const { count: activeClerksCount, error: clerksError } = await supabase
        .from("clerks")
        .select("*", { count: "exact", head: true })
        .eq("status", "Active");

      if (clerksError) throw clerksError;

      const { count: pendingClerksCount } = await supabase
        .from("clerks")
        .select("*", { count: "exact", head: true })
        .eq("status", "Pending Registration");

      const { count: documentsCount, error: docsError } = await supabase
        .from("kb_documents")
        .select("*", { count: "exact", head: true });

      if (docsError) throw docsError;

      const { count: chunksCount } = await supabase
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
    queryFn: async (): Promise<KbDocument[]> => {
      const res = await fetch("/api/kb/list");
      if (!res.ok) {
        throw new Error("Failed to fetch knowledge base documents");
      }
      return res.json();
    },
  });
}
