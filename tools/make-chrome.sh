#!/usr/bin/env bash

mv firefox.manifest.json manifest.json
zip magisterpp-firefox.xpi ./manifest.json ./ -qr
mv manifest.json firefox.manifest.json
