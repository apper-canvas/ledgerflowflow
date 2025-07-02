import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item",
  icon = "Inbox",
  actionLabel = "Add Item",
  onAction,
  showAction = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-sm">
        {description}
      </p>
      
      {showAction && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          icon="Plus"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty