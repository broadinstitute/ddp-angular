import { PicklistOptionDef } from '../model/picklistOptionDef';

console.log('hi there');
for (let i = 0; i <= 30; i++) {
  const startAge = i * 5;
  const endAge = startAge + 4;
  const rangeString = `${startAge}-${endAge}`;
  const option: PicklistOptionDef = {
    "stableId": rangeString,
    "optionLabelTemplate": {
      "templateType": "TEXT",
      "templateText": rangeString,
      "variables": [
      ]
    },
    "detailLabelTemplate": null,
    "allowDetails": false,
    "exclusive": false
  };
  console.log(JSON.stringify(option)+",");
}
