#!/bin/sh
mkdir -p /tmp/databoxpids

echo "starting dev server..."
cd ~/iot.red/red-server && npm run dev &
echo $! > /tmp/databoxpids/red-server.pid

#echo "starting fake data source..."
#cd ~/databox-companion-app/datasource && npm start &
#echo $! > /tmp/databoxpids/datasource.pid

#echo "starting test app..."
#cd ~/databox-companion-app/server && npm start &
#echo $! > /tmp/databoxpids/companionapp.pid

echo "compiling databox editor..."
cd ~/iot.red/node-red-react-editor && npm run watch
