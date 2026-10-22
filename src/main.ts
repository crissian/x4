import { bootstrapApplication } from '@angular/platform-browser';

import { loadLanguage } from './app/core/language';
import { redirectLegacyHashUrl } from './app/core/legacy-hash-url';

// keep links and bookmarks from the hash URL days working
redirectLegacyHashUrl();

// the app texts and the data files are translated when they load, so load the app after the selected language
loadLanguage()
	.then(() => Promise.all([import('./app/app.component'), import('./app/app.config')]))
	.then(([{ AppComponent }, { appConfig }]) => bootstrapApplication(AppComponent, appConfig))
	.catch((err) => console.error(err));
