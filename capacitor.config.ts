import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sempreceub.medly',
  appName: 'Med.ly',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'accounts.google.com',
      '*.google.com',
      '*.supabase.co',
      '*.supabase.com'
    ]
  },
  android: {
    allowMixedContent: true
  }
};

export default config;