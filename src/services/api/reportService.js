import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { delay } from '@/utils/delay'
import { formatCurrency } from '@/utils/formatters'
import { format } from 'date-fns'

class ReportService {
  async generateReport({ type, startDate, endDate, format: reportFormat, customers, transactions }) {
    await delay(1000) // Simulate processing time

    if (reportFormat === 'pdf') {
      return this.generatePDF({ type, startDate, endDate, customers, transactions })
    }
    
    throw new Error('Unsupported report format')
  }

  generatePDF({ type, startDate, endDate, customers, transactions }) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('LedgerFlow Report', pageWidth / 2, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy')}`, pageWidth / 2, 30, { align: 'center' })
    doc.text(`Period: ${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`, pageWidth / 2, 38, { align: 'center' })
    
    // Filter transactions by date range
    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= startDate && transactionDate <= endDate
    })

    let yPosition = 50

    switch (type) {
      case 'outstanding':
        yPosition = this.addOutstandingReport(doc, customers, yPosition)
        break
      case 'summary':
        yPosition = this.addSummaryReport(doc, customers, filteredTransactions, yPosition)
        break
      case 'transactions':
        yPosition = this.addTransactionReport(doc, customers, filteredTransactions, yPosition)
        break
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })
    }

    // Download the PDF
    const fileName = `ledgerflow-${type}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`
    doc.save(fileName)
    
    return { success: true, fileName }
  }

  addOutstandingReport(doc, customers, yPosition) {
    const outstandingCustomers = customers.filter(customer => customer.balance !== 0)
      .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Outstanding Amounts Report', 20, yPosition)
    yPosition += 15

    if (outstandingCustomers.length === 0) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('No outstanding amounts found.', 20, yPosition)
      return yPosition + 20
    }

    const tableData = outstandingCustomers.map(customer => [
      customer.name,
      customer.phone,
      formatCurrency(Math.abs(customer.balance)),
      customer.balance > 0 ? 'Will Give' : 'Will Get'
    ])

    doc.autoTable({
      startY: yPosition,
      head: [['Customer Name', 'Phone', 'Amount', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [67, 56, 202] },
      styles: { fontSize: 10 },
      columnStyles: {
        2: { halign: 'right' },
        3: { halign: 'center' }
      }
    })

    return doc.lastAutoTable.finalY + 20
  }

  addSummaryReport(doc, customers, transactions, yPosition) {
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Business Summary Report', 20, yPosition)
    yPosition += 15

    // Calculate summary statistics
    const totalToReceive = customers.reduce((sum, customer) => 
      sum + (customer.balance > 0 ? customer.balance : 0), 0)
    
    const totalToPay = customers.reduce((sum, customer) => 
      sum + (customer.balance < 0 ? Math.abs(customer.balance) : 0), 0)
    
    const netBalance = totalToReceive - totalToPay
    const outstandingCustomers = customers.filter(customer => customer.balance !== 0).length

    // Summary table
    const summaryData = [
      ['Total Customers', customers.length.toString()],
      ['Outstanding Customers', outstandingCustomers.toString()],
      ['Total to Receive', formatCurrency(totalToReceive)],
      ['Total to Pay', formatCurrency(totalToPay)],
      ['Net Balance', formatCurrency(Math.abs(netBalance))],
      ['Net Status', netBalance > 0 ? 'Positive' : netBalance < 0 ? 'Negative' : 'Balanced']
    ]

    doc.autoTable({
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [67, 56, 202] },
      styles: { fontSize: 11 },
      columnStyles: {
        1: { halign: 'right' }
      }
    })

    yPosition = doc.lastAutoTable.finalY + 20

    // Recent transactions in period
    if (transactions.length > 0) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Transactions in Period', 20, yPosition)
      yPosition += 10

      const transactionData = transactions.slice(0, 10).map(transaction => {
        const customer = customers.find(c => c.Id === transaction.customerId)
        return [
          format(new Date(transaction.date), 'MMM dd, yyyy'),
          customer?.name || 'Unknown',
          transaction.description,
          transaction.type === 'credit' ? '+' : '-',
          formatCurrency(transaction.amount)
        ]
      })

      doc.autoTable({
        startY: yPosition,
        head: [['Date', 'Customer', 'Description', 'Type', 'Amount']],
        body: transactionData,
        theme: 'grid',
        headStyles: { fillColor: [67, 56, 202] },
        styles: { fontSize: 9 },
        columnStyles: {
          4: { halign: 'right' }
        }
      })

      yPosition = doc.lastAutoTable.finalY + 20
    }

    return yPosition
  }

  addTransactionReport(doc, customers, transactions, yPosition) {
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Transaction History Report', 20, yPosition)
    yPosition += 15

    if (transactions.length === 0) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('No transactions found in the selected date range.', 20, yPosition)
      return yPosition + 20
    }

    const transactionData = transactions.map(transaction => {
      const customer = customers.find(c => c.Id === transaction.customerId)
      return [
        format(new Date(transaction.date), 'MMM dd, yyyy'),
        customer?.name || 'Unknown',
        transaction.description,
        transaction.type === 'credit' ? 'Credit' : 'Debit',
        formatCurrency(transaction.amount),
        formatCurrency(transaction.runningBalance)
      ]
    })

    doc.autoTable({
      startY: yPosition,
      head: [['Date', 'Customer', 'Description', 'Type', 'Amount', 'Running Balance']],
      body: transactionData,
      theme: 'grid',
      headStyles: { fillColor: [67, 56, 202] },
      styles: { fontSize: 9 },
      columnStyles: {
        4: { halign: 'right' },
        5: { halign: 'right' }
      }
    })

    return doc.lastAutoTable.finalY + 20
  }
}

export const reportService = new ReportService()