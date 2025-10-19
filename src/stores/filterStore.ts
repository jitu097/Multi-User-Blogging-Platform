import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Enhanced filter state with more comprehensive filtering options
interface FilterState {
  // Search and basic filters
  searchQuery: string;
  selectedCategoryId: number | null;
  selectedTagIds: number[];
  showPublishedOnly: boolean;
  
  // Advanced filters
  authorId: number | null;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  sortBy: 'createdAt' | 'updatedAt' | 'title' | 'viewCount';
  sortOrder: 'asc' | 'desc';
  
  // UI state
  isFilterPanelOpen: boolean;
  hasActiveFilters: boolean;
  
  // History for undo functionality
  filterHistory: FilterState[];
  historyIndex: number;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (id: number | null) => void;
  setSelectedTagIds: (ids: number[]) => void;
  addTagId: (id: number) => void;
  removeTagId: (id: number) => void;
  setShowPublishedOnly: (show: boolean) => void;
  setAuthorId: (id: number | null) => void;
  setDateRange: (range: { from: Date | null; to: Date | null }) => void;
  setSortBy: (sortBy: FilterState['sortBy']) => void;
  setSortOrder: (order: FilterState['sortOrder']) => void;
  setFilterPanelOpen: (open: boolean) => void;
  
  // Complex actions
  clearFilters: () => void;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Computed values
  getActiveFiltersCount: () => number;
  getFilterSummary: () => string;
}

const initialState = {
  searchQuery: "",
  selectedCategoryId: null,
  selectedTagIds: [],
  showPublishedOnly: false,
  authorId: null,
  dateRange: { from: null, to: null },
  sortBy: 'createdAt' as const,
  sortOrder: 'desc' as const,
  isFilterPanelOpen: false,
  hasActiveFilters: false,
  filterHistory: [],
  historyIndex: -1,
};

export const useFilterStore = create<FilterState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,
          
          setSearchQuery: (query) => 
            set((state) => {
              state.searchQuery = query;
              state.hasActiveFilters = get().getActiveFiltersCount() > 0;
            }),
            
          setSelectedCategoryId: (id) =>
            set((state) => {
              state.selectedCategoryId = id;
              state.hasActiveFilters = get().getActiveFiltersCount() > 0;
            }),
            
          setSelectedTagIds: (ids) =>
            set((state) => {
              state.selectedTagIds = ids;
              state.hasActiveFilters = get().getActiveFiltersCount() > 0;
            }),
            
          addTagId: (id) =>
            set((state) => {
              if (!state.selectedTagIds.includes(id)) {
                state.selectedTagIds.push(id);
                state.hasActiveFilters = get().getActiveFiltersCount() > 0;
              }
            }),
            
          removeTagId: (id) =>
            set((state) => {
              state.selectedTagIds = state.selectedTagIds.filter((tagId: number) => tagId !== id);
              state.hasActiveFilters = get().getActiveFiltersCount() > 0;
            }),
            
          setShowPublishedOnly: (show) =>
            set((state) => {
              state.showPublishedOnly = show;
              state.hasActiveFilters = get().getActiveFiltersCount() > 0;
            }),
            
          setAuthorId: (id) =>
            set((state) => {
              state.authorId = id;
              state.hasActiveFilters = get().getActiveFiltersCount() > 0;
            }),
            
          setDateRange: (range) =>
            set((state) => {
              state.dateRange = range;
              state.hasActiveFilters = get().getActiveFiltersCount() > 0;
            }),
            
          setSortBy: (sortBy) =>
            set((state) => {
              state.sortBy = sortBy;
            }),
            
          setSortOrder: (order) =>
            set((state) => {
              state.sortOrder = order;
            }),
            
          setFilterPanelOpen: (open) =>
            set((state) => {
              state.isFilterPanelOpen = open;
            }),
            
          clearFilters: () =>
            set((state) => {
              get().saveToHistory();
              Object.assign(state, {
                ...initialState,
                sortBy: state.sortBy,
                sortOrder: state.sortOrder,
                isFilterPanelOpen: state.isFilterPanelOpen,
              });
            }),
            
          saveToHistory: () =>
            set((state) => {
              const currentState = { ...get() };
              const stateToSave = {
                ...currentState,
                filterHistory: undefined,
                historyIndex: undefined,
              };
              
              // Limit history size
              if (state.filterHistory.length >= 10) {
                state.filterHistory.shift();
              }
              
              state.filterHistory.push(stateToSave as any);
              state.historyIndex = state.filterHistory.length - 1;
            }),
            
          undo: () =>
            set((state) => {
              if (get().canUndo()) {
                const previousState = state.filterHistory[state.historyIndex - 1];
                if (previousState) {
                  Object.assign(state, previousState);
                  state.historyIndex--;
                }
              }
            }),
            
          redo: () =>
            set((state) => {
              if (get().canRedo()) {
                const nextState = state.filterHistory[state.historyIndex + 1];
                if (nextState) {
                  Object.assign(state, nextState);
                  state.historyIndex++;
                }
              }
            }),
            
          canUndo: () => {
            const state = get();
            return state.historyIndex > 0;
          },
          
          canRedo: () => {
            const state = get();
            return state.historyIndex < state.filterHistory.length - 1;
          },
          
          getActiveFiltersCount: () => {
            const state = get();
            let count = 0;
            
            if (state.searchQuery) count++;
            if (state.selectedCategoryId) count++;
            if (state.selectedTagIds.length > 0) count++;
            if (state.showPublishedOnly) count++;
            if (state.authorId) count++;
            if (state.dateRange.from || state.dateRange.to) count++;
            
            return count;
          },
          
          getFilterSummary: () => {
            const state = get();
            const parts = [];
            
            if (state.searchQuery) parts.push(`Search: "${state.searchQuery}"`);
            if (state.selectedCategoryId) parts.push(`Category: ${state.selectedCategoryId}`);
            if (state.selectedTagIds.length > 0) parts.push(`Tags: ${state.selectedTagIds.length}`);
            if (state.showPublishedOnly) parts.push('Published only');
            if (state.authorId) parts.push(`Author: ${state.authorId}`);
            if (state.dateRange.from || state.dateRange.to) parts.push('Date range');
            
            return parts.length > 0 ? parts.join(', ') : 'No active filters';
          },
        }))
      ),
      {
        name: "filter-store",
        partialize: (state) => ({
          // Only persist certain parts of the state
          searchQuery: state.searchQuery,
          selectedCategoryId: state.selectedCategoryId,
          selectedTagIds: state.selectedTagIds,
          showPublishedOnly: state.showPublishedOnly,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    { name: "filter-store" }
  )
);