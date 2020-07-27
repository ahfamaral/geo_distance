const express = require('express')

const app = express()

app.use(express.json())

const port = 3000

app.get('/status', (req, res) => {
  res.send({
    status: 'online',
  })
})

// app.post('/distance', riskAnalysis)

app.listen(port, () => {
  console.log('API listening to PORT ', port)
})
