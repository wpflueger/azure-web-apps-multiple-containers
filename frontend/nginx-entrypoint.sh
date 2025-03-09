#!/bin/sh
# Substitute environment variables in the env-config.js file
envsubst '$REACT_APP_API_ROOT' < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js
exec "$@"
