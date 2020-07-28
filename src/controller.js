const Joi = require('joi')

const { euclidianDistances } = require('./helpers')

const schema = Joi.object()
	.keys({
		addresses: Joi.array().items(Joi.string()).required(),
	})

const geoDistance = async (req, res) => {
	const { body } = req

	const validationResult = Joi.validate(body, schema)

	if (validationResult.error) {
		return res.status(422).json({
			error: validationResult.error.name,
			message: 'Invalid request data',
		})
	}

	const distance = await euclidianDistances(body)

	return res.json(distance)
}

module.exports = {
	geoDistance,
}
