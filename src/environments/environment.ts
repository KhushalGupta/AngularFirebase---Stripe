// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyCti95GaoCtlQg_MdSyzG62L1P_i2qcRck',
    authDomain: 'funnelfastpass.firebaseapp.com',
    databaseURL: 'https://funnelfastpass.firebaseio.com',
    storageBucket: 'funnelfastpass.appspot.com'
  },

  stripeKey: 'pk_test_mDm0a0SysTBr6JHQe93zDRta'
};
