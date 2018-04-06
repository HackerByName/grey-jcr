FROM node:6.13.0-alpine

WORKDIR /usr/app

COPY package.json .
COPY semantic.json .
COPY semantic semantic

RUN npm install --quiet

COPY bin bin
COPY src src
COPY app.js .
COPY knexfile.js .
