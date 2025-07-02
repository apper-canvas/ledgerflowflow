import { delay } from '@/utils/delay'
import customersData from '@/services/mockData/customers.json'

class CustomerService {
  constructor() {
    this.customers = [...customersData]
  }

  async getAll() {
    await delay(300)
    return [...this.customers]
  }

  async getById(id) {
    await delay(200)
    const customer = this.customers.find(c => c.Id === id)
    if (!customer) {
      throw new Error('Customer not found')
    }
    return { ...customer }
  }

  async create(customerData) {
    await delay(400)
    const newId = Math.max(...this.customers.map(c => c.Id), 0) + 1
    const newCustomer = {
      Id: newId,
      ...customerData,
      balance: 0,
      createdAt: new Date().toISOString(),
      lastTransaction: new Date().toISOString()
    }
    this.customers.push(newCustomer)
    return { ...newCustomer }
  }

  async update(id, data) {
    await delay(300)
    const index = this.customers.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Customer not found')
    }
    this.customers[index] = { ...this.customers[index], ...data }
    return { ...this.customers[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.customers.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Customer not found')
    }
    this.customers.splice(index, 1)
    return true
  }

  async updateBalance(customerId, newBalance) {
    await delay(100)
    const customer = this.customers.find(c => c.Id === customerId)
    if (customer) {
      customer.balance = newBalance
      customer.lastTransaction = new Date().toISOString()
    }
    return customer
  }
}

export const customerService = new CustomerService()