import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WareGroupModel} from 'src/app/station/components/station-calculator.model';
import {StationModule} from '../../services/model/model';

/**
 * The Autocomplete component
 */
@Component({
   selector: 'app-autocomplete',
   templateUrl: './autocomplete.component.html',
   styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {
   /**
    * id
    */
   @Input() id: string = null;
   /**
    * groups
    */
   @Input() groups: WareGroupModel[] = [];
   /**
    * filtered groups
    */
   filteredGroups: WareGroupModel[] = [];
   /**
    * output event change
    */
   @Output() selectModule: EventEmitter<string> = new EventEmitter<string>();

   /**
    * input string
    */
   inputString = '';
   /**
    * visible
    */
   visible = false;
   /**
    * Timeout function reference
    */
   private timeout: any;

   /**
    * The constructor
    */
   constructor() {
   }

   /**
    * onInit
    */
   ngOnInit() {
      this.filteredGroups = this.groups.map((x) => Object.assign({}, x));
      this.setName();
   }

   /**
    * filter modules
    *
    * @param filterString filter string
    */
   filterModules(filterString: string) {
      for (let i = 0; i < this.groups.length; i++) {
         this.filteredGroups[i].modules = [
            ...this.groups[i].modules.filter((module) =>
               module.name.trim().toLowerCase().includes(filterString.trim().toLowerCase())
            ),
         ];
      }
   }

   /**
    * input change
    *
    * @param text new string
    */
   changed(text: string) {
      if (text) {
         this.filterModules(text);
      } else {
         this.filteredGroups = this.groups.map((x) => Object.assign({}, x));
      }
   }

   /**
    * on focus
    */
   onFocus() {
      clearTimeout(this.timeout);
      this.filterModules(this.inputString);
      this.visible = true;
   }

   /**
    * on blur
    */
   onBlur() {
      this.timeout = setTimeout(() => {
         this.setName();
         this.visible = false;
      }, 100);
   }

   /**
    * on module click
    *
    * @param module The station module
    */
   onClick(module: StationModule) {
      this.inputString = module.name;
      this.filterModules(this.inputString);
      this.selectModule.emit(module.id);
      this.visible = false;
   }

   /**
    * set name from id
    */
   setName() {
      if (this.id) {
         this.groups.forEach((group) => {
            const module = group.modules.filter((m) => m.id === this.id)[0];
            if (module) {
               this.inputString = module.name;
            }
         });
      }
   }
}
