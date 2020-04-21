# level_updater
This is a simple prototype level data updater script for Gen 8 Random Battles. When input a dictionary of current Pokemon levels, and a dictionary of each Pokemon species and its level change, `level-updater.js` outputs a dictionary of updated levels.

## Using the script
1. Have a CSV file of this month's level changes. There are only two columns, 'Species' for the Pokemon and 'Change' to denote the level change. Formatted CSVs can easily be saved from an Excel file. A sample CSV is provided in `levelChanges.csv'.
| Species | Change |
| ------ | --- |
| Bellossom | -2 |
| Centiskorch | +1 |
| Hatterene | +2 |
| Ninjask | 0 |
2. Have a JavaScript Object / JSON file of current random battles levels, an example is provided in `dex.js`.
3. To run a demonstration of the script, clone this respository to your local computer. Then simply run `node level-updater.js` from your command line or terminal. You can install Node [here](https://nodejs.org/en/download/package-manager/#macos).

When running the script, the output shows (1.) the level updates in JSON format converted from the CSV, and (2.) the updated levels, also in JSON. Once updated, this JSON file can be used as input for the [team generator script](https://github.com/smogon/pokemon-showdown/blob/125fe31d06ad098a3681631999db5fe6dbcd9f4e/data/random-teams.js). 
Depending on how TI implements individual levels, e.g. by placing levels data into the main [pokedex file](https://github.com/smogon/pokemon-showdown/blob/125fe31d06ad098a3681631999db5fe6dbcd9f4e/data/pokedex.js), my script can just interface with existing files. The function can be added to random-teams.js, and the output would be put into the Pokedex. 
