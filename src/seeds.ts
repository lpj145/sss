import { eachDayOfInterval } from 'date-fns'
import { faker } from '@faker-js/faker'
import { Bill } from './types'

/**
 * We will use this seeds to generate sample of paid bills during a time interval for some world organization
 */

const BILLS_TAGS = [
  faker.word.verb(),
  faker.word.verb(),
  faker.word.verb(),
  faker.word.verb(),
  faker.word.verb(),
  faker.word.verb(),
  faker.word.verb(),
  faker.word.verb(),
]
const COUNTERPARTIES = [faker.company.name(), faker.company.name(), faker.company.name(), faker.company.name(), faker.company.name(), faker.company.name()]

/**
 * We can remove duplicated results by using a memoized function here
 */
export function randomBillTag(): string {
  const index = faker.number.int({ min: 0, max: BILLS_TAGS.length - 1 })
  return BILLS_TAGS[index]
}

/**
 * We can remove duplicated results by using a memoized function here
 */
export function randomCounterparty(): string {
  const index = faker.number.int({ min: 0, max: COUNTERPARTIES.length - 1 })
  return COUNTERPARTIES[index]
}

/**
 * Use fakerjs to generate some random data
 */
export function generateBill(due_date: number): Bill {
  return {
    amount: parseFloat(faker.finance.amount(-10000, 10000)) as number,
    category: faker.finance.transactionType(),
    due_date,
    counterparty: randomCounterparty(),
    tags: [randomBillTag(), randomBillTag(), randomBillTag()]
  }
}

/**
 * Generate bills for a spec time period with a maximum qty of bills per month
 * You should supply args as "2023-01-01", "2023-04-30"
 * It will generate a data stucture like: "[{"amount": 0.3, "category": "revenue", "tags": ["tag1"], "due_date": 123478123 }]"
 */
export function generateBills(from: string, to: string): Bill[] {
  const start = new Date(from.split('-'))
  const end = new Date(to.split('-'))
  const days = eachDayOfInterval({ start, end })
  return days.map((date) => generateBill(date.getTime()))
}
