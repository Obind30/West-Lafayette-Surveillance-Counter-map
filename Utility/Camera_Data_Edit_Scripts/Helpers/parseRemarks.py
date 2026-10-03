def parse_remarks(data):
    for object in data["features"]:
        if (object["properties"]["REMARKS"]):
            remark = object["properties"]["REMARKS"]
            index = remark.find("-")
            if (index != -1):
                object["properties"]["surveillanceZone"] = remark[index+2:]
            else:
                if remark == "Emergency":
                    object["properties"]["surveillanceZone"] = "Emergency"

    return data