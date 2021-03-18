export enum ModuleTypes {
   connectionmodule = 'Connection Module',
   production = 'Production',
   defencemodule = 'Defense Module',
   dockarea = 'Dock Area',
   habitation = 'Habitation',
   pier = 'Pier',
   storage = 'Storage',
   buildmodule = 'Build Module',
   ventureplatform = 'Venture Platform'
}

export const AllModuleTypes = [
   ModuleTypes.habitation,
   ModuleTypes.buildmodule,
   ModuleTypes.dockarea,
   ModuleTypes.pier,
   ModuleTypes.storage,
   ModuleTypes.defencemodule,
   ModuleTypes.connectionmodule
   // ModuleTypes.ventureplatform
];
