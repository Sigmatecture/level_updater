let fs = require('fs');

let BattlePokedex = require('./data/BattlePokedex.js');
let FormatsGen8 = require('./data/FormatsData_Gen8.js');
let FormatsGen7 = require('./data/FormatsData_Gen7.js');

/* Calculate levels of current random battles pokemon. 
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

  randDex = []
  // Iterate through Gen 8 species with random battle sets.
  for (const species in FormatsGen8)  {

    name = species;
    data = FormatsGen8[species];
    let tier  = null;
    let level = -1;

    if (data.randomBattleMoves == undefined) {
      continue;
    } else {
      console.log(species);
      // Gmax formes default to their base species' level, for now
      if (species.slice(species.length-4) === "gmax") {
        name = species.substring(0, species.length - 4);
      }

      if (data.tier !== "Illegal" && data.tier !== undefined) {
        tier = data.tier.toLowerCase();
      } else {
        tier = FormatsGen7[name].tier.toLowerCase();
      }

      if (customScale[species] !== undefined) {
        level = customScale[species];
      } else {
        level = levelScale[tier];
      }
      
    } 
    randDex.push({species: name, tier: tier, level: level });

  };

  result = JSON.stringify(randDex);
  randDex = JSON.parse(result);

  return randDex;

};


randDex = calcLevels();
console.log(JSON.stringify(randDex,undefined,4));
fs.writeFileSync("./data/RandomBattleLevels.json", JSON.stringify(randDex,undefined,4));


