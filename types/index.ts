// WhatsMyName Search Result Types
export interface SearchResult {
  source: string;
  username: string;
  url: string;
  isNSFW: boolean;
  category: string;
  tags?: string[];
  checkResult: {
    status: number;
    checkType: string;
    isExist: boolean;
    url?: string;
    urlMain?: string;
    responseUrl?: string;
    responseTime: number;
    message?: string;
  };
}

export interface SearchProgress {
  total: number;
  completed: number;
  percentage: number;
}

export interface SearchMetadata {
  total?: number;
  completed?: boolean;
}

// Google Custom Search Result Types
export interface GoogleResult {
  title: string;
  link: string;
  displayLink: string;
  snippet: string;
  formattedUrl?: string;
  htmlFormattedUrl?: string;
  htmlSnippet?: string;
  htmlTitle?: string;
}

export interface GoogleSearchResponse {
  items: GoogleResult[];
  searchInformation?: {
    totalResults: string;
    searchTime: number;
  };
  query?: string;
  startIndex?: number;
  nextStartIndex?: number;
}

// AI Chat Types
export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface AITemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon?: string;
}

export interface AIStreamChunk {
  content: string;
  done: boolean;
}

// Search Store Types
export interface SearchState {
  username: string;
  isSearching: boolean;
  whatsMyNameResults: SearchResult[];
  googleResults: GoogleResult[];
  googleQuery: string | null;
  googleSearchInformation: GoogleSearchResponse["searchInformation"] | null;
  googleNextStartIndex: number | null;
  googleIsLoadingMore: boolean;
  googleError: string | null;
  progress: SearchProgress;
  error: string | null;

  // Actions
  setUsername: (username: string) => void;
  startSearch: () => void;
  stopSearch: () => void;
  addWhatsMyNameResult: (result: SearchResult) => void;
  addWhatsMyNameResults: (results: SearchResult[]) => void;
  setGoogleResponse: (response: GoogleSearchResponse) => void;
  appendGoogleResults: (response: GoogleSearchResponse) => void;
  setGoogleLoadingMore: (isLoading: boolean) => void;
  setGoogleError: (error: string | null) => void;
  setProgressTotal: (total: number) => void;
  incrementProgressCompleted: () => void;
  incrementProgressCompletedBy: (count: number) => void;
  completeProgress: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// AI Store Types
export interface AIState {
  isOpen: boolean;
  messages: AIMessage[];
  isStreaming: boolean;
  currentTemplate: AITemplate | null;
  error: string | null;

  // Actions
  openDialog: () => void;
  closeDialog: () => void;
  addMessage: (message: AIMessage) => void;
  setStreaming: (isStreaming: boolean) => void;
  setTemplate: (template: AITemplate | null) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  reset: () => void;
}

// Filter and Sort Types
export type ResultStatus = "all" | "found" | "not-found";
export type SortBy = "default" | "response-time" | "alphabetical";
export type SortOrder = "asc" | "desc";

export interface FilterOptions {
  status: ResultStatus;
  category: string | null;
  showNSFW: boolean;
  searchQuery: string;
}

export interface SortOptions {
  sortBy: SortBy;
  order: SortOrder;
}

// API Error Types
export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

// Component Props Types
export interface SearchBarProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export interface PlatformCardProps {
  result: SearchResult;
  index?: number;
}

export interface GoogleResultCardProps {
  result: GoogleResult;
  index?: number;
}

export interface ResultsHeaderProps {
  totalResults: number;
  foundResults: number;
  isLoading: boolean;
}

export interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
}

// Brand Icon Mapping
export interface BrandIcon {
  domain: string;
  icon: string;
  color?: string;
}

// Virtualization Types
export interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}
