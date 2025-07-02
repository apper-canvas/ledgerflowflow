import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { customerService } from '@/services/api/customerService'
import { transactionService } from '@/services/api/transactionService'
import { formatCurrency } from '@/utils/formatters'
import { format } from 'date-fns'

const Reports = () => {
  const [customers, setCustomers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reportType, setReportType] = useState('outstanding')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [customersData, transactionsData] = await Promise.all([
        customerService.getAll(),
        transactionService.getAll()
      ])
      
      setCustomers(customersData)
      setTransactions(transactionsData)
    } catch (err) {
      setError('Failed to load report data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getOutstandingCustomers = () => {
    return customers.filter(customer => customer.balance !== 0)
      .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
  }

  const getSummaryStats = () => {
    const totalToReceive = customers.reduce((sum, customer) => 
      sum + (customer.balance > 0 ? customer.balance : 0), 0)
    
    const totalToPay = customers.reduce((sum, customer) => 
      sum + (customer.balance < 0 ? Math.abs(customer.balance) : 0), 0)
    
    const netBalance = totalToReceive - totalToPay
    
    return {
      totalToReceive,
      totalToPay,
      netBalance,
      totalCustomers: customers.length,
      outstandingCustomers: getOutstandingCustomers().length
    }
  }

  const getRecentTransactions = () => {
    return transactions.slice(0, 20)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        </div>
        <Loading type="cards" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadData} />
      </div>
    )
  }

  const stats = getSummaryStats()
  const outstandingCustomers = getOutstandingCustomers()
  const recentTransactions = getRecentTransactions()

  return (
    <div className="p-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Reports</h1>
        
        {/* Report Type Selector */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setReportType('outstanding')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              reportType === 'outstanding'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Outstanding
          </button>
          <button
            onClick={() => setReportType('summary')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              reportType === 'summary'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Summary
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-premium p-4 text-center"
        >
          <ApperIcon name="TrendingUp" size={24} className="text-accent mx-auto mb-2" />
          <div className="text-xl font-bold text-accent">
            {formatCurrency(stats.totalToReceive)}
          </div>
          <div className="text-sm text-gray-600">To Receive</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card-premium p-4 text-center"
        >
          <ApperIcon name="TrendingDown" size={24} className="text-secondary mx-auto mb-2" />
          <div className="text-xl font-bold text-secondary">
            {formatCurrency(stats.totalToPay)}
          </div>
          <div className="text-sm text-gray-600">To Pay</div>
        </motion.div>
      </div>

      {/* Net Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-premium p-6 mb-8 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Net Balance</h3>
        <div className={`text-3xl font-bold ${
          stats.netBalance > 0 ? 'text-accent' : stats.netBalance < 0 ? 'text-secondary' : 'text-gray-500'
        }`}>
          {formatCurrency(Math.abs(stats.netBalance))}
        </div>
        <div className={`text-sm font-medium ${
          stats.netBalance > 0 ? 'text-accent' : stats.netBalance < 0 ? 'text-secondary' : 'text-gray-500'
        }`}>
          {stats.netBalance > 0 ? 'You will receive' : stats.netBalance < 0 ? 'You will pay' : 'All settled'}
        </div>
      </motion.div>

      {/* Report Content */}
      {reportType === 'outstanding' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Outstanding Amounts</h2>
          
          {outstandingCustomers.length === 0 ? (
            <Empty
              title="All settled!"
              description="No outstanding amounts with any customers"
              icon="CheckCircle"
              showAction={false}
            />
          ) : (
            <div className="space-y-4">
              {outstandingCustomers.map((customer, index) => (
                <motion.div
                  key={customer.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-premium p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        customer.balance > 0 ? 'bg-secondary' : 'bg-accent'
                      }`}></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-lg ${
                        customer.balance > 0 ? 'text-secondary' : 'text-accent'
                      }`}>
                        {formatCurrency(Math.abs(customer.balance))}
                      </div>
                      <div className={`text-xs font-medium ${
                        customer.balance > 0 ? 'text-secondary' : 'text-accent'
                      }`}>
                        {customer.balance > 0 ? 'Will Give' : 'Will Get'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {reportType === 'summary' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Business Summary</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card-premium p-4 text-center">
              <ApperIcon name="Users" size={20} className="text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{stats.totalCustomers}</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
            <div className="card-premium p-4 text-center">
              <ApperIcon name="AlertCircle" size={20} className="text-warning mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{stats.outstandingCustomers}</div>
              <div className="text-sm text-gray-600">Outstanding</div>
            </div>
          </div>

          <div className="card-premium p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((transaction, index) => {
                const customer = customers.find(c => c.Id === transaction.customerId)
                return (
                  <div key={transaction.Id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.type === 'credit' ? 'bg-secondary' : 'bg-accent'
                      }`}></div>
                      <div>
                        <span className="text-sm font-medium">{customer?.name}</span>
                        <div className="text-xs text-gray-500">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      transaction.type === 'credit' ? 'text-secondary' : 'text-accent'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports