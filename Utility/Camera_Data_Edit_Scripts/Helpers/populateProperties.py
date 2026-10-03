# Iterate through features, adding in an ID and other properties when missing
def populate_properties(data, desiredProperties):
    idSet = []
    currentId = 0

    for feature in data["features"]:
        if "osmId" in feature["properties"]:
            idSet.append(feature["properties"]["osmId"])
        else:
            if not(currentId in idSet):
                feature["properties"]["osmId"] = currentId
                idSet.append(currentId)
                currentId += 1

        for property in desiredProperties:
            if not(property in feature["properties"]):
                feature["properties"][property] = "unknown"

    data["identifiers"] = {}
    for i in range(len(idSet)):
        data["identifiers"][str(idSet[i])] = i

    return data