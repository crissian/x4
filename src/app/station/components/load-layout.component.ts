import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { LucideDownload, LucideFolderOpen, LucideListPlus, LucideTrash, LucideUpload } from '@lucide/angular';
import { ConfirmComponent, ConfirmData } from '../../shared/components/confirm.component';
import { openDialog } from '../../shared/components/modal/dialog';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { compareNames } from '../services/construction-plans';
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
	imports: [ModalComponent, LucideDownload, LucideFolderOpen, LucideListPlus, LucideTrash, LucideUpload],
	templateUrl: './load-layout.component.html',
})
export class LoadLayoutComponent {
	protected readonly dialogRef = inject<DialogRef<LoadLayoutResult>>(DialogRef);
	private readonly dialog = inject(Dialog);
	private readonly layoutService = inject(LayoutService);
	private readonly moduleService = inject(ModuleService);

	protected readonly LoadLayoutType = LoadLayoutType;
	readonly entities = signal<LayoutData[]>(this.readLayouts());
	/** result of the last layouts import */
	readonly importMessage = signal<{ error: boolean; text: string } | null>(null);

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

	/** Downloads all saved layouts as a JSON file to back them up or move them to another browser. */
	exportLayouts() {
		const blob = new Blob([this.layoutService.exportLayouts()], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `x4-station-layouts-${new Date().toISOString().slice(0, 10)}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}

	async importLayouts(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) {
			return;
		}

		try {
			const count = this.layoutService.importLayouts(await file.text());
			this.entities.set(this.readLayouts());
			this.importMessage.set({ error: false, text: `Imported ${count} layout(s) from ${file.name}.` });
		} catch {
			this.importMessage.set({ error: true, text: `${file.name} is not an exported layouts file.` });
		}
	}

	private readLayouts() {
		return this.layoutService
			.getLayouts()
			.map<LayoutData>((x) => ({
				name: x.name,
				modules: x.config.flatMap<LayoutModule>((y) => {
					const module = y.moduleId ? this.moduleService.getEntity(y.moduleId) : undefined;
					return module ? [{ count: y.count, module }] : [];
				}),
			}))
			.sort((a, b) => compareNames(a.name, b.name));
	}
}
