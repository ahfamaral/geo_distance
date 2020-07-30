const Joi = require('joi')

const { euclidianDistancesProcess } = require('./helpers')

const schema = Joi.object()
	.keys({
		addresses: Joi.array().items(Joi.string()).min(2).required(),
	})

const geoDistance = async (req, res) => {
	console.log('[START] Initiating Geodistance Process ...')
	const { body } = req

	console.log('Validating inputs ...')
	const validationResult = Joi.validate(body, schema)

	if (validationResult.error) {
		return res.status(422).json({
			error: validationResult.error.name,
			message: 'Invalid request data',
		})
	}

	const sortedDistances = await euclidianDistancesProcess(body.addresses)

	console.log('[FINISH] Responding request ...')
	return res.json(sortedDistances)
}

module.exports = {
	geoDistance,
}
