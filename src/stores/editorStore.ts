import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { PostWithCategories } from "@/types";

/**
 * Represents a draft export of editor content.
 * Used for saving/loading editor state to/from local storage or server.
 */
interface EditorDraft {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  selectedCategoryIds: number[];
  selectedTagIds: number[];
  published: boolean;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  timestamp: Date;
}

// Enhanced editor state with comprehensive post editing capabilities
interface EditorState {
  // Core editing state
  isEditing: boolean;
  currentPostId: number | null;
  isDraft: boolean;
  hasUnsavedChanges: boolean;
  
  // Content state
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  
  // Metadata
  selectedCategoryIds: number[];
  selectedTagIds: number[];
  featured: boolean;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  
  // Editor UI state
  isPreviewMode: boolean;
  isFullscreen: boolean;
  wordCount: number;
  readingTime: number;
  lastSaved: Date | null;
  
  // Auto-save and history
  autoSaveEnabled: boolean;
  saveHistory: Array<{
    timestamp: Date;
    content: string;
    title: string;
  }>;
  currentHistoryIndex: number;
  
  // Validation state
  validationErrors: Record<string, string>;
  isValid: boolean;
  
  // Actions - Core
  setIsEditing: (editing: boolean) => void;
  setCurrentPostId: (id: number | null) => void;
  setIsDraft: (draft: boolean) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  
  // Actions - Content
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setExcerpt: (excerpt: string) => void;
  setSlug: (slug: string) => void;
  generateSlugFromTitle: () => void;
  
  // Actions - Metadata
  setSelectedCategoryIds: (ids: number[]) => void;
  addCategoryId: (id: number) => void;
  removeCategoryId: (id: number) => void;
  setSelectedTagIds: (ids: number[]) => void;
  addTagId: (id: number) => void;
  removeTagId: (id: number) => void;
  setFeatured: (featured: boolean) => void;
  setPublished: (published: boolean) => void;
  setSeoTitle: (title: string) => void;
  setSeoDescription: (description: string) => void;
  
  // Actions - UI
  setPreviewMode: (preview: boolean) => void;
  setFullscreen: (fullscreen: boolean) => void;
  togglePreviewMode: () => void;
  toggleFullscreen: () => void;
  
  // Actions - Auto-save and History
  setAutoSaveEnabled: (enabled: boolean) => void;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => void;
  setLastSaved: (date: Date) => void;
  
  // Actions - Validation
  validatePost: () => void;
  clearValidationErrors: () => void;
  
  // Actions - Complex
  resetEditor: () => void;
  loadPost: (post: Partial<PostWithCategories>) => void;
  exportDraft: () => EditorDraft;
  updateWordCount: () => void;
  
  // Computed values
  getPostSummary: () => string;
  getCompletionPercentage: () => number;
}

const initialState = {
  isEditing: false,
  currentPostId: null,
  isDraft: true,
  hasUnsavedChanges: false,
  title: "",
  content: "",
  excerpt: "",
  slug: "",
  selectedCategoryIds: [],
  selectedTagIds: [],
  featured: false,
  published: false,
  seoTitle: "",
  seoDescription: "",
  isPreviewMode: false,
  isFullscreen: false,
  wordCount: 0,
  readingTime: 0,
  lastSaved: null,
  autoSaveEnabled: true,
  saveHistory: [],
  currentHistoryIndex: -1,
  validationErrors: {},
  isValid: false,
};

