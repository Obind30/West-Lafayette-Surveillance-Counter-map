import json

searchId = 0

newJsonData = {}
oldJsonData = {}
diffJsonData = {}

def filterById(object):
    global oldJsonData
    try:
        id = object["properties"]["osmId"]
        if id == searchId:
            oldJsonData = object
            return newJsonData
        else:
            return object
    except:
        return

def overwriteDifferences(original, new):
    print(original)
    print(new)
    diffObject = {}
    keys = new.keys()

    for key in keys:
        if (original != None) and (new != None) and (key in original) and (key in new):
            if isinstance(new[key], dict):
                diff = overwriteDifferences(original[key], new[key])
                if diff != {}:
                    diffObject[key] = diff
            else:
                diffObject[key] = new[key]
        elif (new != None) and (key in new):
            if isinstance(new[key], dict):
                diff = overwriteDifferences(None, new[key])
                if diff != {}:
                    diffObject[key] = diff
            else:
                diffObject[key] = new[key]
        elif (original != None) and (key in original):
            if isinstance(original[key], dict):
                diff = overwriteDifferences(original[key], None)
                if diff != {}:
                    diffObject[key] = diff
            else:
                diffObject[key] = original[key]

    return diffObject

def filterDiff(object):
    global diffJsonData
    try:
        id = object["properties"]["osmId"]
        if id == searchId:

            print(overwriteDifferences(object, diffJsonData))
            return overwriteDifferences(object, diffJsonData)
        else:
            return object
    except:
        return

def recordDifferences(original, new):
    diffObject = {}
    keys = new.keys()

    for key in keys:
        if (original != None) and (key in original):
            if isinstance(new[key], dict):
                diff = recordDifferences(original[key], new[key])
                if diff != {}:
                    diffObject[key] = diff
            else:
                if new[key] != original[key]:
                    diffObject[key] = new[key]
        else:
            if isinstance(new[key], dict):
                diff = recordDifferences(None, new[key])
                if diff != {}:
                    diffObject[key] = diff
            else:
                diffObject[key] = new[key]

    return diffObject

def addDiffToLog(original, new):
    global diffJsonData
    diffFilepath = "Utility/Camera_Data_Changes.json"
    diffJsonData = recordDifferences(original, new)
    if not("properties" in diffJsonData.keys()):
        diffJsonData["properties"] = {}
    diffJsonData["properties"]["osmId"] = searchId
    print(diffJsonData)

    diffFile = open(diffFilepath, 'r')
    changeData = json.load(diffFile)
    diffFile.close()

    filteredData = list(map(filterDiff, changeData["features"]))
    if filteredData == changeData["features"]:
        filteredData.append(diffJsonData)
        changeData["identifiers"][str(diffJsonData["properties"]["osmId"])] = len(filteredData)-1

    changeData["features"] = filteredData

    diffFile = open(diffFilepath, 'w')
    json.dump(changeData, diffFile, sort_keys=True, indent=4)

filePath = "src/location_data/GreaterLAF-Cameras.geojson"

jsonFile = open(filePath, "r")

jsonData = json.load(jsonFile)
jsonFile.close()
newJsonData = json.loads(input("Enter JSON block:\n"))
searchId = newJsonData["properties"]["osmId"]

jsonData["features"] = list(map(filterById, jsonData["features"]))

jsonFile = open(filePath, "w")
json.dump(jsonData, jsonFile, sort_keys=True, indent=4)
jsonFile.close()

addDiffToLog(oldJsonData, newJsonData)