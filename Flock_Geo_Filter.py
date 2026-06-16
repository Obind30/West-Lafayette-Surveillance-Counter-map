import json

def filter_by_coord(object):
    try:
        coords = object["geometry"]["coordinates"]
        if coords[0] > -86.962328 and coords[0] < -86.752802 and coords[1] > 40.301640 and coords[1] < 40.603983:
            return True
        else:
            return False
    except:
        return False

nationwide_file = open("location_data/National-Flock-Data.geojson")
local_file = open("location_data/GreaterLAF-Flock-Cameras.geojson", "w")

camera_data = json.load(nationwide_file)

local_features = list(filter(filter_by_coord, camera_data["features"]))

camera_data["features"] = local_features

json.dump(camera_data, local_file, sort_keys=True, indent=4)