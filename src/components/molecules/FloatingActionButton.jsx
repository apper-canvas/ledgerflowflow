import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const FloatingActionButton = ({ onClick, icon = 'Plus', className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full shadow-floating hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 ${className}`}
      onClick={onClick}
    >
      <ApperIcon name={icon} size={24} />
    </motion.button>
  )
}

export default FloatingActionButton