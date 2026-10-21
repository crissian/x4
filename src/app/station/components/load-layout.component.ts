import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { LucideFolderOpen, LucideListPlus, LucideTrash } from '@lucide/angular';
import { ConfirmComponent, ConfirmData } from '../../shared/components/confirm.component';
import { openDialog } from '../../shared/components/modal/dialog';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { LayoutService } from '../services/layout-service';

interface LayoutModule {
	count: number;
	module: StationModule;
}

interface LayoutData {
	name: string;
	modules: LayoutModule[];
}

export enum LoadLayoutType {
	load,
	add,
}

export interface LoadLayoutResult {
	layoutName: string;
	type: LoadLayoutType;
}

@Component({
	imports: [ModalComponent, LucideFolderOpen, LucideListPlus, LucideTrash],
	templateUrl: './load-layout.component.html',
})
export class LoadLayoutComponent {
	protected readonly dialogRef = inject<DialogRef<LoadLayoutResult>>(DialogRef);
	private readonly dialog = inject(Dialog);
	private readonly layoutService = inject(LayoutService);
	private readonly moduleService = inject(ModuleService);

	protected readonly LoadLayoutType = LoadLayoutType;
	readonly entities = signal<LayoutData[]>(this.readLayouts());

	getModules(item: LayoutData) {
		const modules = item.modules.slice(0, 3);
		return (
			modules.map((x) => x.count + ' x ' + (x.module == null ? '' : x.module.name)).join(', ') +
			(item.modules.length > 3 ? '...' : '')
		);
	}

	close(item: LayoutData, type: LoadLayoutType, event?: Event) {
		event?.stopPropagation();
		this.dialogRef.close({ layoutName: item.name, type });
	}

	deleteLayout(item: LayoutData, event: Event) {
		event.stopPropagation();

		openDialog<boolean, ConfirmData>(this.dialog, ConfirmComponent, {
			data: {
				title: 'Confirm Delete',
				message: `Are you sure you want to delete <strong>${item.name}</strong>?`,
			},
		}).closed.subscribe((res) => {
			if (res) {
				this.layoutService.deleteLayout(item.name);
				this.entities.set(this.readLayouts());
			}
		});
	}

	private readLayouts() {
		return this.layoutService.getLayouts().map<LayoutData>((x) => ({
			name: x.name,
			modules: x.config.map<LayoutModule>((y) => ({
				count: y.count,
				module: this.moduleService.getEntity(y.moduleId),
			})),
		}));
	}
}
