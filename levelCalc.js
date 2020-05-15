let fs = require('fs');

let BattlePokedex = require('./data/BattlePokedex.js');
let FormatsGen8 = require('./data/FormatsData_Gen8_old.js');
let FormatsGen7 = require('./data/FormatsData_Gen7_old.js');

/*  Calculate levels of Random Battles Pokemon, 
    using the old tiering system.
*/
function calcLevels() {

  const levelScale = {
    uber: 72, ou: 80, uu: 82, uubl: 82, ru: 84, rubl: 84, 
    nu: 86, nubl: 86, pu: 88, publ: 88,
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
    let tier  = null;
    let level = -1;
    // let gmax = false;

    if (customScale[species] !== undefined) {
      level = customScale[species];
    } else if (data.randomBattleMoves == undefined) {
      continue;
    } else {
      // Gmax formes default to their base species' level, for now
      if (species.slice(species.length-4) === "gmax") {
        // gmax == true;
        name = species.substring(0, species.length - 4);
      } else if (species === "aegislashblade") {
        name = species.substring(0, species.length - 5);
      } else if (species === "wishiwashischool") {
        name = species.substring(0, species.length - 6);
      } else if (species === "cherrimsunshine") {
        name = species.substring(0, species.length - 8);
      }

      if (data.tier !== "Illegal" && data.tier !== undefined) {
        tier = FormatsGen8[name].tier;
      } else {
        tier = FormatsGen7[name].tier;
      }

      tier = tier.toLowerCase().replace(/[{()}]/g, '')
      level = levelScale[tier];
    } 

    data.randomBattleLevel = level;
    randDex[species] = data;

  };

  randDex = JSON.stringify(randDex);
  randDex = JSON.parse(randDex);

  return randDex;

};

function CleanJSONQuotesOnKeys(stringJSON) {
    return stringJSON.replace(/"(\w+)"\s*:/g, '$1:');
}


oldLevels = calcLevels();
// oldLevels = CleanJSONQuotesOnKeys(JSON.stringify(randDex,undefined,4));
// oldLevels = JSON.parse(oldLevels);
console.log(oldLevels);

const declaration = "export const BattleFormatsData: {[k: string]: SpeciesFormatsData} = ";
oldLevels = CleanJSONQuotesOnKeys(JSON.stringify(oldLevels,undefined,4));

fs.writeFileSync("./data/FormatsData_Gen8.ts", declaration + oldLevels);


