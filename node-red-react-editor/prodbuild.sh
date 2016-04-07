#!/bin/bash
npm run build
cp ./static/*.js ../red-server/static
cd ../red-server && node server.js
