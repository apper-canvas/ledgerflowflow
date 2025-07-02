import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import TransactionCard from '@/components/molecules/TransactionCard'
import FloatingActionButton from '@/components/molecules/FloatingActionButton'
import TransactionModal from '@/components/organisms/TransactionModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { customerService } from '@/services/api/customerService'
import { transactionService } from '@/services/api/transactionService'
import { formatCurrency } from '@/utils/formatters'

const CustomerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTransactionModal, setShowTransactionModal] = useState(false)

  useEffect(() => {
    loadCustomerData()
  }, [id])

  const loadCustomerData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [customerData, transactionsData] = await Promise.all([
        customerService.getById(parseInt(id)),
        transactionService.getByCustomerId(parseInt(id))
      ])
      
      setCustomer(customerData)
      setTransactions(transactionsData)
    } catch (err) {
      setError('Failed to load customer data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionAdded = () => {
    loadCustomerData()
  }

  const handleWhatsApp = () => {
    if (!customer?.phone) return
    
    const message = customer.balance > 0 
      ? `Hi ${customer.name}, you have a pending amount of ${formatCurrency(customer.balance)}. Please clear it at your earliest convenience.`
      : `Hi ${customer.name}, thank you for clearing your account!`
    
    const whatsappUrl = `https://wa.me/91${customer.phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCall = () => {
    if (!customer?.phone) return
    window.open(`tel:${customer.phone}`, '_self')
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
        <Loading type="transactions" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadCustomerData} />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="p-6">
        <Error message="Customer not found" onRetry={() => navigate('/customers')} />
      </div>
    )
  }

  const balanceColor = customer.balance > 0 ? 'text-secondary' : customer.balance < 0 ? 'text-accent' : 'text-gray-500'
  const balanceText = customer.balance > 0 ? 'Will Give' : customer.balance < 0 ? 'Will Get' : 'Settled'

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white">
        <div className="p-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/customers')}
            className="mb-4 p-2 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </motion.button>
          
          <div className="flex items-center space-x-4 mb-6">
            <Avatar name={customer.name} size="lg" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <ApperIcon name="Phone" size={16} />
                <span className="text-white/90">{customer.phone}</span>
              </div>
            </div>
          </div>
          
          <div className="glass-effect p-4 rounded-2xl text-center mb-4">
            <div className={`text-3xl font-bold ${balanceColor === 'text-secondary' ? 'text-white' : balanceColor === 'text-accent' ? 'text-white' : 'text-white'}`}>
              {formatCurrency(Math.abs(customer.balance))}
            </div>
            <div className="text-white/80 font-medium">{balanceText}</div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              size="sm"
              icon="Phone"
              onClick={handleCall}
              className="flex-1"
            >
              Call
            </Button>
            <Button
              variant="accent"
              size="sm"
              icon="MessageCircle"
              onClick={handleWhatsApp}
              className="flex-1"
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Receipt" size={16} />
            <span>{transactions.length} transactions</span>
          </div>
        </div>

        {transactions.length === 0 ? (
          <Empty
            title="No transactions yet"
            description={`Start by adding a transaction for ${customer.name}`}
            icon="Receipt"
            actionLabel="Add Transaction"
            onAction={() => setShowTransactionModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <TransactionCard
                key={transaction.Id}
                transaction={transaction}
                customer={customer}
                index={index}
                showCustomer={false}
              />
            ))}
          </div>
        )}
      </div>

      <FloatingActionButton
        onClick={() => setShowTransactionModal(true)}
        icon="Plus"
      />

      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        selectedCustomer={customer}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  )
}

export default CustomerDetail