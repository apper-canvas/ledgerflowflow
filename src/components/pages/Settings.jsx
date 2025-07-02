import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { businessService } from '@/services/api/businessService'

const Settings = () => {
  const [businessData, setBusinessData] = useState({
    name: 'LedgerFlow'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBusinessData()
  }, [])

  const loadBusinessData = async () => {
    try {
      const data = await businessService.getBusinessData()
      setBusinessData(data)
    } catch (error) {
      console.error('Failed to load business data')
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await businessService.updateBusinessData(businessData)
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setBusinessData(prev => ({ ...prev, [field]: value }))
  }

  const settingsItems = [
    {
      icon: 'Building2',
      title: 'Business Information',
      description: 'Update your business name and details'
    },
    {
      icon: 'Bell',
      title: 'Notifications',
      description: 'Manage notification preferences'
    },
    {
      icon: 'Download',
      title: 'Export Data',
      description: 'Download your transaction history'
    },
    {
      icon: 'Shield',
      title: 'Privacy & Security',
      description: 'Manage your data and privacy settings'
    },
    {
      icon: 'HelpCircle',
      title: 'Help & Support',
      description: 'Get help and contact support'
    },
    {
      icon: 'Info',
      title: 'About',
      description: 'App version and information'
    }
  ]

  return (
    <div className="p-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your app preferences and business settings</p>
      </motion.div>

      {/* Business Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
        
        <Input
          label="Business Name"
          placeholder="Enter your business name"
          value={businessData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          icon="Building2"
        />
        
        <div className="mt-4">
          <Button
            onClick={handleSave}
            loading={loading}
            variant="primary"
          >
            Save Changes
          </Button>
        </div>
      </motion.div>

      {/* Settings Menu */}
      <div className="space-y-4">
        {settingsItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-premium p-4 cursor-pointer hover:shadow-elevated transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <ApperIcon name={item.icon} size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center"
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <ApperIcon name="BookOpen" size={24} className="text-primary" />
          <span className="text-lg font-bold text-gray-900">LedgerFlow</span>
        </div>
        <p className="text-sm text-gray-600">Version 1.0.0</p>
        <p className="text-xs text-gray-500 mt-2">
          Digital Cash Book for Small Businesses
        </p>
      </motion.div>
    </div>
  )
}

export default Settings