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
      // Get today's start date
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      // Total = all rows today
      const { count: total, error: errTotal } = await supabase
        .from("unanswered_queries")
        .select("*", { count: "exact", head: true })
        .gte("asked_at", todayStart.toISOString());
        
      if (errTotal) throw errTotal;

      // Needs Attention = rows where status = 'unanswered'
      const { count: unanswered } = await supabase
        .from("unanswered_queries")
        .select("*", { count: "exact", head: true })
        .eq("status", "unanswered");

      // Auto-Resolved = rows where status = 'resolved'
      const { count: resolved } = await supabase
        .from("unanswered_queries")
        .select("*", { count: "exact", head: true })
        .eq("status", "resolved");

      return {
        totalQueries: total || 0,
        unanswered: unanswered || 0,
        resolved: resolved || 0,
      };
    },
  });
}

export function useMorningBriefingKpis() {
  return useQuery({
    queryKey: ["morning-briefing-kpis"],
    queryFn: async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayIso = todayStart.toISOString();

      const { count: queriesToday } = await supabase
        .from("unanswered_queries")
        .select("*", { count: "exact", head: true })
        .gte("asked_at", todayIso);

      const { count: resolvedToday } = await supabase
        .from("unanswered_queries")
        .select("*", { count: "exact", head: true })
        .eq("status", "resolved")
        .gte("asked_at", todayIso);

      const { count: unansweredTotal } = await supabase
        .from("unanswered_queries")
        .select("*", { count: "exact", head: true })
        .eq("status", "unanswered");

      const { count: activeClerks } = await supabase
        .from("clerks")
        .select("*", { count: "exact", head: true })
        .eq("status", "Active");

      const { count: pendingActivations } = await supabase
        .from("clerks")
        .select("*", { count: "exact", head: true })
        .eq("telegram_access", false);

      // New KB Chunks Today: Chunks belonging to documents ingested today
      const { data: recentDocs } = await supabase
        .from("documents")
        .select("id")
        .gte("ingested_at", todayIso);

      let newKbChunksToday = 0;
      if (recentDocs && recentDocs.length > 0) {
        const docIds = recentDocs.map((d) => d.id);
        const { count } = await supabase
          .from("chunks")
          .select("*", { count: "exact", head: true })
          .in("doc_id", docIds);
        newKbChunksToday = count || 0;
      }

      return {
        queriesToday: queriesToday || 0,
        resolvedToday: resolvedToday || 0,
        unansweredTotal: unansweredTotal || 0,
        activeClerks: activeClerks || 0,
        pendingActivations: pendingActivations || 0,
        newKbChunksToday,
      };
    },
  });
}

export function useRecentUnresolvedQueries() {
  return useQuery({
    queryKey: ["recent-unresolved-queries"],
    queryFn: async (): Promise<Database["public"]["Tables"]["unanswered_queries"]["Row"][]> => {
      const { data, error } = await supabase
        .from("unanswered_queries")
        .select("*")
        .eq("status", "unanswered")
        .order("asked_at", { ascending: true })
        .limit(5);

      if (error) throw error;
      return data as Database["public"]["Tables"]["unanswered_queries"]["Row"][];
    },
  });
}

export function useKbHealthStats() {
  return useQuery({
    queryKey: ["kb-health-stats"],
    queryFn: async () => {
      const { count: totalChunks } = await supabase
        .from("chunks")
        .select("*", { count: "exact", head: true })
        .not("file_name", "is", null);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { data: recentDocs } = await supabase
        .from("documents")
        .select("id")
        .gte("ingested_at", todayStart.toISOString());

      let chunksAddedToday = 0;
      if (recentDocs && recentDocs.length > 0) {
        const docIds = recentDocs.map((d) => d.id);
        const { count } = await supabase
          .from("chunks")
          .select("*", { count: "exact", head: true })
          .in("doc_id", docIds);
        chunksAddedToday = count || 0;
      }

      const { data: latestDoc } = await supabase
        .from("documents")
        .select("ingested_at")
        .order("ingested_at", { ascending: false })
        .limit(1)
        .single();

      return {
        totalChunks: totalChunks || 0,
        chunksAddedToday,
        mostRecentIngestionDate: latestDoc?.ingested_at || null,
      };
    },
  });
}
