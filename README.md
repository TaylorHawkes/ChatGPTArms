# Introduction - ChatGPT Arms
ChatGPT Arms provides an open source & standardized interface for hooking up [ChatGPT](https://chat.openai.com/) with the "Real World", aka API's and third party systems, etc. The "Arms" basically means allowing ChatGPT to interact with the real world and getting data from third party systems other than the trained data. This can be useful in many ways such as looking for the weather to viewing the nearby places in your location.
See video intro below to see how this works:

[![Introductory video on youtube.com](https://us-east-1.tixte.net/uploads/almightynan.needs.rest/View_the_video_intro_%E2%86%97%EF%B8%8F.png)](http://www.youtube.com/watch?v=o2LiPkkIjeQ "Click here to redirect yourself to YouTube ↗️")

# How is this possible?
This project uses what we are calling ["Arms"](https://github.com/TaylorHawkes/ChatGPTArms/tree/main/arms), which is just an npm package that anyone can create, the package must implement one method called "`processConversation`", as the user converses with ChatGPT every arm will get a change to process the conversation using it's own logic, if that arm detects it needs to do something (ex: check the weather) it returns a prompt rather than sending it to chatGPT.

You can see a clear example in the [WeatherArm Package by clicking here.](https://github.com/TaylorHawkes/ChatGPTArms/blob/main/arms/weatherarm/index.ts) 

# Running on your machine
1. To get started, install [this repository](https://github.com/TaylorHawkes/ChatGPTArms) and use an unzipper tool to unzip it.
2. Locate to the directory and open command prompt or use the `cd` method in command prompt to locate to the directory.
3. You need NodeJS to run this project. If you haven't installed it yet, [click here](https://nodejs.org/en/download) to download it for your OS.
4. Once you've done all that, run this command to install the required packages:
  ```js
  npm install
  ```
5. To create a NextJS build for this project in your machine, run this command:
  ```js
  npm run build
  ```
6. To start the project through localhost, run this command:
  ```js
  npm run start
  ``` 
or
  ```js
  npm run dev
  ```

# Demo & Other info
- View the live site at: http://chatgptarms.com
- Contributors are requested to join the Discord server for discussions: https://discord.gg/jxRR8FfrMN
- TODO list is available on Trello: https://trello.com/b/BHtgp4zU/chatgpt-arms

# Contributing

Fork [this repository](https://github.com/TaylorHawkes/ChatGPTArms) and create a branch to get started. Commit the changes in the forked repository and submit a pull request.
This is still very much a work in progress, I'm looking for contributors to help develop the core package as well as adding "Arms" to the interface. 


