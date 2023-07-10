import { Bill, Result } from '../types'

export default function(bills: Bill[]): Result {
  const stats: Result = {
    balance: 0,
    top_counterparty: {
      name: '',
      amount: 0
    },
    top_day: {
      time: 0,
      amount: 0,
      formatted: ''
    }
  }

  const topCounterparties = new Map<string, number>()
  const expensiveDay = new Map<number, number>()

  bills.forEach((bill) => {
    if (!topCounterparties.has(bill.counterparty)) {
      topCounterparties.set(bill.counterparty, 0)
    }

    topCounterparties.set(bill.counterparty, topCounterparties.get(bill.counterparty) + bill.amount)

    if (!expensiveDay.has(bill.due_date)) {
      expensiveDay.set(bill.due_date, 0)
    }

    expensiveDay.set(bill.due_date, expensiveDay.get(bill.due_date) + bill.amount)

    stats.balance += bill.amount
  })

  topCounterparties.forEach((amount, name) => {
    if (stats.top_counterparty.amount < amount) {
      stats.top_counterparty.amount = amount
      stats.top_counterparty.name = name
    }
  })

  expensiveDay.forEach((amount, time) => {
    if (stats.top_day.amount < amount) {
      stats.top_day.amount = amount
      stats.top_day.time = time
    }
  })

  stats.top_day.formatted = (new Date(stats.top_day.time)).toLocaleString()

  return stats
}
