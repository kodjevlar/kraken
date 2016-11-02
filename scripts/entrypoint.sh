#!/bin/sh
if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode..."
  node --harmony-async-await src/index.js
elif [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode. Installing nodemon..."
  npm install nodemon -g
  nodemon --inspect=9222 --harmony-async-await src/index.js
fi
