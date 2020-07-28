require('dotenv/config')
const axios = require('axios')

const apiKey = process.env.GEOCODING_API_KEY

const euclidianDistances = async (data) => {
	console.log('returning euclidianDistances')
	const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${apiKey}`)

	console.log('response: ', response.data)
	return response.data
}

module.exports = {
	euclidianDistances,
}
