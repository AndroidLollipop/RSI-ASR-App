#!/bin/bash

./gradlew ${1:-installDevDebug} --stacktrace && adb shell am start -n rsiapp.rsiapp/host.exp.exponent.MainActivity
