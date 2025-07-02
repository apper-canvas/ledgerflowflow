import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:shadow-xl focus:ring-primary',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary',
    accent: 'bg-gradient-to-r from-accent to-green-500 text-white shadow-lg hover:shadow-xl focus:ring-accent',
    danger: 'bg-gradient-to-r from-secondary to-red-500 text-white shadow-lg hover:shadow-xl focus:ring-secondary',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary focus:ring-primary'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }
  
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `

  const buttonContent = (
    <>
      {loading && <ApperIcon name="Loader2" className="animate-spin mr-2" size={16} />}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} className="mr-2" size={16} />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} className="ml-2" size={16} />
      )}
    </>
  )

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {buttonContent}
    </motion.button>
  )
}

export default Button