FROM seegno/node:7

USER root
RUN npm install nodemon -g
USER node

ENTRYPOINT [ "nodemon", "--harmony_async_await", "src/index.js" ]
