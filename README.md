<p align="center">
  <img src="http://carewheels.org/images/CareWheelsLogoName-FractalMandala-Trans-100x100.png" alt="CareWheels Logo"/>
</p>

#**Capstone Project - Portland State University**

###insert project objective here...

___

##Table of Contents
- [Installation Instructions](#Installation)
    - Linux & Mac
    - Windows
- [Build the Project](#Build)
    - Android
- [Emulate on Computer](#Emulate) (optional step)
- [Documentation](#doc) 
- [About](#about)

___

<br><br><br>

##Installation

###Linux & Mac
1. Download and install node.js and npm [here](https://nodejs.org/en/download/). Node and npm is used to install
the dependencies that ionic requires.
<br><br>
Now make sure that the following is installed properly by running this command in your terminal 
<br>
``` 
$ node -v && npm -v
```
<br><br>
This should output similar to (different version numbers are okay):
<br>
```
v4.4.4
3.8.9
```
<br><br><br>

2. Install the Java Development Kit (JDK)<br>
Ionic and Cordova requires JDK 7.0 or later, first check to see what version you currently have (if any).
<br>
```
$ java -version
```
<br><br>
If this outputs anything less than 1.7.0... then you need to update your JDK, which can be found 
[here](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html). 
<br><br><br>

3. Install the Android SDK <br>
Install the [Android stand-alone SDK](http://developer.android.com/sdk/installing/index.html?pkg=tools). In
order for these command line tools to work you need to include the sdk `tools` and `platform-tools` directories
to your `PATH`. Add this line to your `~/.bashrc` (on Mac this file is called `~/.bash_profile`).<br><br>
```
export PATH=${PATH}:path/to/android-sdk/platform-tools:path/to/andoid-sdk/tools
```
<br><br>
make sure to swap out the path for your actual path to the android-sdk dev tools. Now reload the terminal
window to make these paths available, or run the the following command for the same effect.<br>
```
$ source ~/.bashrc
```
<br><br><br>

4. Install Cordova and Ionic <br>
```
$ npm install -g cordova ionic
```
<br><br><br>

5. Now we are finally ready to clone the repository to your local machine. Change your directory to where you 
wish to have the project located at, then run the following command.<br>
```
$ git clone https://github.com/CareWheels/Capstone.git
```

<br><br><br>

###Windows
1. Download and install node.js and npm [here](https://nodejs.org/en/download/)

---

##Building the Project with Ionic
###Android Build

---

##Emulate on Computer
This is an optional step, this can be completely avoided if you build the project and then copy over file onto
your mobile device. 

###Emulate Android
Ionic provides support to run an Android Virtual Devices(AVD) directly from the command line, however I would
suggest using genymotion instead (especially if running on linux). Below is instructions for both options.

####GenyMotion Setup
In order to download genymotion, you need to create a free account with them 
[here](https://www.genymotion.com/account/create/). Once logged in you can then download their android emulator 
[here](https://www.genymotion.com/download/). After you installed genymotion, launch the program, and create an
android emulation device. Once the emulator enter this into the console to run the app.<br>
```
$ ionic run android
```
<br><br>

####AVD Setup
Android does not provide any default emulator, so we will need to create one. In the terminal run the command <br>
```
$ android
```
<br><br>
This will open up a new window, click `tools` -> `Manage AVD's`