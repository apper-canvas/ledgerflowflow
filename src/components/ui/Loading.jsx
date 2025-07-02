import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = 'cards' }) => {
  const CardSkeleton = () => (
    <div className="card-premium p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-5 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  )

  const TransactionSkeleton = () => (
    <div className="card-premium p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )

  const HeaderSkeleton = () => (
    <div className="bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse">
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <div className="h-8 bg-white/20 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-32 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 p-4 rounded-2xl">
            <div className="h-4 bg-white/30 rounded w-20 mx-auto mb-2"></div>
            <div className="h-8 bg-white/30 rounded w-24 mx-auto"></div>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl">
            <div className="h-4 bg-white/30 rounded w-20 mx-auto mb-2"></div>
            <div className="h-8 bg-white/30 rounded w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )

const renderSkeletons = () => {
    switch (type) {
      case 'header':
        return <HeaderSkeleton />
      case 'transactions':
        return Array.from({ length: 5 }, (_, i) => (
          <TransactionSkeleton key={i} />
        ))
      case 'reports':
        return (
          <div className="card-premium p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="h-20 bg-gray-200 rounded-xl"></div>
              <div className="h-20 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="h-16 bg-gray-200 rounded-xl"></div>
              <div className="h-16 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl w-full md:w-48"></div>
          </div>
        )
      case 'cards':
      default:
        return Array.from({ length: 6 }, (_, i) => (
          <CardSkeleton key={i} />
        ))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {renderSkeletons()}
    </motion.div>
  )
}

export default Loading