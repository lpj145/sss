/**
 * For performance reasons in sorting, comparing cases
 * we will use date as timestamp number everytime, and just do a transformation on view
 * to show the date in a human-readable way.
 *
 */

export type Bill = {
  amount: number
  category: string
  tags: string[]
  due_date: number
  counterparty: string
}

export type JobMetric = {
  avgTime: number
  completed: number
  endTime: number
  lastExecutionInMs: number
  startAt: number
  startTime: number
  highestDelay: number
  highestItems: number
}

export type Result = {
  balance: number
  top_day: {
    time: number
    amount: number
    formatted: string
  }
  top_counterparty: {
    name: string
    amount: number
  }
}