'use client'
import { SnackbarProvider } from "notistack"
import { SkeletonTheme } from "react-loading-skeleton"
import Home from "./(home)/viewModel"

export default function App() {
  return (
    <SkeletonTheme baseColor="var(--color-grey-primary)" highlightColor="var(--color-grey-secondary)" >
      <SnackbarProvider>
        <Home />
      </SnackbarProvider>
    </SkeletonTheme>
  )
}