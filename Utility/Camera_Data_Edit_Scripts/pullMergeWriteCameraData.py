# External includes
import json

# Local includes
import Helpers.diffMerge as diffMerge
from Helpers.filterNationalData import filter_to_local
from Helpers.populateProperties import populate_properties

# Camera data filepath definitions
diffFilepath        = "Utility/Camera_Data/Camera_Data_Changes.json"
mapSrcFilepath      = "src/location_data/GreaterLAF-Cameras.geojson"
nationalFilepath    = "Utility/Camera_Data/National-Flock-Data.geojson"
purdueFilepath      = "Utility/Camera_Data/Purdue_Security_Purdue_Cameras.geojson"

# The structure to capture all .geojson data for the map
cameraData = {}

# Properties that all features should include
desiredProperties = ["brand", "owner", "surveillanceZone"]

# Filter local Flock cameras from National list of cameras
with open(nationalFilepath, "r") as nationalFile:
    cameraData = json.load(nationalFile)

cameraData = filter_to_local(cameraData)

# Add the purdue cameras to the full dataset
with open(purdueFilepath, "r") as purdueFile:
    purdueCameraData = json.load(purdueFile)

    desiredProperties = \
    {
        "brand": "Axis",
        "owner": "Purdue University",
        "surveillanceZone": "Public",
    }
    purdueCameraData = populate_properties(purdueCameraData, desiredProperties)

    cameraData["features"].extend(purdueCameraData["features"])

# Populate missing properties and id's
desiredProperties = \
{
    "brand": "unknown",
    "owner": "unknown",
    "surveillanceZone": "unknown",
}
cameraData = populate_properties(cameraData, desiredProperties)

# Merge imported data with previously changed fields
with open(diffFilepath, "r") as diffFile:
    diffs = json.load(diffFile)
    cameraData = diffMerge.merge_diffs(cameraData, diffs)

# Dump results back into file
with open(mapSrcFilepath, "w") as mapSrcFile:
    json.dump(cameraData, mapSrcFile, sort_keys=True, indent=4)