import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import TransactionCard from '@/components/molecules/TransactionCard'
import FloatingActionButton from '@/components/molecules/FloatingActionButton'
import TransactionModal from '@/components/organisms/TransactionModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { transactionService } from '@/services/api/transactionService'
import { customerService } from '@/services/api/customerService'
import { businessService } from '@/services/api/businessService'

const Home = () => {
  const [transactions, setTransactions] = useState([])
  const [customers, setCustomers] = useState([])
  const [businessData, setBusinessData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTransactionModal, setShowTransactionModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [transactionsData, customersData, businessInfo] = await Promise.all([
        transactionService.getRecent(10),
        customerService.getAll(),
        businessService.getBusinessData()
      ])
      
      setTransactions(transactionsData)
      setCustomers(customersData)
      setBusinessData(businessInfo)
    } catch (err) {
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionAdded = () => {
    loadData()
  }

  const getCustomerById = (customerId) => {
    return customers.find(c => c.Id === customerId)
  }

  if (loading) {
    return (
      <div>
        <Loading type="header" />
        <div className="p-6">
          <Loading type="transactions" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header businessData={businessData} />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header businessData={businessData} />
      
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-4 text-center"
          >
            <ApperIcon name="Users" size={24} className="text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {businessData?.customerCount || 0}
            </div>
            <div className="text-sm text-gray-600">Customers</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium p-4 text-center"
          >
            <ApperIcon name="TrendingUp" size={24} className="text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent">
              {transactions.filter(t => t.type === 'debit').length}
            </div>
            <div className="text-sm text-gray-600">Received</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-premium p-4 text-center"
          >
            <ApperIcon name="TrendingDown" size={24} className="text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary">
              {transactions.filter(t => t.type === 'credit').length}
            </div>
            <div className="text-sm text-gray-600">Given</div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
          
          {transactions.length === 0 ? (
            <Empty
              title="No transactions yet"
              description="Start by adding your first transaction to track your business cash flow"
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
                  customer={getCustomerById(transaction.customerId)}
                  index={index}
                  showCustomer={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingActionButton
        onClick={() => setShowTransactionModal(true)}
        icon="Plus"
      />

      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  )
}

export default Home