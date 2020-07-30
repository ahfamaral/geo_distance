# geo_distance
API Rest para cálculo de distância euclidiana utilizando Geocoding API do google

## Set .env GEOCODING_API_KEY variable
In order to interact with google [Geocoding API] **GEOCODING_API_KEY** with your own API_KEY
(https://developers.google.com/maps/documentation/geocoding/start)

## Usage
Docker or NPM commands

### Docker
Use **docker-compose** to build and run.
```bash
docker-compose up
```

### NPM
Use the node package manager **npm** to install and start.
#### install
```bash
npm install
```
#### start in development mode
```bash
npm run dev
```
#### start
```bash
npm start
```
#### lint
```bash
npm run lint
```

### Interaction
API will be running in PORT 3000

It's possible to check API status making a **GET** request in route **http://localhost:3000/status**

Make a **POST** request in route **http://localhost:3000/distances** using a JSON like:

```node
{
  "addresses": [
		"R. do Farol, 158-220, Barra do Corda - MA, 65950-000",
		"390 Portola Plaza, Los Angeles, CA 90095, Estados Unidos",
		"58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội 100000, Vietnã",
		"Platz der Republik 1, 11011 Berlin, Alemanha",
		"9430 Sankt Margrethen, Suíça"
	]
}
```

It should have a minimun of two addresses.

Despite it's not mandatory to include ZIP Codes, it helps to avoid similar addresses to be found

### Response
Expect a **status 200** response like:
```node
{
  "closest": {
    "from": "Reichstagsgebäude, Platz der Republik 1, 10557 Berlin, Germany",
    "to": "9430 St Margrethen, Switzerland",
    "distance_km": "623.78"
  },
  "furthest": {
    "from": "R. do Farol, 158, Barra do Corda - MA, 65950-000, Brazil",
    "to": "58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội, Vietnam",
    "distance_km": "16451.66"
  },
  "relations_list": [
    {
      "from": "R. do Farol, 158, Barra do Corda - MA, 65950-000, Brazil",
      "to": [
        {
          "address": "9430 St Margrethen, Switzerland",
          "distance_km": "7954.52"
        },
        {
          "address": "Reichstagsgebäude, Platz der Republik 1, 10557 Berlin, Germany",
          "distance_km": "8467.75"
        },
        {
          "address": "390 Portola Plaza, Los Angeles, CA 90095, USA",
          "distance_km": "8823.33"
        },
        {
          "address": "58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội, Vietnam",
          "distance_km": "16451.66"
        }
      ]
    },
    {
      "from": "390 Portola Plaza, Los Angeles, CA 90095, USA",
      "to": [
        {
          "address": "R. do Farol, 158, Barra do Corda - MA, 65950-000, Brazil",
          "distance_km": "8823.33"
        },
        {
          "address": "Reichstagsgebäude, Platz der Republik 1, 10557 Berlin, Germany",
          "distance_km": "9314.33"
        },
        {
          "address": "9430 St Margrethen, Switzerland",
          "distance_km": "9577.68"
        },
        {
          "address": "58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội, Vietnam",
          "distance_km": "12302.47"
        }
      ]
    },
    {
      "from": "58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội, Vietnam",
      "to": [
        {
          "address": "Reichstagsgebäude, Platz der Republik 1, 10557 Berlin, Germany",
          "distance_km": "8329.06"
        },
        {
          "address": "9430 St Margrethen, Switzerland",
          "distance_km": "8749.72"
        },
        {
          "address": "390 Portola Plaza, Los Angeles, CA 90095, USA",
          "distance_km": "12302.47"
        },
        {
          "address": "R. do Farol, 158, Barra do Corda - MA, 65950-000, Brazil",
          "distance_km": "16451.66"
        }
      ]
    },
    {
      "from": "Reichstagsgebäude, Platz der Republik 1, 10557 Berlin, Germany",
      "to": [
        {
          "address": "9430 St Margrethen, Switzerland",
          "distance_km": "623.78"
        },
        {
          "address": "58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội, Vietnam",
          "distance_km": "8329.06"
        },
        {
          "address": "R. do Farol, 158, Barra do Corda - MA, 65950-000, Brazil",
          "distance_km": "8467.75"
        },
        {
          "address": "390 Portola Plaza, Los Angeles, CA 90095, USA",
          "distance_km": "9314.33"
        }
      ]
    },
    {
      "from": "9430 St Margrethen, Switzerland",
      "to": [
        {
          "address": "Reichstagsgebäude, Platz der Republik 1, 10557 Berlin, Germany",
          "distance_km": "623.78"
        },
        {
          "address": "R. do Farol, 158, Barra do Corda - MA, 65950-000, Brazil",
          "distance_km": "7954.52"
        },
        {
          "address": "58 Quốc Tử Giám, Văn Miếu, Đống Đa, Hà Nội, Vietnam",
          "distance_km": "8749.72"
        },
        {
          "address": "390 Portola Plaza, Los Angeles, CA 90095, USA",
          "distance_km": "9577.68"
        }
      ]
    }
  ]
}
```