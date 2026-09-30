import json

# Filter out any objects not in the Greater Lafayette Area
def filter_by_coord(object):
    try:
        coords = object["geometry"]["coordinates"]
        if coords[0] > -86.962328 and coords[0] < -86.752802 and coords[1] > 40.301640 and coords[1] < 40.489380:
            return True
        else:
            return False
    except:
        return False

nationwide_file = open("src/location_data/National-Flock-Data.geojson")
purdue_file = open("src/location_data/Purdue_Security_Purdue_Cameras.geojson")
local_file = open("src/location_data/GreaterLAF-Cameras.geojson", "w")

desired_properties = ["brand", "owner", "surveillanceZone"]
id_set = []
current_id = 0

# Filter from full list of cameras
camera_data = json.load(nationwide_file)
camera_data["features"] = list(filter(filter_by_coord, camera_data["features"]))

camera_data["features"].extend(json.load(purdue_file)["features"])

for feature in camera_data["features"]:
    if "osmId" in feature["properties"]:
        id_set.append(feature["properties"]["osmId"])
    else:
        if not(current_id in id_set):
            feature["properties"]["osmId"] = current_id
            id_set.append(current_id)
            current_id += 1

    for property in desired_properties:
        if not(property in feature["properties"]):
            feature["properties"][property] = "unknown"

# Dump results back into file
json.dump(camera_data, local_file, sort_keys=True, indent=4)