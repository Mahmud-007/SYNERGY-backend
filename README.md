# SYNERGY-backend
This is the REST API backend for [Synergy](https://github.com/lullabyX/synergy-frontend), a simple colaborative web app

### About the backend
---
It's a node-express REST API server with MongoDB.

### How to run
---
1. Install [git](https://git-scm.com/)
2. Download the server by running the following code in terminal/command prompt/bash/powershell
``git clone https://github.com/lullabyX/synergy-frontend.git``
3. Run the following commmand to install necessary dependencies
``npm install``
4. Now, create a file name **.env** in the root folder of the project. Just like this   
 <a href="https://ibb.co/MsPDWX7"><img src="https://i.ibb.co/MsPDWX7/2021-12-14-15-41-17.jpg" alt="2021-12-14-15-41-17" border="0"></a>  
 This file will contain all the environment variables for the server. You'll need to fill them up with your own value.
 ### [.env](https://pastebin.com/J7uYFKFY)
 The most important ones are **DATABASE** which is MongoDB url, **JWT_SECRET_KEY** which is the key that encrypts json web token, **JWT_REFRESH_SECRET_KEY**, **JWT_TOKEN_TIMEOUT**, **COKIE_SECRET**,
 **SYNERGY_BACKEND** the url the server will be running, **SYNERGY_FRONTEND** url for the frontend. 
 SIB means [sendinblue](https://www.sendinblue.com/) which is an email service provider used for email transaction. You'll need to signup at SIB to get your api key and create your own template for email verification and password reset.

5. Finally, run the code to start the server 
  ``npm start``
