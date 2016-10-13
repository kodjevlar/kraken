FROM seegno/node:7

USER root
RUN npm install nodemon -g
USER node

ENTRYPOINT [ "sh", "./entrypoint.sh" ]
