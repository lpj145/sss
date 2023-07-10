import express from 'express'
import { generateBills } from './seeds'
import { dispatch, exportResults, setupWorkers } from './jobs'
import { exportMetrics } from './metrics'
import fs from 'fs'
import path from 'path'

function onBillsSeedsRequest(req: express.Request, res: express.Response) {
  const { from, to } = req.query

  if (!from && !to) {
    res
      .status(400)
      .send('You should supply query params like: from=2023-07-01&to=2023-07-31')
    return
  }

  res
    .contentType('application/json')
    .send(
      JSON.stringify(
        generateBills(from as string, to as string)
      )
    )
}

function startServer(port: number) {
  const app = express()

  app.use(express.json())

  app.get('/generate-bills', onBillsSeedsRequest)

  app.get('/metrics', (_, res: express.Response) => {
    res
      .contentType('application/json')
      .send(JSON.stringify(exportMetrics()))
  })

  app.post('/analyze', async(req: express.Request, res: express.Response) => {
    const jobName = req.query.job || 'all'

    if (!Array.isArray(req.body)) {
      res
        .status(400)
        .send('Invalid request')
      return
    }

    await dispatch(jobName as string, req.body)
    res.send('dispatched')
  })

  app.get('/results', (_, res: express.Response) => {
    res
      .contentType('application/json')
      .send(exportResults())
  })


  app.get('/', async (_, res: express.Response) => {
    const html = fs.readFileSync(path.resolve(__dirname, 'index.html'))
    res
      .contentType('text/html')
      .send(html)
  })

  app.listen(port, () => {
    console.log(`Http server running over: http://localhost:3000`)
  })

  return app
}

setupWorkers()
startServer(3000)
