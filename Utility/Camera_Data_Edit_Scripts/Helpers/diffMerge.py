def merge_objects(base, incoming):
    mergedObject = base
    for key in incoming.keys():
        if isinstance(incoming[key], dict):
            mergedObject[key] = merge_objects(mergedObject[key], incoming[key])
        else:
            mergedObject[key] = incoming[key]

    return mergedObject

def merge_diffs(base, incoming):
    merged = base
    for id, index in incoming["identifiers"].items():
        baseIndex = base["identifiers"][str(id)]
        baseObject = base["features"][baseIndex]

        incomingObject = incoming["features"][index]

        merged["features"][baseIndex] = merge_objects(baseObject, incomingObject)

    return merged
