import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// TODO https://itnext.io/choosing-the-right-file-structure-for-angular-in-2020-and-beyond-a53a71f7eb05
// TODO https://github.com/mathisGarberg/angular-ngxs-and-material-starter
// TODO https://github.com/tomastrajan/angular-ngrx-material-starter
// TODO https://javascript.plainenglish.io/setup-dotenv-to-access-environment-variables-in-angular-9-f06c6ffb86c0
// TODO https://developers.google.com/oauthplayground/ (scope: https://www.googleapis.com/auth/firebase.messaging)
// TODO ng build --namedChunks=true --outputHashing=none --vendorChunk=true --stats-json
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
