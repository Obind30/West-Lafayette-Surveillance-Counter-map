import json
import pyperclip

searchId = 0

newObject = {}
originalObject = {}

def overwriteDifferences(original, new):
    # Compare two objects and merge them, with new taking precedence
    diffObject = original
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
                diff = overwriteDifferences({}, new[key])
                if diff != {}:
                    diffObject[key] = diff
            else:
                diffObject[key] = new[key]
        elif (original != None) and (key in original):
            if isinstance(original[key], dict):
                diff = overwriteDifferences(original[key], {})
                if diff != {}:
                    diffObject[key] = diff
            else:
                diffObject[key] = original[key]

    return diffObject

def recordDifferences(original, new):
    # Compare two objects and safe their differences in a skeleton object
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

def addDiffToLog(original, new, diffFilepath):
    # Generate a diff object, only containing the changed data
    diffObject = recordDifferences(original, new)
    # Add the ID to the diff object
    if not("properties" in diffObject.keys()):
        diffObject["properties"] = {}
    diffObject["properties"]["osmId"] = searchId

    # Pull in the json data from the diff file
    changeData = {}
    with open(diffFilepath, 'r') as diffFile:
        changeData = json.load(diffFile)

    # Check for a matching diff object
    if str(diffObject["properties"]["osmId"]) in changeData["identifiers"].keys():
        # If a matching object exists, compare and merge them
        updateIndex = changeData["identifiers"][str(diffObject["properties"]["osmId"])]
        changeData["features"][updateIndex] = overwriteDifferences(changeData["features"][updateIndex], diffObject)
    else:
        # If no matching diff object existed,
        # add it to the diff file and include it's id in the dictionary
        changeData["features"].append(diffObject)
        changeData["identifiers"][str(diffObject["properties"]["osmId"])] = len(changeData["features"])-1

    # Dump data into the diff file
    with open(diffFilepath, 'w') as diffFile:
        json.dump(changeData, diffFile, sort_keys=True, indent=4)

# Camera data filepaths
diffFilepath = "Utility/Camera_Data/Camera_Data_Changes.json"
originalDataFilepath = "src/location_data/GreaterLAF-Cameras.geojson"

# Pull in existing camera data
originalData = {}
with open(originalDataFilepath, "r") as originalFile:   
    originalData = json.load(originalFile)

# Prompt for copied feature information
try:
    newObject = json.loads(pyperclip.paste())
except:
    newObject = json.loads(input("Enter new json data:"))
searchId = newObject["properties"]["osmId"]

# Replace the original object with a the new one
replacementIndex = originalData["identifiers"][str(searchId)]
originalObject = originalData["features"][replacementIndex]
originalData["features"][replacementIndex] = newObject

# Write update data to the map source file
with open(originalDataFilepath, "w") as updateFile:
    json.dump(originalData, updateFile, sort_keys=True, indent=4)

# Log changes so they are maintained after new data is pulled
addDiffToLog(originalObject, newObject, diffFilepath)