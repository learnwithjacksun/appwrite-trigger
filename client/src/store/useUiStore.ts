import { create } from "zustand";
import type { Project } from "@/types/api";

interface UiState {
  projectModalOpen: boolean;
  editingProject: Project | null;
  sidebarOpen: boolean;
  openProjectModal: (project?: Project | null) => void;
  closeProjectModal: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  projectModalOpen: false,
  editingProject: null,
  sidebarOpen: false,
  openProjectModal: (project = null) =>
    set({ projectModalOpen: true, editingProject: project }),
  closeProjectModal: () =>
    set({ projectModalOpen: false, editingProject: null }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
