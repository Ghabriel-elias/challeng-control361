'use client'
import { SnackbarProvider } from "notistack"
import { SkeletonTheme } from "react-loading-skeleton"
import Home from "./(home)/viewModel"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SkeletonTheme baseColor="var(--color-grey-primary)" highlightColor="var(--color-grey-secondary)" >
        <SnackbarProvider>
          <Home />
        </SnackbarProvider>
      </SkeletonTheme>
    </QueryClientProvider>
  )
}