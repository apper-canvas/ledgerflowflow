import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { transactionService } from '@/services/api/transactionService'
import { customerService } from '@/services/api/customerService'

const TransactionModal = ({ isOpen, onClose, selectedCustomer = null, onTransactionAdded }) => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerId: selectedCustomer?.Id || '',
    type: 'credit',
    amount: '',
    description: ''
  })

  useEffect(() => {
    if (isOpen) {
      loadCustomers()
      if (selectedCustomer) {
        setFormData(prev => ({ ...prev, customerId: selectedCustomer.Id }))
      }
    }
  }, [isOpen, selectedCustomer])

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll()
      setCustomers(data)
    } catch (error) {
      toast.error('Failed to load customers')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.customerId || !formData.amount) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date().toISOString()
      }
      
      await transactionService.create(transactionData)
      toast.success('Transaction added successfully!')
      
      // Reset form
      setFormData({
        customerId: selectedCustomer?.Id || '',
        type: 'credit',
        amount: '',
        description: ''
      })
      
      onTransactionAdded?.()
      onClose()
    } catch (error) {
      toast.error('Failed to add transaction')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectedCustomerData = customers.find(c => c.Id === parseInt(formData.customerId))

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!selectedCustomer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer *
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => handleInputChange('customerId', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary focus:outline-none"
                      required
                    >
                      <option value="">Select Customer</option>
                      {customers.map(customer => (
                        <option key={customer.Id} value={customer.Id}>
                          {customer.name} - {customer.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedCustomerData && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {selectedCustomerData.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedCustomerData.name}</h3>
                        <p className="text-sm text-gray-500">{selectedCustomerData.phone}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('type', 'credit')}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        formData.type === 'credit'
                          ? 'border-secondary bg-secondary/10 text-secondary'
                          : 'border-gray-300 text-gray-700 hover:border-secondary'
                      }`}
                    >
                      <ApperIcon name="ArrowUpRight" size={20} className="mx-auto mb-1" />
                      <div className="font-semibold">You Gave</div>
                      <div className="text-xs">Credit</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('type', 'debit')}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        formData.type === 'debit'
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-gray-300 text-gray-700 hover:border-accent'
                      }`}
                    >
                      <ApperIcon name="ArrowDownLeft" size={20} className="mx-auto mb-1" />
                      <div className="font-semibold">You Got</div>
                      <div className="text-xs">Debit</div>
                    </button>
                  </div>
                </div>

                <Input
                  label="Amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  icon="DollarSign"
                  required
                />

                <Input
                  label="Description"
                  placeholder="Optional note"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  icon="FileText"
                />

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    fullWidth
                  >
                    Add Transaction
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default TransactionModal