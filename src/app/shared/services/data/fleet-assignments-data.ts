import { GameText } from '../../../core/game-text';
/* tslint:disable:max-line-length */
const entities = {
  assist: {"id":"assist","name":"Mimic"},
  attack: {"id":"attack","name":"Attack"},
  bombardment: {"id":"bombardment","name":"Bombardment"},
  build: {"id":"build","name":"Builder"},
  defence: {"id":"defence","name":"Defence"},
  follow: {"id":"follow","name":"Follow"},
  interception: {"id":"interception","name":"Interception"},
  mining: {"id":"mining","name":"Miner"},
  police: {"id":"police","name":"Police"},
  positiondefence: {"id":"positiondefence","name":"Position Defence"},
  prospect: {"id":"prospect","name":"Prospector"},
  salvage: {"id":"salvage","name":"Salvage"},
  supplyfleet: {"id":"supplyfleet","name":"Supply Fleet"},
  trade: {"id":"trade","name":"Trader"},
  tradeforbuildstorage: {"id":"tradeforbuildstorage","name":"Trade for Build Storage"},
  watchdog: {"id":"watchdog","name":"Watchdog"},
};

export const FleetAssignments = {
  ...entities,
  all: [
    entities.assist,
    entities.attack,
    entities.bombardment,
    entities.build,
    entities.defence,
    entities.follow,
    entities.interception,
    entities.mining,
    entities.police,
    entities.positiondefence,
    entities.prospect,
    entities.salvage,
    entities.supplyfleet,
    entities.trade,
    entities.tradeforbuildstorage,
    entities.watchdog,
  ]
};

await GameText.translate(FleetAssignments, 'fleet-assignments');
