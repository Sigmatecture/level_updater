# level_updater
This is a simple level updater script for Gen 8 Random Battles. When input a dictionary of current Pokemon levels, and a dictionary of each Pokemon species and its level change, `level-updater.js` outputs a dictionary of updated levels.

## Using the script
1. Have a CSV file of this month's level changes. There are only two columns, 'Species' for the Pokemon and 'Change' to denote the level change. Formatted CSVs can easily be saved from an Excel file. A sample CSV is provided in `levelChanges.csv'.

| Species | Change |
| ------- | --- |
| Bellossom | -2 |
| Centiskorch | +1 |
| Hatterene | +2 |
| Ninjask | 0 |

2. Have a JavaScript Object / JSON file of current random battles levels, an example is provided in `dex.js`.
3. To run a demonstration of the script, clone this respository to your local computer. Then simply run `node level-updater.js` from your command line or terminal. You can install Node [here](https://nodejs.org/en/download/package-manager/#macos).

When running the script, the output shows 
- the level updates in JSON format converted from the CSV
- the current, non-updated levels.
- the updated levels, in the same format as above. 

Depending on how TI implements individual levels, e.g. by placing levels data into the main [pokedex file](https://github.com/smogon/pokemon-showdown/blob/125fe31d06ad098a3681631999db5fe6dbcd9f4e/data/pokedex.js), my script can just interface with existing files. The function can be added to random-teams.js, and the output would be put into the Pokedex. I'll update the script to match how Irpachuza and TI are formatting their stats and levels data, respectively.

## Changes to Existing Files
The files changed in the Pokemon Showdown github are
1. dex-data.ts
	The SpeciesFormatsData class now has an additional optional field (line 675), `readonly randomBattleLevel?: number;`, to represent individual levels.
2. FormatsData_Gen8.ts, FormatsData_Gen7.ts
	Each instance of SpeciesFormatsData has a populated randomBattleLevel field, using the current tiering-based level system (with the same custom levels for Delibird, darmanitangalarzen, etc.).
3. random-teams.ts
	The old singles level tiering-based system (at line 1670) is simply replaced with reading the current levels from FormatsData_Gen8.ts and FormatsData_Gen7.ts.

## tl;dr
Given a CSV of level changes, you can call this script anytime (monthly, weekly, when you feel like) to automatically update the Pokedex levels all at once. 
