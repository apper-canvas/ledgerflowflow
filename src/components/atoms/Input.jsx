import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  iconPosition = 'left',
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputClasses = `
    block w-full px-4 py-3 text-base rounded-xl border-2 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-secondary focus:border-secondary focus:ring-secondary/20' : 'border-gray-300'}
    ${icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : ''}
    ${className}
  `

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-secondary ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center pointer-events-none`}>
            <ApperIcon name={icon} className="text-gray-400" size={20} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-secondary font-medium">{error}</p>
      )}
    </div>
  )
}

export default Input