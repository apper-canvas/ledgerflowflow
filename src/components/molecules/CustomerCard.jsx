import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Avatar from '@/components/atoms/Avatar'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { formatCurrency } from '@/utils/formatters'

const CustomerCard = ({ customer, index }) => {
  const navigate = useNavigate()
  
  const handleCardClick = () => {
    navigate(`/customers/${customer.Id}`)
  }
  
  const handleWhatsAppClick = (e) => {
    e.stopPropagation()
    const message = customer.balance > 0 
      ? `Hi ${customer.name}, you have a pending amount of ${formatCurrency(customer.balance)}. Please clear it at your earliest convenience.`
      : `Hi ${customer.name}, thank you for clearing your account!`
    
    const whatsappUrl = `https://wa.me/91${customer.phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }
  
  const balanceColor = customer.balance > 0 ? 'text-secondary' : customer.balance < 0 ? 'text-accent' : 'text-gray-500'
  const balanceText = customer.balance > 0 ? 'Will Give' : customer.balance < 0 ? 'Will Get' : 'Settled'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-premium p-4 cursor-pointer hover:shadow-elevated transition-all duration-300"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <Avatar name={customer.name} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{customer.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <ApperIcon name="Phone" size={14} className="text-gray-400" />
              <span className="text-sm text-gray-500">{customer.phone}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className={`font-bold text-lg ${balanceColor}`}>
              {formatCurrency(Math.abs(customer.balance))}
            </div>
            <div className={`text-xs ${balanceColor} font-medium`}>
              {balanceText}
            </div>
          </div>
          
          {customer.phone && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsAppClick}
              className="p-2 bg-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ApperIcon name="MessageCircle" size={18} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CustomerCard