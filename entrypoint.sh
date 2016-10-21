#!/bin/sh

# Create logging directories
mkdir -p "$LOG_DIR"

if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode..."
  node --harmony_async_await src/server.js
elif [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode..."
  nodemon --inspect=9222 --debug-brk --harmony_async_await src/server.js
fi
