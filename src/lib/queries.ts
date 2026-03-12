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
        .select("*", { count: "exact", head: true })
        .not("file_name", "is", null);

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

export function useQueriesFeed() {
  return useQuery({
    queryKey: ["queries-feed"],
    queryFn: async (): Promise<Database["public"]["Tables"]["unanswered_queries"]["Row"][]> => {
      const { data, error } = await supabase
        .from("unanswered_queries")
        .select("*")
        .order("asked_at", { ascending: false });

      if (error) throw error;
      return data as Database["public"]["Tables"]["unanswered_queries"]["Row"][];
    },
  });
}

export function useQueryFeedKpis() {
  return useQuery({
    queryKey: ["query-feed-kpis"],
    queryFn: async () => {
      // We can do this in one call or multiple. Usually multiple counts is fine for dashboard.
      const { count: total, error: errTotal } = await supabase
        .from("unanswered_queries")
        .select("*", { count: "exact", head: true });
        
      if (errTotal) throw errTotal;

      const { count: unanswered } = await supabase
        .from("unanswered_queries")
        .select("*", { count: "exact", head: true })
        .eq("status", "unanswered");

      // For "Resolved This Week", we use a rough approximation (last 7 days)
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const { count: resolvedWeek } = await supabase
        .from("unanswered_queries")
        .select("*", { count: "exact", head: true })
        .eq("status", "resolved")
        .gte("asked_at", lastWeek.toISOString());

      return {
        totalQueries: total || 0,
        unanswered: unanswered || 0,
        resolvedThisWeek: resolvedWeek || 0,
      };
    },
  });
}
