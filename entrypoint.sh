#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode..."
  node --harmony_async_await src/index.js
elif [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode..."
  nodemon --harmony_async_await src/index.js
fi
