var dex   = require('./dex.js');
var fs    = require('fs');
var tiers = require('./tiers.js');


function calcLevels(battleDex = dex) {

  result = {}

  const levelScale = {
    uber: 72, ou: 80, uu: 82, ru: 84, nu: 86, pu: 88,
  };

  // iterate through our BattlePokedex and store levels
  for (const species in battleDex)  {
    
    let name = battleDex[species].name.toLowerCase();
    // Gmax formes default to their base species' level, for now
    if (name.slice(name.length-5) === "-gmax") {
      console.log(name);
      name = name.substring(0, name.length - 5);
      console.log(name);
    }
    let tier = tiers[name].tier.toLowerCase();
    let level = levelScale[tier];
    battleDex[species].tier = tier; 
    battleDex[species].level = level;
  };

  const customScale = {
    Glalie: 72, 'Darmanitan-Galar-Zen': 80, Wobbuffet: 80, Zygarde: 80,
    Delibird: 100, Shedinja: 100, // add DLC pokemon here

  };

  return battleDex;

}


/* Utility function to read stats into JSON.
  @input    csv       CSV file path of level changes for each species. 
                      Must contain two columns: 'Species' and 'Change'.
  @return   updates   JSON array of level change for each species.
                      Fields are 'species' and 'change'. 
*/
function formatUpdates(csv){

  // Can replace with readSync() wrapper from ../lib/fs.ts
  let input = fs.readFileSync(csv);
  // console.log("CSV level updates:\n______________\n" + input.toString() + "\n______________")
  let lines=input.toString().split(/\b\s+/); 
  let result = [];
  let cols=lines[0].split(",");

  for (let i=1; i<lines.length; i++) {
    let currLine=lines[i].split(",");
    result.push({
      species: currLine[0].toLowerCase(),
      change: parseInt(currLine[1])
    });
  }
  // Level changes formatted into JSON
  result = JSON.stringify(result);
  updates = JSON.parse(result);

  return updates;

}

/* Update levels of species. Wraps formatUpdates().
  @input  csv       Path of csv file containing level updates. 
          dexLevels JSON object of every species and its current level
          reverse   Makes each level change the opposite sign (for reversing a previous change).
  @return levels    Updated levels as a JavaScript object.
*/
function updateLevels(csv, battleDex=dex, reverse = false) {
  let sign = (reverse ? -1 : 1);
  // Call JSON parser on manually-updated CSV file
  changes = formatUpdates(csv);
  changes.forEach( function(entry) {
    battleDex[entry.species].level += entry.change * sign
  });

  return battleDex;

}

// updates = formatUpdates(('./levelChanges.csv'));
// console.log("Changes to levels:\n" + JSON.stringify(updates, undefined, 1));

// // The main function call
// console.log("Initial levels: ");
// console.log(dex);
// updated = updateLevels('./levelChanges.csv');
// console.log("Updated levels: ");
// console.log(updated);

levels = calcLevels();
console.log(levels);


