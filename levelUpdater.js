var dex   = require('./data/dex.js');
var fs    = require('fs');

/* Utility function to read level change statistics into JSON.
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

};

/* Update levels of species. Wraps formatUpdates().
  @input  csv       Path of csv file containing level updates. 
          dexLevels JSON object of every species and its current level
          reverse   Makes each level change the opposite sign (for reversing a previous change).
  @return levels    Updated levels as a JavaScript object.
*/
function updateLevels(csv, dex, reverse = false) {

  let sign = (reverse ? -1 : 1);
  // Call JSON parser on manually-updated CSV file
  changes = formatUpdates(csv);
  changes.forEach( function(entry) {
    dex[entry.species].level += entry.change * sign
  });

  return dex;

};


/* Test execution */
updates = formatUpdates('./stats/levelChanges.csv');
console.log("Changes to levels:\n" + JSON.stringify(updates, undefined, 1));

// The main function call
console.log("Initial levels: ");
console.log(dex);
updated = updateLevels('./stats/levelChanges.csv', dex);
console.log("Updated levels: ");
console.log(updated);

