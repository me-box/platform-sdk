#!/bin/sh
mkdir -p /tmp/databoxpids

echo "starting fake data source..."
cd ~/databox-companion-app/datasource && npm start &
echo $! > /tmp/databoxpids/datasource.pid

echo "starting test app..."
cd ~/databox-companion-app/server && npm start &
echo $! > /tmp/databoxpids/companionapp.pid

#echo "staring node red...."
#cd ~/node-red && node red &
#echo $! > /tmp/databoxpids/nodered.pid

echo "building and starting editor..."
cd ~/iot.red/node-red-react-editor && ./prodbuild.sh 
