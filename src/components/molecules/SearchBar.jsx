import React from 'react'
import Input from '@/components/atoms/Input'

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon="Search"
        iconPosition="left"
        className="bg-white shadow-sm"
        {...props}
      />
    </div>
  )
}

export default SearchBar