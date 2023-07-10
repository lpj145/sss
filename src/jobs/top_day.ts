import { Bill, Result } from '../types'

export default function handle(bills: Bill[]): Result['top_day'] {
  const list = new Map<number, number>()
  let topDay: Result['top_day'] = {
    time: 0,
    amount: 0,
    formatted: ''
  }

  // Iterate over all bills to structure counterparty -> amount data
  bills.forEach((bill) => {
    if (!list.has(bill.due_date)) {
      list.set(bill.due_date, 0)
    }

    list.set(bill.due_date, list.get(bill.due_date) + bill.amount)
  })

  // Check all the counterparties to get the most expensive ones
  list.forEach((amount, time) => {
    if (amount > topDay.amount) {
      topDay.amount = amount
      topDay.time = time
    }
  })

  topDay.formatted = (new Date(topDay.time)).toLocaleString()

  return topDay
}