// Utility functions
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,
          
          // Core actions
          setIsEditing: (editing) =>
            set((state) => {
              state.isEditing = editing;
            }),
            
          setCurrentPostId: (id) =>
            set((state) => {
              state.currentPostId = id;
            }),
            
          setIsDraft: (draft) =>
            set((state) => {
              state.isDraft = draft;
            }),
            
          setHasUnsavedChanges: (hasChanges) =>
            set((state) => {
              state.hasUnsavedChanges = hasChanges;
            }),
            
          // Content actions
          setTitle: (title) =>
            set((state) => {
              state.title = title;
              state.hasUnsavedChanges = true;
              if (!state.seoTitle) {
                state.seoTitle = title.slice(0, 60);
              }
              get().validatePost();
            }),
            
          setContent: (content) =>
            set((state) => {
              state.content = content;
              state.hasUnsavedChanges = true;
              get().updateWordCount();
              get().validatePost();
            }),
            
          setExcerpt: (excerpt) =>
            set((state) => {
              state.excerpt = excerpt;
              state.hasUnsavedChanges = true;
              if (!state.seoDescription) {
                state.seoDescription = excerpt.slice(0, 160);
              }
            }),
            
          setSlug: (slug) =>
            set((state) => {
              state.slug = slug;
              state.hasUnsavedChanges = true;
              get().validatePost();
            }),
            
          generateSlugFromTitle: () =>
            set((state) => {
              if (state.title) {
                state.slug = generateSlug(state.title);
                state.hasUnsavedChanges = true;
              }
            }),
            
          // Metadata actions
          setSelectedCategoryIds: (ids) =>
            set((state) => {
              state.selectedCategoryIds = ids;
              state.hasUnsavedChanges = true;
            }),
            
          addCategoryId: (id) =>
            set((state) => {
              if (!state.selectedCategoryIds.includes(id)) {
                state.selectedCategoryIds.push(id);
                state.hasUnsavedChanges = true;
              }
            }),
            
          removeCategoryId: (id) =>
            set((state) => {
              state.selectedCategoryIds = state.selectedCategoryIds.filter((catId: number) => catId !== id);
              state.hasUnsavedChanges = true;
            }),
            
          setSelectedTagIds: (ids) =>
            set((state) => {
              state.selectedTagIds = ids;
              state.hasUnsavedChanges = true;
            }),
            
          addTagId: (id) =>
            set((state) => {
              if (!state.selectedTagIds.includes(id)) {
                state.selectedTagIds.push(id);
                state.hasUnsavedChanges = true;
              }
            }),
            
          removeTagId: (id) =>
            set((state) => {
              state.selectedTagIds = state.selectedTagIds.filter((tagId: number) => tagId !== id);
              state.hasUnsavedChanges = true;
            }),
            
          setFeatured: (featured) =>
            set((state) => {
              state.featured = featured;
              state.hasUnsavedChanges = true;
            }),
            
          setPublished: (published) =>
            set((state) => {
              state.published = published;
              state.hasUnsavedChanges = true;
            }),
            
          setSeoTitle: (title) =>
            set((state) => {
              state.seoTitle = title;
              state.hasUnsavedChanges = true;
            }),
            
          setSeoDescription: (description) =>
            set((state) => {
              state.seoDescription = description;
              state.hasUnsavedChanges = true;
            }),
            
          // UI actions
          setPreviewMode: (preview) =>
            set((state) => {
              state.isPreviewMode = preview;
            }),
            
          setFullscreen: (fullscreen) =>
            set((state) => {
              state.isFullscreen = fullscreen;
            }),
            
          togglePreviewMode: () =>
            set((state) => {
              state.isPreviewMode = !state.isPreviewMode;
            }),
            
          toggleFullscreen: () =>
            set((state) => {
              state.isFullscreen = !state.isFullscreen;
            }),
            
          // History and auto-save
          setAutoSaveEnabled: (enabled) =>
            set((state) => {
              state.autoSaveEnabled = enabled;
            }),
            
          saveToHistory: () =>
            set((state) => {
              const historyEntry = {
                timestamp: new Date(),
                content: state.content,
                title: state.title,
              };
              
              // Limit history size
              if (state.saveHistory.length >= 20) {
                state.saveHistory.shift();
              }
              
              state.saveHistory.push(historyEntry);
              state.currentHistoryIndex = state.saveHistory.length - 1;
            }),
            
          undo: () =>
            set((state) => {
              if (get().canUndo()) {
                const previousEntry = state.saveHistory[state.currentHistoryIndex - 1];
                if (previousEntry) {
                  state.content = previousEntry.content;
                  state.title = previousEntry.title;
                  state.currentHistoryIndex--;
                  state.hasUnsavedChanges = true;
                }
              }
            }),
            
          redo: () =>
            set((state) => {
              const canRedo = state.currentHistoryIndex < state.saveHistory.length - 1;
              if (canRedo) {
                const nextEntry = state.saveHistory[state.currentHistoryIndex + 1];
                if (nextEntry) {
                  state.content = nextEntry.content;
                  state.title = nextEntry.title;
                  state.currentHistoryIndex++;
                  state.hasUnsavedChanges = true;
                }
              }
            }),
            
          canUndo: () => {
            const state = get();
            return state.currentHistoryIndex > 0;
          },
          
          canRedo: () => {
            const state = get();
            return state.currentHistoryIndex < state.saveHistory.length - 1;
          },
          
          setLastSaved: (date) =>
            set((state) => {
              state.lastSaved = date;
              state.hasUnsavedChanges = false;
            }),
            
          // Validation
          validatePost: () =>
            set((state) => {
              const errors: Record<string, string> = {};
              
              if (!state.title.trim()) {
                errors.title = 'Title is required';
              } else if (state.title.length < 5) {
                errors.title = 'Title must be at least 5 characters';
              }
              
              if (!state.content.trim()) {
                errors.content = 'Content is required';
              } else if (state.content.length < 50) {
                errors.content = 'Content must be at least 50 characters';
              }
              
              if (!state.slug.trim()) {
                errors.slug = 'Slug is required';
              } else if (state.slug.length < 3) {
                errors.slug = 'Slug must be at least 3 characters';
              }
              
              if (state.selectedCategoryIds.length === 0) {
                errors.categories = 'At least one category is required';
              }
              
              state.validationErrors = errors;
              state.isValid = Object.keys(errors).length === 0;
            }),
            
          clearValidationErrors: () =>
            set((state) => {
              state.validationErrors = {};
              state.isValid = true;
            }),
            
          // Complex actions
          resetEditor: () =>
            set((state) => {
              Object.assign(state, initialState);
            }),
            
          // Load an existing post into the editor
          loadPost: (post) =>
            set((state) => {
              state.currentPostId = post.id ?? null;
              state.title = post.title || "";
              state.content = post.content || "";
              state.excerpt = post.excerpt || "";
              state.slug = post.slug || "";
              // Extract category IDs from the categories array
              state.selectedCategoryIds = post.categories?.map(cat => cat.id) || [];
              state.selectedTagIds = []; // Tags would need to be loaded separately
              state.featured = false; // Not in PostWithCategories type
              state.published = post.published ?? false;
              state.seoTitle = ""; // Not in PostWithCategories type
              state.seoDescription = ""; // Not in PostWithCategories type
              state.isDraft = !post.published;
              state.hasUnsavedChanges = false;
              get().updateWordCount();
              get().validatePost();
            }),
            
          // Export current editor state as a draft
          exportDraft: () => {
            const state = get();
            return {
              title: state.title,
              content: state.content,
              excerpt: state.excerpt,
              slug: state.slug,
              selectedCategoryIds: state.selectedCategoryIds,
              selectedTagIds: state.selectedTagIds,
              featured: state.featured,
              published: state.published,
              seoTitle: state.seoTitle,
              seoDescription: state.seoDescription,
              timestamp: new Date(),
            };
          },
          
          updateWordCount: () =>
            set((state) => {
              const wordCount = state.content.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
              state.wordCount = wordCount;
              state.readingTime = calculateReadingTime(state.content);
            }),
            
          // Computed values
          getPostSummary: () => {
            const state = get();
            return `${state.title || 'Untitled'} • ${state.wordCount} words • ${state.readingTime} min read`;
          },
          
          getCompletionPercentage: () => {
            const state = get();
            let completed = 0;
            const total = 6;
            
            if (state.title.trim()) completed++;
            if (state.content.trim()) completed++;
            if (state.excerpt.trim()) completed++;
            if (state.slug.trim()) completed++;
            if (state.selectedCategoryIds.length > 0) completed++;
            if (state.selectedTagIds.length > 0) completed++;
            
            return Math.round((completed / total) * 100);
          },
        }))
      ),
      {
        name: "editor-store",
        partialize: (state) => ({
          // Only persist draft content to avoid losing work
          title: state.title,
          content: state.content,
          excerpt: state.excerpt,
          slug: state.slug,
          selectedCategoryIds: state.selectedCategoryIds,
          selectedTagIds: state.selectedTagIds,
          featured: state.featured,
          seoTitle: state.seoTitle,
          seoDescription: state.seoDescription,
          autoSaveEnabled: state.autoSaveEnabled,
          lastSaved: state.lastSaved,
        }),
      }
    ),
    { name: "editor-store" }
  )
);