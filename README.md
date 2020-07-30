# geo_distance
API Rest para cálculo de distância euclidiana utilizando Geocoding API do google

## Using NPM
Use the package manager [npm] to install and run.
### Installation
```bash
npm install
```

### Run
```bash
npm start
```

## Using Docker
Use [docker-compose] to build and run.
```bash
docker-compose up
```

## Usage
API will be running in PORT 3000

It's possible to check API status making a [GET] request in route [http://localhost:3000/status]

Make a [POST] request in route [http://localhost:3000/distances] using a JSON like

```node
{
    "addresses": [
		"Rua Caiubi, 324 Perdizes, São Paulo SP",
		"Rua Desembargador do Vale, 80 Perdizes, São Paulo SP"
    ]
}
```

It should have a minimun of two addresses
