<p align="center">
  <picture>
    <img src="https://github.com/semkolol/daily/blob/main/assets/images/logo.png" height="100" alt="Daily logo">
  </picture>
</p>

<p align="center">
  <strong>Gamify Your Goals & Habits</strong>
</p>

<p align="center">
  <a href="https://apps.apple.com/us/app/daily-habit-quest-tracker/id6746382725?platform=iphone">
    Daily:
  </a> 
   Habit & Quest Tracker
</p>

## Getting Started
### Prerequisites

Node.js
https://nodejs.org/en/download

Having a compatible Simulator or Physical Device, at least iOS 15

The app is fully local, user data, in-app purchase logic etc. even the AI API calls and your API-Keys so no server stuff needed.
(I'm aware of the "issues" when handling in-app purchases locally)

## Config
If you want the in-app purchases to work, you will need an revenue-cat account and a apple developer account and replace the API-Keys in @/utils/purchases.ts

You'll also need an OpenAI or Google Gemini API-Key to use the AI Scan feature.

## Run Locally
Go into the root directory with your terminal

Install dependencies
``
  npm install
``

Run locally
``
  npx expo run:ios -d

  or

  npx expo run:android -d
``

-d to choose device

Note: that the app was developed iOS-first in mind
