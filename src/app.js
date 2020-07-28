const express = require('express')

const { geoDistance } = require('./controller')

const app = express()

app.use(express.json())

const port = 3000

app.get('/status', (req, res) => {
	res.send({
		status: 'online',
	})
})

app.post('/distances', geoDistance)

app.listen(port, () => {
	console.log('API listening to PORT ', port)
})
