FROM node:10.16.0-alpine

WORKDIR /usr/app
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait
COPY package.json .
RUN npm install
ENV PATH="/usr/app/node_modules/.bin/:${PATH}"
COPY . .