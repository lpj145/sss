import { Bill } from '../types'

export default function handle(bills: Bill[]): number {
  return bills.reduce((amount, bill) => {
    amount += bill.amount
    return amount
  }, 0)
}

