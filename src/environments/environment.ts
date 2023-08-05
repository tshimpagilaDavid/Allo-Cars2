// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBFwYA5g52Ctj4cb_aWEFuIA6Aq4bY3E3s",
    authDomain: "allocars-unlimited-futur.firebaseapp.com",
    databaseURL: "https://allocars-unlimited-futur-default-rtdb.firebaseio.com",
    projectId: "allocars-unlimited-futur",
    storageBucket: "allocars-unlimited-futur.appspot.com",
    messagingSenderId: "890770570962",
    appId: "1:890770570962:web:e82bc72c6564c075ccf70b",
    measurementId: "G-QFYGXJ6G69"

  },
  CountryJson: [
    { name: 'Algeria', dial_code: '+213', code: 'DZ' },
    { name: 'Angola', dial_code: '+244', code: 'AO' },
    { name: 'Gabon', dial_code: '+241', code:'GA' },
    { name: 'Cameroun', dial_code: '+237', code:'CM' },
    { name: 'République Démocratique du Congo', dial_code: '+243', code: 'CD'}
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
