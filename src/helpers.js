require('dotenv/config')
const axios = require('axios')
const utf8 = require('utf8')

const apiKey = process.env.GEOCODING_API_KEY

const url = 'https://maps.googleapis.com/maps/api/geocode/json?address='

const requestGoogleApi = (reqs) => axios.all(reqs)
	.then((res) => res)
	.catch((e) => {
		throw new Error(
			`Unexpected Error when dealing with Geocoding Google Api requests: ${e}`,
		)
	})

const calculateEuclidianDistances = (x, y) => {
	if ((x.lat === y.lat) && (x.lng === y.lng)) {
		return 0
	}

	const radlat1 = (Math.PI * x.lat) / 180
	const radlat2 = (Math.PI * y.lat) / 180
	const theta = x.lng - y.lng
	const radtheta = (Math.PI * theta) / 180

	let dist = Math.sin(radlat1) * Math.sin(radlat2)
		+ Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)

	if (dist > 1) {
		dist = 1
	}

	dist = Math.acos(dist)
	dist *= (180 / Math.PI)
	dist *= 60 * 1.1515

	dist *= 1.609344

	return dist.toFixed(2)
}

const closestAndFurthest = (sortedDistances) => {
	console.log('Calculating closest and furthest addresses ...')
	const closestAddresses = {
		from: '',
		to: '',
		distance_km: parseFloat(sortedDistances[0].to[0].distance_km),
	}
	const furthestAddresses = {
		from: '',
		to: '',
		distance_km: parseFloat(sortedDistances[0].to[0].distance_km),
	}

	sortedDistances.forEach((addressRelation) => {
		addressRelation.to.forEach((destiny) => {
			if (furthestAddresses.distance_km <= parseFloat(destiny.distance_km)) {
				furthestAddresses.distance_km = destiny.distance_km
				furthestAddresses.from = addressRelation.from
				furthestAddresses.to = destiny.address
			}

			if (closestAddresses.distance_km >= parseFloat(destiny.distance_km)) {
				closestAddresses.distance_km = destiny.distance_km
				closestAddresses.from = addressRelation.from
				closestAddresses.to = destiny.address
			}
		})
	})

	return {
		closest: closestAddresses,
		furthest: furthestAddresses,
	}
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

	console.log('Removing not found addresses ...')
	const foundCoordinates = googleResponse.map((res) => {
		if (res.data.error_message) {
			throw new Error(res.data.error_message)
		}

		if (res.data.results.length) {
			return {
				coordinates: res.data.results[0].geometry.location,
				address: res.data.results[0].formatted_address,
			}
		}

		return undefined
	})

	const validAddresses = foundCoordinates.filter((el) => el !== undefined)

	if (validAddresses.length < 2) {
		throw new Error('Could not find at least two addresses')
	}

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
					distance_km: euclidianDistance,
				})
			}
		}

		distances.sort((a, b) => parseFloat(a.distance_km) - parseFloat(b.distance_km))

		addressesDistances.push({
			from: referenceAddress.address,
			to: distances,
		})
	})

	const {
		closest,
		furthest,
	} = closestAndFurthest(addressesDistances)

	console.log('Returning all calculated distance relations ...')

	return {
		closest,
		furthest,
		relations_list: addressesDistances,
	}
}

module.exports = {
	euclidianDistancesProcess,
}
