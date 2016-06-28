<p align="center">
  <img src="http://carewheels.org/images/CareWheelsLogoName-FractalMandala-Trans-100x100.png" alt="CareWheels Logo"/>
</p>

#**Capstone Project - Portland State University**

insert project objective here...

___

####Table of Contents
- [Installation Instructions](#Installation)
    - Linux & Mac
    - Windows
- [Build and Run](#Build)
    - Android
- [About](#about)

___


###Installation

#####Linux & Mac
1.  Download and install node.js and npm [here](https://nodejs.org/en/download/). Node and npm is used to install
    the dependencies that ionic requires. Now make sure that the following is installed properly by running this 
    command in your terminal 
    ``` 
    $ node -v && npm -v
    ```
    This shows a correct output (different version numbers are okay):
    ```
    v4.4.4
    3.8.9
    ```

2.  Install the Java Development Kit (JDK) 
    Ionic and Cordova requires JDK 7.0 or later, first check to see what version you currently have (if any).
    ```
    $ java -version
    ```
      
    If this outputs anything less than 1.7.0... then you need to update your JDK, which can be found 
    [here](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html). 
       
3.  Install the Android SDK
    Install the [Android stand-alone SDK](http://developer.android.com/sdk/installing/index.html?pkg=tools). In
    order for these command line tools to work you need to include the sdk `tools` and `platform-tools` directories
    to your `PATH`. Add this line to your `~/.bashrc` (on Mac this file is called `~/.bash_profile`).  
    ```
    export PATH=${PATH}:path/to/android-sdk/platform-tools:path/to/andoid-sdk/tools
    ```
      
    make sure to swap out the path for your actual path to the android-sdk dev tools. Now reload the terminal
    window to make these paths available, or run the the following command for the same effect. 
    ```
    $ source ~/.bashrc
    ```
       
4.  Install Cordova and Ionic  
    ```
    $ npm install -g cordova ionic
    ```
       
5.  Now we are finally ready to clone the repository to your local machine. Change your directory to where you 
    wish to have the project located at, then run the following command. 
    ```
    $ git clone https://github.com/CareWheels/Capstone.git
    ```
    
#####Windows
1.  Download and install node.js and npm [here](https://nodejs.org/en/download/)

---

####Build And Run The Project With Ionic
#####Android Build
If everything is setup properly then creating an apk with ionic is very easy. Simple just run this command
```
$ ionic build android
```
This will build the project and create an apk file called `android-demo.apk` file in
`/platforms/android/build/outputs/apk`.

#####Emulate Android (optional Step)
This step can be avoided by copying the apk onto your mobile android device. Just use any android file explorer app,
navigate to the apk location and use the app to install the app. Ionic provides support to run an Android Virtual 
Devices(AVD) directly from the command line, however I would suggest using genymotion instead (especially if 
running on linux). Below is instructions for both options.

######GenyMotion Setup
In order to download genymotion, you need to create a free account with them 
[here](https://www.genymotion.com/account/create/). Once logged in you can then download their android emulator 
[here](https://www.genymotion.com/download/). After you installed genymotion, launch the program, and create an
android emulation device. Start the emulator and enter this into the console to run the app. 
```
$ ionic run android
```

######AVD Setup
Android does not provide any default emulator, so we will need to create one. In the terminal run the command  
```
$ android
```
This will open up a new window, click `tools` then click `Manage AVD's`. Now you can create a mobile device

