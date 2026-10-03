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

# Remove extra geojson features from national Flock data
def filter_to_local(data):
    data["features"] = list(filter(filter_by_coord, data["features"]))
    return data
