# CareWheels PHP OAuth2 Client

### install instructions
0.  This project requires `php` and `composer` to be installed.
    ```
    $ sudo apt-get install php
    $ sudo apt-get install composer
    ```

1.  Clone the repository by first navigating to where you would like the project
    to live at. Then run the following command.
    ```
    $ git clone git@github.com:CareWheels/Capstone.git
    ```
 
2.  Navigate to the OAuth2 directory.
    ```
    $ cd Capstone/OAuth2
    ```
    
3.  Build the project with `compose` by running.
    ```
    $ compose install
    ```
    This should create a `composer.lock` file for you.
    
----------

### Usage

0.  Start the PHP server. Run this while in the OAuth directory.
    ```
    $ php -S <yourDomain>:<yourPort>
    ```
    
0.  View the page, open an internet browser and navigate to the following url.
    ```
    <yourDomain>:<yourPort>/src/index.php
    ```