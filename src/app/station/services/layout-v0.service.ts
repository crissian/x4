import { LayoutVersionService } from './layout-version.service';
import { Layout } from '../../shared/services/module-config';
import { Wares } from '../../shared/services/data/wares-data';

export class LayoutV0Service implements LayoutVersionService {
  static map = {
    1: { wareId: Wares.energycells.id, productionId: 'default' },
    2: { wareId: Wares.water.id, productionId: 'default' },
    3: { wareId: Wares.meat.id, productionId: 'default' },
    4: { wareId: Wares.majasnails.id, productionId: 'default' },
    5: { wareId: Wares.spices.id, productionId: 'default' },
    6: { wareId: Wares.wheat.id, productionId: 'default' },
    7: { wareId: Wares.sojabeans.id, productionId: 'default' },
    8: { wareId: Wares.sunriseflowers.id, productionId: 'default' },
    9: { wareId: Wares.swampplant.id, productionId: 'default' },
    10: { wareId: Wares.medicalsupplies.id, productionId: 'default' },
    11: { wareId: Wares.medicalsupplies.id, productionId: 'teladi' },
    12: { wareId: Wares.medicalsupplies.id, productionId: 'paranid' },
    13: { wareId: Wares.foodrations.id, productionId: 'default' },
    14: { wareId: Wares.sojahusk.id, productionId: 'default' },
    15: { wareId: Wares.nostropoil.id, productionId: 'default' },
    16: { wareId: Wares.spacefuel.id, productionId: 'default' },
    17: { wareId: Wares.spaceweed.id, productionId: 'default' },
    18: { wareId: Wares.majadust.id, productionId: 'default' },
    19: { wareId: Wares.refinedmetals.id, productionId: 'default' },
    20: { wareId: Wares.siliconwafers.id, productionId: 'default' },
    21: { wareId: Wares.antimattercells.id, productionId: 'default' },
    22: { wareId: Wares.graphene.id, productionId: 'default' },
    23: { wareId: Wares.superfluidcoolant.id, productionId: 'default' },
    24: { wareId: Wares.microchips.id, productionId: 'default' },
    25: { wareId: Wares.scanningarrays.id, productionId: 'default' },
    26: { wareId: Wares.hullparts.id, productionId: 'default' },
    27: { wareId: Wares.advancedcomposites.id, productionId: 'default' },
    28: { wareId: Wares.engineparts.id, productionId: 'default' },
    29: { wareId: Wares.plasmaconductors.id, productionId: 'default' },
    30: { wareId: Wares.quantumtubes.id, productionId: 'default' },
    31: { wareId: Wares.advancedelectronics.id, productionId: 'default' },
    32: { wareId: Wares.antimatterconverters.id, productionId: 'default' },
    33: { wareId: Wares.claytronics.id, productionId: 'default' },
    34: { wareId: Wares.dronecomponents.id, productionId: 'default' },
    35: { wareId: Wares.missilecomponents.id, productionId: 'default' },
    36: { wareId: Wares.shieldcomponents.id, productionId: 'default' },
    37: { wareId: Wares.turretcomponents.id, productionId: 'default' },
    38: { wareId: Wares.weaponcomponents.id, productionId: 'default' },
    39: { wareId: Wares.smartchips.id, productionId: 'default' },
    40: { wareId: Wares.fieldcoils.id, productionId: 'default' }
  };

  getLayouts(data: any): Layout[] {
    const layouts: Layout[] = data;
    return layouts.map<Layout>(x => {
      return {
        name: x.name,
        config: x.config.map(y => {
          const value = LayoutV0Service.map[y.moduleId];
          return {
            moduleId: value.wareId,
            production: value.production,
            count: y.count
          };
        })
      };
    });
  }

  getSaveData(layouts: Layout[]) {
    return null;
  }
}
