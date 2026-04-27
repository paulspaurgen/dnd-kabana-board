import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  selectedCandidateId: string | null;
  isOpen: boolean;
}

const initialState: SidebarState = {
  selectedCandidateId: null,
  isOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    openCandidateSidebar: (state, action: PayloadAction<string>) => {
      state.selectedCandidateId = action.payload;
      state.isOpen = true;
    },
    closeCandidateSidebar: (state) => {
      state.selectedCandidateId = null;
      state.isOpen = false;
    },
  },
});

export const { openCandidateSidebar, closeCandidateSidebar } = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;
