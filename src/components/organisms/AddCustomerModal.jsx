import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { customerService } from '@/services/api/customerService'

const AddCustomerModal = ({ isOpen, onClose, onCustomerAdded }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const customerData = {
        ...formData,
        balance: 0,
        createdAt: new Date().toISOString(),
        lastTransaction: new Date().toISOString()
      }
      
      await customerService.create(customerData)
      toast.success('Customer added successfully!')
      
      // Reset form
      setFormData({ name: '', phone: '' })
      
      onCustomerAdded?.()
      onClose()
    } catch (error) {
      toast.error('Failed to add customer')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Customer</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Customer Name"
                placeholder="Enter customer name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                icon="User"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                icon="Phone"
                required
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
                  Add Customer
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddCustomerModal