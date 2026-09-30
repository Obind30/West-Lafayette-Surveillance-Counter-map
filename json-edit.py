import json
import sys

searchId = 0
def filterById(object):
    try:
        id = object["properties"]["osmId"]
        if id == searchId:
            return newJsonData
        else:
            return object
    except:
        return

fileChoice = input("flock/purdue: ").lower()
filePath = ""

if fileChoice == 'flock' or fileChoice == 'f':
    filePath = "src/location_data/GreaterLAF-Flock-Cameras.geojson"
    print(filePath)
elif fileChoice == 'purdue' or fileChoice == 'p':
    filePath="src/location_data/Purdue_Security_Purdue_Cameras.geojson"
    print(filePath)
else:
    sys.exit()

jsonFile = open(filePath, "r")

print(jsonFile)

jsonData = json.load(jsonFile)
jsonFile.close()
newJsonData = json.loads(input("Enter JSON block:\n"))
searchId = newJsonData["properties"]["osmId"]

jsonData["features"] = list(map(filterById, jsonData["features"]))

jsonFile = open(filePath, "w")
json.dump(jsonData, jsonFile, sort_keys=True, indent=4)
jsonFile.close()