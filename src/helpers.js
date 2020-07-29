require('dotenv/config')
const axios = require('axios')
const utf8 = require('utf8')

const apiKey = process.env.GEOCODING_API_KEY

const url = 'https://maps.googleapis.com/maps/api/geocode/json?address='

const requestGoogleApi = async (reqs) => axios.all(reqs)
	.then((res) => res)
	.catch((e) => e.response.data)

const calculateEuclidianDistances = (x, y) => {
	if ((x.lat === y.lat) && (x.lng === y.lng)) {
		return 0
	}

	const radlat1 = (Math.PI * x.lat) / 180
	const radlat2 = (Math.PI * y.lat) / 180
	const theta = x.lng - y.lng
	const radtheta = (Math.PI * theta) / 180

	let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)

	if (dist > 1) {
		dist = 1
	}

	dist = Math.acos(dist)
	dist *= (180 / Math.PI)
	dist *= 60 * 1.1515

	dist *= 1.609344

	return dist.toFixed(2)
}

const euclidianDistancesProcess = async (addressList) => {
	console.log('Initiating Euclidian Distances Process ...')
	const requestArray = []

	addressList.forEach((address) => {
		const requestString = `${url}${utf8.encode(address)}&key=${apiKey}`
		const axiosRequest = axios.get(requestString)
		requestArray.push(axiosRequest)
	})

	console.log('Requesting google Geocoding Api ...')
	const googleResponse = await requestGoogleApi(requestArray)

	if (googleResponse.error_message) {
		console.log('[ERROR]: ', googleResponse.error_message)
		return googleResponse.error_message
	}

	console.log('Removing not found addresses ...')
	const foundCoordinates = googleResponse.map((el) => {
		if (el.data.results.length) {
			return {
				coordinates: el.data.results[0].geometry.location,
				address: el.data.results[0].formatted_address,
			}
		}

		return undefined
	})

	const validAddresses = foundCoordinates.filter((el) => el !== undefined)

	const addressesDistances = []

	console.log('Calculating and sorting distances in ascending order ...')
	validAddresses.forEach((referenceAddress, index) => {
		const distances = []

		for (let i = 0; i < validAddresses.length; i += 1) {
			if (index !== i) {
				const euclidianDistance = calculateEuclidianDistances(
					referenceAddress.coordinates,
					validAddresses[i].coordinates,
				)
				distances.push({
					address: validAddresses[i].address,
					distance: euclidianDistance,
				})
			}
		}

		distances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))

		addressesDistances.push({
			from: referenceAddress.address,
			to: distances,
		})
	})

	console.log('Returning sorted distances ...')

	return addressesDistances
}

module.exports = {
	euclidianDistancesProcess,
}
