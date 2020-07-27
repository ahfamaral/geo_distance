FROM node:13.12.0

COPY . /app
RUN npm install

WORKDIR /app

ENTRYPOINT npm start
