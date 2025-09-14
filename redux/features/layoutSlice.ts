// store/layoutSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface LayoutState {
  isSidebarCollapsed: boolean
}

const initialState: LayoutState = {
  isSidebarCollapsed: false,
}

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarCollapsed } = layoutSlice.actions
export default layoutSlice.reducer
