FROM seegno/node:7

USER root
RUN npm install nodemon -g

ENTRYPOINT [ "sh", "./entrypoint.sh" ]
