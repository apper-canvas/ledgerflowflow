import { delay } from '@/utils/delay'
import { customerService } from './customerService'
import transactionsData from '@/services/mockData/transactions.json'

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData]
  }

  async getAll() {
    await delay(300)
    return [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async getById(id) {
    await delay(200)
    const transaction = this.transactions.find(t => t.Id === id)
    if (!transaction) {
      throw new Error('Transaction not found')
    }
    return { ...transaction }
  }

  async getByCustomerId(customerId) {
    await delay(250)
    return [...this.transactions]
      .filter(t => t.customerId === customerId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async getRecent(limit = 10) {
    await delay(200)
    return [...this.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
  }

  async create(transactionData) {
    await delay(400)
    const newId = Math.max(...this.transactions.map(t => t.Id), 0) + 1
    
    // Get customer's current balance
    const customer = await customerService.getById(transactionData.customerId)
    let newBalance = customer.balance
    
    // Update balance based on transaction type
    if (transactionData.type === 'credit') {
      newBalance += transactionData.amount // Customer owes more
    } else {
      newBalance -= transactionData.amount // Customer owes less
    }
    
    const newTransaction = {
      Id: newId,
      customerId: parseInt(transactionData.customerId),
      type: transactionData.type,
      amount: transactionData.amount,
      description: transactionData.description || '',
      date: transactionData.date || new Date().toISOString(),
      runningBalance: newBalance
    }
    
    this.transactions.push(newTransaction)
    
    // Update customer balance
    await customerService.updateBalance(transactionData.customerId, newBalance)
    
    return { ...newTransaction }
  }

  async update(id, data) {
    await delay(300)
    const index = this.transactions.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Transaction not found')
    }
    
    this.transactions[index] = { ...this.transactions[index], ...data }
    return { ...this.transactions[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.transactions.findIndex(t => t.Id === id)
    if (index === -1) {
      throw new Error('Transaction not found')
    }
    
    this.transactions.splice(index, 1)
    return true
  }
}

export const transactionService = new TransactionService()