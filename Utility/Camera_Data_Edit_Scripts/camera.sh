#!/bin/bash

case $1 in
    '--help')
        echo "Accepted forms include:"
        echo ""
        echo "cam --help    # List command info"
        echo "cam edit      # Edit a specific camera"
        echo "cam update    # Update the map source files with new .geojson data"
        ;;
    'edit')
        source utilsVenv/bin/activate
        python3 Utility/Camera_Data_Edit_Scripts/updateCameraData.py
        deactivate
        ;;
    'update')
        source utilsVenv/bin/activate
        python3 Utility/Camera_Data_Edit_Scripts/pullMergeWriteCameraData.py
        deactivate
        ;;
esac