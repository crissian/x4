import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { redirectLegacyHashUrl } from './app/core/legacy-hash-url';

// keep links and bookmarks from the hash URL days working
redirectLegacyHashUrl();

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
