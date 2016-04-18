#!/bin/bash
npm run build
cp ./static/*.js ../red-server/static
cp -R images ../red-server/static/images
cd ../red-server && node server.js
