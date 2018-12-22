import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../../shared/components/component-base';
import { Ware } from '../../shared/services/model/model';
import * as Vis from 'vis';
import { WareService } from '../../shared/services/ware.service';
import { Wares } from '../../shared/services/data/wares-data';

@Component({
  selector: 'app-tech-chart',
  templateUrl: './tech-chart.component.html'
})
export class TechChartComponent extends ComponentBase implements OnInit {
  private network: Vis.Network;
  private wares: Ware[];

  constructor(private wareService: WareService) {
    super();
  }

  private removeWare(ware: Ware) {
    const index = this.wares.indexOf(ware);
    this.wares.splice(index, 1);
  }

  ngOnInit(): void {
    this.wares = this.wareService.getEntities();
    this.removeWare(Wares.energycells);
    this.removeWare(Wares.nividium);

    if (this.network != null) {
      this.network.destroy();
    }

    const container = document.getElementById('network');
    if (container == null) {
      return;
    }

    const nodes = this.wares.map(x => {
      return {
        id: x.id,
        label: x.name,
        shape: 'box',
      };
    });

    const edgesObj = this.wares
      .reduce((obj, x: Ware) => {
        if (x.production) {
          x.production.forEach(p => {
            p.wares.forEach(w => {
              obj[`${w.ware}-${x.id}`] = { from: w.ware, to: x.id, arrows: 'to' };
            });
          });
        }
        return obj;
      }, {});

    const edges = Object.keys(edgesObj)
      .map(x => edgesObj[x]);

    const options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'LR',
          sortMethod: 'directed',
          treeSpacing: 200
        }
      },
      physics: {
        enabled: false
      },
      interaction: {
        hover: true
      },
      manipulation: true
    };

    const data = {
      nodes: nodes,
      edges: edges,
    };

    this.network = new Vis.Network(container, data, options);
    this.network.fit({ animation: false });
  }
}
