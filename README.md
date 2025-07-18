# Media Tracker

## Overview

This is an application being developed to gain a better understanding of progressive web app development, component libraries, and IndexedDB. I'm also making it because I've tried using OneNote and Excel to track my current media (what I'm currently playing, watching, reading etc.) and found it somewhat less than ideal. So, I'm attempting to make my own solution.

## Features

* Progressive app which can be installed for local use with compatible browsers.
  * On PC this means Edge or Chrome. I've also tested with Vivaldi.
* Uses your browser's IndexedDB for data storage, meaning none of your data needs to leave your machine. It's all stored locally.
  * Optionally, you may choose to back up your data to an Azure-based cloud database, to keep it conveniently updated across multiple devices.
* Supports games, TV series, movies, and books.
* Mobile-ready responsive design.
* View, edit, sort, and search through your database.
* Export your database to a small JSON file as a backup. You can later import it back in.
* Write your thoughts on each piece of media with a built-in rich text editor.

## How to Use

### End User

This app has four screens, currently. The starting, or "Home" screen is meant to be a dashboard of sorts that shows what's currently on the docket. The "Entry" screen lets you add new things to log. The "Log" screen lets you view the full database of existing entries. The "Settings" screen lets you adjust the behavior of the app. This is also where you can import and export your database.

### Development
```
# build for development:
npm run dev

# build for production:
npm run build

# run prettier formatter:
npm run format
```
See repository's prettier config (`.prettierrc.json`) for prettier rules.

## Tech Stack

This project was built with the following major technologies:

* Vue 3
* Vue Router 4
* Pinia
* Vite-PWA
* LuxonJs
* DexieJs
* QuillJs

Cloud functionality uses a separately-developed ExpressJS server hosted on Microsoft Azure, with data stored on Azure Cosmos DB.

## To-Do
* Create themes
  * Color-code items by status
* ~~Add dark theme~~
* ~~Allow deletion of existing entries~~
* ~~Allow editing of existing entries~~
* ~~Make installable (installation function seems to have broken at some point)~~
* ~~Add entries to the start page, filtered by what is "currently being played"~~
* ~~Allow exporting of database~~
* ~~Allow importing of database~~
* Add ability to set platforms for games
* ~~Add TV support~~
* ~~Add Movie support~~
* ~~Add Book support~~
* ~~Add search box to database screen~~
* Switch to Azure Functions for backend

## Things to investigate

* ~~Export data to local file, and import data from local file~~
* ~~Cloud sync (specifically between desktop and mobile)~~