#!/bin/sh
mkdir -p /tmp/databoxpids
ROOTDIR="/Users/tomlodge/iot"

echo "starting dev server..."
cd $ROOTDIR/iot.red/red-server && npm run dev &
echo $! > /tmp/databoxpids/red-server.pid

echo "compiling databox editor..."
cd $ROOTDIR/iot.red/node-red-react-editor && npm run watch
