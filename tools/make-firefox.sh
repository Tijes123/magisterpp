#!/usr/bin/env bash

mv firefox.manifest.json manifest.json
zip magisterpp-firefox.xpi ./manifest.json ./html ./icons ./js ./css -qr
mv manifest.json firefox.manifest.json
