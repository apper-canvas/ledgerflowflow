import React from 'react'
import BottomNavigation from '@/components/molecules/BottomNavigation'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="relative">
        {children}
      </main>
      <BottomNavigation />
    </div>
  )
}

export default Layout