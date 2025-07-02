import { delay } from '@/utils/delay'
import { customerService } from './customerService'

class BusinessService {
  constructor() {
    this.businessInfo = {
      name: 'LedgerFlow',
      owner: '',
      phone: '',
      address: ''
    }
  }

  async getBusinessData() {
    await delay(200)
    
    // Calculate totals from customers
    const customers = await customerService.getAll()
    
    const totalToReceive = customers.reduce((sum, customer) => 
      sum + (customer.balance > 0 ? customer.balance : 0), 0)
    
    const totalToPay = customers.reduce((sum, customer) => 
      sum + (customer.balance < 0 ? Math.abs(customer.balance) : 0), 0)
    
    return {
      ...this.businessInfo,
      totalToReceive,
      totalToPay,
      customerCount: customers.length
    }
  }

  async updateBusinessData(data) {
    await delay(300)
    this.businessInfo = { ...this.businessInfo, ...data }
    return { ...this.businessInfo }
  }
}

export const businessService = new BusinessService()