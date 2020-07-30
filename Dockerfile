FROM node:13.12.0

COPY . /app

WORKDIR /app

RUN npm install

ENTRYPOINT npm start
