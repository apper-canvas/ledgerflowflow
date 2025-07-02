import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CustomerCard from '@/components/molecules/CustomerCard'
import SearchBar from '@/components/molecules/SearchBar'
import FloatingActionButton from '@/components/molecules/FloatingActionButton'
import AddCustomerModal from '@/components/organisms/AddCustomerModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { customerService } from '@/services/api/customerService'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchQuery])

  const loadCustomers = async () => {
    setLoading(true)
    setError('')
    
    try {
      const data = await customerService.getAll()
      setCustomers(data)
    } catch (err) {
      setError('Failed to load customers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filterCustomers = () => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers)
      return
    }

    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    )
    setFilteredCustomers(filtered)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleCustomerAdded = () => {
    loadCustomers()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
        <Loading type="cards" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadCustomers} />
      </div>
    )
  }

  return (
    <div className="p-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Users" size={16} />
            <span>{customers.length} customers</span>
          </div>
        </div>
        
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search customers by name or phone..."
        />
      </motion.div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <Empty
          title={searchQuery ? "No customers found" : "No customers yet"}
          description={
            searchQuery 
              ? "Try adjusting your search terms"
              : "Add your first customer to start tracking transactions"
          }
          icon={searchQuery ? "Search" : "UserPlus"}
          actionLabel="Add Customer"
          onAction={() => setShowAddModal(true)}
          showAction={!searchQuery}
        />
      ) : (
        <div className="space-y-4">
          {filteredCustomers.map((customer, index) => (
            <CustomerCard
              key={customer.Id}
              customer={customer}
              index={index}
            />
          ))}
        </div>
      )}

      <FloatingActionButton
        onClick={() => setShowAddModal(true)}
        icon="UserPlus"
      />

      <AddCustomerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCustomerAdded={handleCustomerAdded}
      />
    </div>
  )
}

export default Customers