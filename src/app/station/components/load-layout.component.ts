import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import { LucideDownload, LucideFolderOpen, LucideListPlus, LucideTrash, LucideUpload } from '@lucide/angular';
import { ConfirmComponent, ConfirmData } from '../../shared/components/confirm.component';
import { AppDialog } from '../../shared/components/modal/dialog';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { ConstructionPlans } from '../services/construction-plans';
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
	private readonly deleteMessage = viewChild.required<TemplateRef<{ $implicit: string }>>('deleteMessage');
	private readonly deleteSelectedMessage =
		viewChild.required<TemplateRef<{ $implicit: number }>>('deleteSelectedMessage');

	protected readonly LoadLayoutType = LoadLayoutType;
	readonly entities = signal<LayoutData[]>(this.readLayouts());
	/** result of the last layouts import */
	readonly importMessage = signal<{ error: boolean; text: string } | null>(null);
	/** names of the layouts checked for a batch delete */
	readonly selected = signal<ReadonlySet<string>>(new Set());
	readonly allSelected = computed(
		() => this.entities().length > 0 && this.selected().size === this.entities().length
	);

	/** some, but not all, of the layouts are checked: the select all checkbox shows as partially selected */
	readonly someSelected = computed(() => this.selected().size > 0 && !this.allSelected());

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

	toggleSelected(item: LayoutData, event: Event) {
		event.stopPropagation();
		this.selected.update((x) => {
			const next = new Set(x);
			if (!next.delete(item.name)) {
				next.add(item.name);
			}
			return next;
		});
	}

	toggleAll() {
		this.selected.set(this.allSelected() ? new Set() : new Set(this.entities().map((x) => x.name)));
	}

	deleteSelected() {
		const names = [...this.selected()];
		if (names.length === 0) {
			return;
		}

		AppDialog.open<boolean, ConfirmData<{ $implicit: number }>>(this.dialog, ConfirmComponent, {
			data: {
				title: $localize`Confirm Delete`,
				message: this.deleteSelectedMessage(),
				context: { $implicit: names.length },
			},
		}).closed.subscribe((res) => {
			if (res) {
				this.layoutService.deleteLayouts(names);
				this.refresh();
			}
		});
	}

	deleteLayout(item: LayoutData, event: Event) {
		event.stopPropagation();

		AppDialog.open<boolean, ConfirmData<{ $implicit: string }>>(this.dialog, ConfirmComponent, {
			data: {
				title: $localize`Confirm Delete`,
				message: this.deleteMessage(),
				context: { $implicit: item.name },
			},
		}).closed.subscribe((res) => {
			if (res) {
				this.layoutService.deleteLayout(item.name);
				this.refresh();
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
			this.refresh();
			this.importMessage.set({ error: false, text: $localize`Imported ${count}:count: layout(s) from ${file.name}:fileName:.` });
		} catch {
			this.importMessage.set({ error: true, text: $localize`${file.name}:fileName: is not an exported layouts file.` });
		}
	}

	/** Reloads the layouts and drops the selected names that no longer exist. */
	private refresh() {
		this.entities.set(this.readLayouts());
		const names = new Set(this.entities().map((x) => x.name));
		this.selected.update((x) => new Set([...x].filter((name) => names.has(name))));
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
			.sort((a, b) => ConstructionPlans.compareNames(a.name, b.name));
	}
}
