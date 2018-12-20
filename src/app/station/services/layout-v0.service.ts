import { LayoutVersionService } from './layout-version.service';
import { Layout } from '../../shared/services/module-config';
import { Modules } from '../../shared/services/data/modules-data';

export class LayoutV0Service implements LayoutVersionService {
  static map = {
    1: {moduleId: Modules.module_gen_prod_energycells_01.id },
    2: {moduleId: Modules.module_gen_prod_water_01.id },
    3: {moduleId: Modules.module_arg_prod_meat_01.id },
    4: {moduleId: Modules.module_par_prod_majasnails_01.id },
    5: {moduleId: Modules.module_gen_prod_spices_01.id },
    6: {moduleId: Modules.module_arg_prod_wheat_01.id },
    7: {moduleId: Modules.module_par_prod_sojabeans_01.id },
    8: {moduleId: Modules.module_tel_prod_sunriseflowers_01.id },
    9: {moduleId: Modules.module_tel_prod_swampplant_01.id },
    10: {moduleId: Modules.module_arg_prod_medicalsupplies_01.id },
    11: {moduleId: Modules.module_tel_prod_medicalsupplies_01.id },
    12: {moduleId: Modules.module_par_prod_medicalsupplies_01.id },
    13: {moduleId: Modules.module_arg_prod_foodrations_01.id },
    14: {moduleId: Modules.module_par_prod_sojahusk_01.id },
    15: {moduleId: Modules.module_tel_prod_nostropoil_01.id },
    16: {moduleId: Modules.module_arg_prod_spacefuel_01.id },
    17: {moduleId: Modules.module_tel_prod_spaceweed_01.id },
    18: {moduleId: Modules.module_par_prod_majadust_01.id },
    19: {moduleId: Modules.module_gen_prod_refinedmetals_01.id },
    20: {moduleId: Modules.module_gen_prod_siliconwafers_01.id },
    21: {moduleId: Modules.module_gen_prod_antimattercells_01.id },
    22: {moduleId: Modules.module_gen_prod_graphene_01.id },
    23: {moduleId: Modules.module_gen_prod_superfluidcoolant_01.id },
    24: {moduleId: Modules.module_gen_prod_microchips_01.id },
    25: {moduleId: Modules.module_gen_prod_scanningarrays_01.id },
    26: {moduleId: Modules.module_gen_prod_hullparts_01},
    27: {moduleId: Modules.module_gen_prod_advancedcomposites_01.id },
    28: {moduleId: Modules.module_gen_prod_engineparts_01.id },
    29: {moduleId: Modules.module_gen_prod_plasmaconductors_01.id },
    30: {moduleId: Modules.module_gen_prod_quantumtubes_01.id },
    31: {moduleId: Modules.module_gen_prod_advancedelectronics_01.id },
    32: {moduleId: Modules.module_gen_prod_antimatterconverters_01.id },
    33: {moduleId: Modules.module_gen_prod_claytronics_01.id },
    34: {moduleId: Modules.module_gen_prod_dronecomponents_01.id },
    35: {moduleId: Modules.module_gen_prod_missilecomponents_01.id },
    36: {moduleId: Modules.module_gen_prod_shieldcomponents_01.id },
    37: {moduleId: Modules.module_gen_prod_turretcomponents_01.id },
    38: {moduleId: Modules.module_gen_prod_weaponcomponents_01.id },
    39: {moduleId: Modules.module_gen_prod_smartchips_01.id },
    40: {moduleId: Modules.module_gen_prod_fieldcoils_01.id }
  };

  getLayouts(data: any): Layout[] {
    const layouts: Layout[] = data;
    return layouts
      .map<Layout>(x => {
        return {
          name: x.name,
          config: x.config.map(y => {
            const value = LayoutV0Service.map[y.moduleId];
            return {
              moduleId: value.moduleId,
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
