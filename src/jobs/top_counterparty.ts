import { Bill, Result } from '../types'

export default function (bills: Bill[]): Result['top_counterparty'] {
  const list = new Map<string, number>()
  let topCounterparty: Result['top_counterparty'] = {
    name: '',
    amount: 0
  }

  // Iterate over all bills to structure counterparty -> amount data
  bills.forEach((bill) => {
    if (!list.has(bill.counterparty)) {
      list.set(bill.counterparty, 0)
    }

    list.set(bill.counterparty, list.get(bill.counterparty) + bill.amount)
  })

  // Check all the counterparties to get the most expensive ones
  list.forEach((amount, name) => {
    if (amount > topCounterparty.amount) {
      topCounterparty.amount = amount
      topCounterparty.name = name
    }
  })

  return topCounterparty
}
