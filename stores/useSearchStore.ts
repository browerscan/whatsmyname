import { create } from "zustand";
import {
  SearchState,
  SearchResult,
  SearchProgress,
  GoogleSearchResponse,
} from "@/types";

const initialProgress: SearchProgress = {
  total: 0,
  completed: 0,
  percentage: 0,
};

function calculateProgress(total: number, completed: number): SearchProgress {
  const safeTotal = Math.max(0, total);
  const safeCompleted = Math.max(0, Math.min(completed, safeTotal));
  const percentage =
    safeTotal > 0 ? Math.round((safeCompleted / safeTotal) * 100) : 0;
  return { total: safeTotal, completed: safeCompleted, percentage };
}

export const useSearchStore = create<SearchState>((set) => ({
  username: "",
  isSearching: false,
  whatsMyNameResults: [],
  googleResults: [],
  googleQuery: null,
  googleSearchInformation: null,
  googleNextStartIndex: null,
  googleIsLoadingMore: false,
  googleError: null,
  progress: initialProgress,
  error: null,

  setUsername: (username: string) => set({ username }),

  startSearch: () =>
    set({
      isSearching: true,
      whatsMyNameResults: [],
      googleResults: [],
      googleQuery: null,
      googleSearchInformation: null,
      googleNextStartIndex: null,
      googleIsLoadingMore: false,
      googleError: null,
      progress: initialProgress,
      error: null,
    }),

  stopSearch: () => set({ isSearching: false }),

  addWhatsMyNameResult: (result: SearchResult) =>
    set((state) => ({
      whatsMyNameResults: [...state.whatsMyNameResults, result],
    })),

  addWhatsMyNameResults: (results: SearchResult[]) =>
    set((state) => ({
      whatsMyNameResults: state.whatsMyNameResults.concat(results),
    })),

  setGoogleResponse: (response: GoogleSearchResponse) =>
    set({
      googleResults: response.items || [],
      googleQuery: response.query ?? null,
      googleSearchInformation: response.searchInformation ?? null,
      googleNextStartIndex: response.nextStartIndex ?? null,
      googleError: null,
    }),

  appendGoogleResults: (response: GoogleSearchResponse) =>
    set((state) => ({
      googleResults: [...state.googleResults, ...(response.items || [])],
      googleNextStartIndex: response.nextStartIndex ?? null,
      googleIsLoadingMore: false,
    })),

  setGoogleLoadingMore: (isLoading: boolean) =>
    set({ googleIsLoadingMore: isLoading }),

  setGoogleError: (error: string | null) =>
    set({
      googleError: error,
      googleResults: [],
      googleQuery: null,
      googleSearchInformation: null,
      googleNextStartIndex: null,
      googleIsLoadingMore: false,
    }),

  setProgressTotal: (total: number) =>
    set((state) => ({
      progress: calculateProgress(total, state.progress.completed),
    })),

  incrementProgressCompleted: () =>
    set((state) => ({
      progress: calculateProgress(
        state.progress.total,
        state.progress.completed + 1,
      ),
    })),

  incrementProgressCompletedBy: (count: number) =>
    set((state) => ({
      progress: calculateProgress(
        state.progress.total,
        state.progress.completed + Math.max(0, count),
      ),
    })),

  completeProgress: () =>
    set((state) => ({
      progress: calculateProgress(state.progress.total, state.progress.total),
    })),

  setError: (error: string | null) => set({ error, isSearching: false }),

  reset: () =>
    set({
      username: "",
      isSearching: false,
      whatsMyNameResults: [],
      googleResults: [],
      googleQuery: null,
      googleSearchInformation: null,
      googleNextStartIndex: null,
      googleIsLoadingMore: false,
      googleError: null,
      progress: initialProgress,
      error: null,
    }),
}));
