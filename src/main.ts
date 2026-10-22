import { bootstrapApplication } from '@angular/platform-browser';

import { Language } from './app/core/language';
import { LegacyHashUrl } from './app/core/legacy-hash-url';

// keep links and bookmarks from the hash URL days working
LegacyHashUrl.redirect();

// the app texts and the data files are translated when they load, so load the app after the selected language
Language.load()
	.then(() => Promise.all([import('./app/app.component'), import('./app/app.config')]))
	.then(([{ AppComponent }, { appConfig }]) => bootstrapApplication(AppComponent, appConfig))
	.catch((err) => console.error(err));
