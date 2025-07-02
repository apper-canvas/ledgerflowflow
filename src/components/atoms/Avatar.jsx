import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Avatar = ({
  name,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl'
  }
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  const getBackgroundColor = (name) => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-red-400 to-red-600',
    ]
    const index = name.length % colors.length
    return colors[index]
  }
  
  const classes = `
    ${sizes[size]}
    ${getBackgroundColor(name)}
    rounded-full flex items-center justify-center text-white font-bold shadow-lg
    ${className}
  `

  return (
    <div className={classes} {...props}>
      {getInitials(name)}
    </div>
  )
}

export default Avatar