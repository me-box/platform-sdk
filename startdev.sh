#!/bin/sh
mkdir -p /tmp/databoxpids
#ROOTDIR="/Users/tomlodge/iot"
ROOTDIR="/home/databox"
echo "starting dev server..."
cd red-server && npm run dev &
echo $! > /tmp/databoxpids/red-server.pid

echo "compiling databox editor..."
cd node-red-react-editor && npm run watch
