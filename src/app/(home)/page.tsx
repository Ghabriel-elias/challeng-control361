'use client'

import { useHomeModel } from "./model"
import { HomeView } from "./view"

export default function Home() {
  const methods = useHomeModel()
  return <HomeView {...methods} />
}