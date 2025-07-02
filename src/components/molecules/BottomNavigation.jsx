import React from 'react'
import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const BottomNavigation = () => {
  const navItems = [
    { path: '/', icon: 'Home', label: 'Home' },
    { path: '/customers', icon: 'Users', label: 'Customers' },
    { path: '/reports', icon: 'BarChart3', label: 'Reports' },
    { path: '/settings', icon: 'Settings', label: 'Settings' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-500 hover:text-primary hover:bg-gray-100'
              }`
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span className="text-xs font-medium mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default BottomNavigation