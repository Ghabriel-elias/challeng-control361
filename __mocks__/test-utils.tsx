import React, {ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import { SkeletonTheme } from 'react-loading-skeleton'
import { SnackbarProvider } from 'notistack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const AllTheProviders = ({children}: {children: React.ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SkeletonTheme baseColor="var(--color-grey-primary)" highlightColor="var(--color-grey-secondary)" >
        <SnackbarProvider>
          {children}
        </SnackbarProvider>
      </SkeletonTheme>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options})

export * from '@testing-library/react'
export {customRender as render}