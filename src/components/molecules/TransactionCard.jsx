import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Avatar from '@/components/atoms/Avatar'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { formatCurrency } from '@/utils/formatters'

const TransactionCard = ({ transaction, customer, index, showCustomer = false }) => {
  const isCredit = transaction.type === 'credit'
  const amountColor = isCredit ? 'text-secondary' : 'text-accent'
  const bgColor = isCredit ? 'bg-secondary/5' : 'bg-accent/5'
  const iconName = isCredit ? 'ArrowUpRight' : 'ArrowDownLeft'
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`card-premium p-4 border-l-4 ${isCredit ? 'border-l-secondary' : 'border-l-accent'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {showCustomer && customer && (
            <Avatar name={customer.name} size="sm" />
          )}
          <div className="flex-1">
            {showCustomer && customer && (
              <h4 className="font-semibold text-gray-900 mb-1">{customer.name}</h4>
            )}
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-1 rounded-full ${bgColor}`}>
                <ApperIcon name={iconName} size={14} className={amountColor} />
              </div>
              <span className="text-sm text-gray-600">
                {isCredit ? 'You gave' : 'You got'}
              </span>
              <Badge variant={isCredit ? 'danger' : 'success'} size="sm">
                {isCredit ? 'Credit' : 'Debit'}
              </Badge>
            </div>
            {transaction.description && (
              <p className="text-sm text-gray-600 mb-2">{transaction.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {format(new Date(transaction.date), 'MMM dd, yyyy • hh:mm a')}
              </span>
              <span className="text-xs text-gray-500">
                Balance: {formatCurrency(transaction.runningBalance)}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`font-bold text-lg ${amountColor}`}>
          {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
        </div>
      </div>
    </motion.div>
  )
}

export default TransactionCard