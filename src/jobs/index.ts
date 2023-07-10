import IORedis from 'ioredis'
import { Queue, Worker } from 'bullmq'
import { setupMetrics, updateMetricsOnComplete, updateMetricsOnActive } from '../metrics'
// Jobs
import all from './all'
import balance from './balance'
import top_counterparty from './top_counterparty'
import top_day from './top_day'
import { Result } from '../types'

const jobs = {
  all,
  balance,
  top_counterparty,
  top_day
}

const jobResults = new Map<string, Result | Partial<Result>>()

const connection = new IORedis({
  maxRetriesPerRequest: null
})

const queue = new Queue('statistics_analyzer', {connection})

export function setupWorkers() {
  const worker = new Worker('statistics_analyzer', async ({ name, data }) => {
    if (jobs[name]) {
      return jobs[name](data)
    }

    return {}
  }, { connection })

  setupMetrics(Object.keys(jobs))

  worker.on('active', (job) => {
    updateMetricsOnActive(job.name, job.data)
  })
  worker.on('completed', (job, result) => {
    updateMetricsOnComplete(job.name)
    jobResults.set(job.name, result)
  })
}

export async function dispatch(name: 'all' | 'balance' | 'topCounterparty' | 'expensiveDay' | string, data: unknown) {
  return queue.add(name, data)
}

export function exportResults(): Result | Partial<Result> {
  const result = {}
  jobResults.forEach((details, name) => {
    result[name] = details
  })
  return JSON.stringify(result) as Result | Partial<Result>
}
