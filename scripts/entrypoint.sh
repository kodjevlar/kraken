#!/bin/sh
if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode..."
  node src/server.js
elif [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode. Installing nodemon..."
  npm install nodemon -g
  nodemon --inspect=9222 src/server.js
fi
