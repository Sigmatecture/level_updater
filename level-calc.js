let fs = require('fs');
const stringify = require("@aitodotai/json-stringify-pretty-compact");

let FormatsGen8 = require('./data/FormatsData_Gen8_old.js');
let FormatsGen7 = require('./data/FormatsData_Gen7_old.js');

/*  Calculate levels of Random Battles Pokemon, 
    using the old tiering system.
*/
function calcLevels() {

  const levelScale = {
    uber: 72, ou: 80, uu: 82, ru: 84, 
    nu: 86, pu: 88, 
  };

  const customScale = {
    glalie: 72, 'darmanitangalarzen': 80, wobbuffet: 80, zygarde: 80,
    delibird: 100, shedinja: 100, // add DLC pokemon here
  };

  randDex = {}
  // Iterate through Gen 8 species with random battle sets.
  for (const species in FormatsGen8)  {
    console.log(species);
    let name = species;
    let data = FormatsGen8[species];
    let tier  = data.tier;
    let level = undefined;

    if (customScale[species] !== undefined) {
      level = customScale[species];
    } else if (data.randomBattleMoves == undefined) {
      randDex[species] = data;
      continue;
    } else {
      if (species.slice(species.length-4) === "gmax") { // Gmax formes default to their base species' level
        name = species.substring(0, species.length - 4);
        tier = FormatsGen8[name].tier;
      } else if (species === "aegislashblade") {
        name = species.substring(0, species.length - 5);
      } else if (species === "wishiwashischool") {
        name = species.substring(0, species.length - 6);
      } else if (species === "cherrimsunshine") {
        name = species.substring(0, species.length - 8);
      } 

      if (tier == "Illegal") {
        tier = FormatsGen7[name].tier.toLowerCase();
        // console.log(name);
        // console.log(tier);
        switch (tier) {
          case 'uubl': case 'uu':
            tier = 'ou';
            break;
          case 'rubl': case 'ru':
            tier = 'uu';
            break;
          case 'nubl': case 'nu': case 'publ': case 'pu':
            tier = 'ru';
            break;
        }
      } else if (tier == undefined) {
        tier = FormatsGen7[name].tier;
      }

      tier = tier.toLowerCase().replace(/[{()}]/g, '').replace('bl', '')
      level = levelScale[tier];
    } 

    newData = {}
    if (data.randomBattleMoves !== undefined) {
      newData.randomBattleMoves = data.randomBattleMoves;
    }
    if (level !== undefined) {
      newData.randomBattleLevel = level;
    }
    if (data.randomDoubleBattleMoves !== undefined) {
      newData.randomDoubleBattleMoves = data.randomDoubleBattleMoves;
    }
    if (data.isNonstandard !== undefined) {
      newData.isNonstandard = data.isNonstandard;
    }
    if (data.tier !== undefined) {
      newData.tier = data.tier;
    }
    if (data.doublesTier !== undefined) {
      newData.doublesTier = data.doublesTier;
    }
    randDex[species] = newData;

  };

  randDex = JSON.stringify(randDex);
  randDex = JSON.parse(randDex);

  return randDex;

};



oldLevels = calcLevels();
oldLevels = JSON.stringify(oldLevels,undefined,4);
oldLevels = oldLevels.replace(/\s+(?=[^[\]]*\])/g, " ");   // replace newlines inside of brackets
oldLevels = oldLevels.replace(/"(\w+)"\s*:/g, '$1:');      // remove quotes from keys
oldLevels = oldLevels.replace(/"\n/g, '",\n');             // add commas to end of every quoted line
oldLevels = oldLevels.replace(/\]\n/g, '],\n');            // add commas to end of every bracket line
// oldLevels = oldLevels.replace(/[0-9]+(?=\n)/g, ',\n');            // add commas to end of every number line: darmanitangalarzen, keldeoresolute, wishiwashischool
oldLevels = oldLevels.replace(/\[\s"/g, '["');
oldLevels = oldLevels.replace(/"\s\]/g, '"]');
// oldLevels = oldLevels.replace(/}\n/g, '"]');


const declaration = "export const BattleFormatsData: {[k: string]: SpeciesFormatsData} = ";

fs.writeFileSync("./data/formats-data.ts", declaration + oldLevels + ";\n");


