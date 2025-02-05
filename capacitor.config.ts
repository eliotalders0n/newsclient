import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eati.web.app',
  appName: 'eati',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "GoogleAuth": {
      "scopes": [
        "profile",
        "email"
      ],
      "serverClientId": "141780524287-h5683vclg63h0e6ndma1947vuvsod3tp.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  }
};

export default config;