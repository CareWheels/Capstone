# Boot Launcher

Launch your Apache Cordova Android app automatically when the device is booted.

## Install

1. Fork this repository

2. In `src/android/BootLauncher.java` line 13, replace `com.ionicframework.starter.StarterApp.class` with `[YOUR_APP_ID].CordovaApp.class`. YOUR_APP_ID is the reverse domain-style identifier you used when you created your cordova project.

3. Add your forked plugin via the CLI:
```
cordova plugin add https://github.com/jimibi/cordova-plugin-boot-launcher.git
```

4. Remove your plugin via the CLI:
```
cordova plugin rm fr.edps.cordova.bootlauncher
```

## Platforms

Android only.

## License

[MIT License](http://ilee.mit-license.org)
