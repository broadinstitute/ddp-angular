"use strict";
exports.__esModule = true;
console.log('hi there');
for (var i = 0; i <= 30; i++) {
    var startAge = i * 5;
    var endAge = startAge + 4;
    var rangeString = startAge + "-" + endAge;
    var option = {
        "stableId": rangeString,
        "optionLabelTemplate": {
            "templateType": "TEXT",
            "templateText": rangeString,
            "variables": []
        },
        "detailLabelTemplate": null,
        "allowDetails": false,
        "exclusive": false
    };
    console.log(JSON.stringify(option) + ",");
}
