FROM node:7
MAINTAINER Johan Kanefur <johan.canefur@gmail.com>

WORKDIR /home/node/app

COPY scripts .
COPY src .
COPY package.json .

RUN npm install --only=production

ENTRYPOINT [ "bash", "./scripts/entrypoint.sh" ]
