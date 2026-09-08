const fs = require('node:fs')

const express = require('express')

const inquiryModule = require('./epigenetics-inquiry')
const {
  CrmRouter,
  DELIVERY_RESULTS,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
} = require('./lead-foundation')

const backendPort = Number(process.env.PT157_BACKEND_PORT || 5017)
const crmPort = Number(process.env.PT157_CRM_PORT || 5018)
const evidencePath = process.env.PT157_CRM_EVIDENCE_PATH

if (!process.env.LEAD_DB_PATH || !evidencePath) {
  throw new Error('PT15.7 E2E requires LEAD_DB_PATH and PT157_CRM_EVIDENCE_PATH')
}

const database = openLeadDatabase({ filename: process.env.LEAD_DB_PATH })
const repository = new LeadRepository(database)

const crmReceiver = express()
crmReceiver.use(express.json())
crmReceiver.post('/crm/epigenetics', (req, res) => {
  fs.appendFileSync(evidencePath, `${JSON.stringify(req.body)}\n`)
  res.status(202).json({ accepted: true })
})

const crmServer = crmReceiver.listen(crmPort, '127.0.0.1')
const router = new CrmRouter({
  adapters: {
    epigenetics: {
      async deliver(delivery) {
        const response = await fetch(`http://127.0.0.1:${crmPort}/crm/epigenetics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': delivery.deliveryKey,
          },
          body: JSON.stringify({
            leadId: delivery.lead.id,
            journey: delivery.lead.journey,
            target: delivery.target,
            context: delivery.lead.context,
          }),
        })
        return response.ok
          ? { status: DELIVERY_RESULTS.DELIVERED }
          : { status: DELIVERY_RESULTS.RETRYABLE_ERROR, errorClass: 'CRM_HTTP_ERROR' }
      },
    },
  },
})
const worker = new LeadHandoffWorker({
  repository,
  router,
  workerId: `pt15-7-golden-path-${process.pid}`,
})
const service = inquiryModule.createEpigeneticsInquiryService({ repository, worker })

// Test-only composition seam: server.js destructures this export when loaded.
// Product runtime remains unchanged and continues to use its configured router.
inquiryModule.getRuntimeEpigeneticsInquiryService = () => service
const { app } = require('./server')
const backendServer = app.listen(backendPort, '127.0.0.1', () => {
  console.log(`PT15.7 backend listening on ${backendPort}; CRM receiver on ${crmPort}`)
})

function shutdown() {
  backendServer.close(() => {
    crmServer.close(() => {
      database.close()
      process.exit(0)
    })
  })
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
