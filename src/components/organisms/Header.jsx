import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { formatCurrency } from '@/utils/formatters'

const Header = ({ businessData }) => {
  return (
    <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white">
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <ApperIcon name="BookOpen" size={28} className="text-white/90" />
            <h1 className="text-2xl font-display font-bold">{businessData?.name || 'LedgerFlow'}</h1>
          </div>
          <p className="text-white/80 font-medium">Digital Cash Book</p>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-effect p-4 rounded-2xl text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ApperIcon name="TrendingUp" size={20} className="text-accent" />
              <span className="text-sm font-medium text-white/90">To Receive</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(businessData?.totalToReceive || 0)}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-effect p-4 rounded-2xl text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ApperIcon name="TrendingDown" size={20} className="text-secondary" />
              <span className="text-sm font-medium text-white/90">To Pay</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(businessData?.totalToPay || 0)}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Header