# Summary

TurfWar.io is a GPS-based, global game of territory control. It was developed as a hackathon project during my time studying at Fullstack Academy. It is currently deployed and available via Expo, and the server is launched on Heroku. The game was inspired by territory-based games like Splatoon and Planetside, and its incorporation of GPS as a game mechanic was inspired by Pokemon Go.

# Technology
This repository stores the code for the React Native application deployed on Expo. For the server code, visit: https://github.com/erichfeinstein/TurfWar.io-Server. The TurfWar.io mobile app was built with the following tools:
- React Native
- Socket.io
- Geolocation API

Developing in React Native is a blast, and using Expo makes the experience even better. React Native simplifies the development process for making a native application for both Android and iOS. Socket.io enables real-time updates from other players interacting with the world, and keeping a live, updated score available to players. The Geolocation API in React Native allows for getting a mobile device's geolocation, which is critical to the core gameplay.

# How to Run
To play TurfWar.io, please do the following:
- `git clone` the repo.
- With `expo` installed, run `expo start`.
- Using the Expo application on your mobile device, scan the QR code that appears in your termianl.
- The application will attempt to connect to the server application deployed on Heroku.
- Enjoy playing!
