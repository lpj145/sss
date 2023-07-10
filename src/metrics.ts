import { JobMetric } from './types'

const jobMetrics = new Map<string, JobMetric>()

function startMetric(name: string) {
  jobMetrics.set(name, {
    avgTime: 0,
    startTime: 0,
    startAt: (new Date()).getTime(),
    endTime: 0,
    lastExecutionInMs: 0,
    completed: 0,
    highestDelay: 0,
    highestItems: 0,
  })
}

export function setupMetrics(jobs: string[]) {
  jobs.forEach(startMetric)
}

export function updateMetricsOnActive(name: string, data: unknown[]) {
  if (!jobMetrics.has(name)) {
    return
  }

  const metrics = jobMetrics.get(name)
  metrics.startTime = (new Date()).getTime()

  // Metrify the highest items length
  if (metrics.highestItems < data.length) {
    metrics.highestItems = data.length
  }

  jobMetrics.set(name, metrics)
}

export function updateMetricsOnComplete(name: string) {
  if (!jobMetrics.has(name)) {
    return
  }

  const metrics = jobMetrics.get(name)
  // Metrify completed tasks
  metrics.completed++
  // Metrify the end and average time
  metrics.endTime = (new Date()).getTime()
  metrics.avgTime = metrics.lastExecutionInMs
  metrics.lastExecutionInMs = metrics.endTime - metrics.startTime
  metrics.avgTime = (metrics.lastExecutionInMs + metrics.avgTime) / 2

  // Metrify the highest delayed job
  if (metrics.highestDelay < metrics.lastExecutionInMs) {
    metrics.highestDelay = metrics.lastExecutionInMs
  }

  jobMetrics.set(name, metrics)
}

export function exportMetrics(): (JobMetric & { name: string })[] {
  const metrics =  []
  jobMetrics.forEach((m, name) => {
    metrics.push({
      name,
      ...m
    })
  })
  return metrics
}
