# Media Tracker

## Overview

This is an application being developed to gain a better understanding of progressive web app development, component libraries, and IndexedDB. I'm also making it because I've tried using OneNote and Excel to track my current media (what I'm currently playing, watching, reading etc.) and found it somewhat less than ideal. So, I'm attempting to make my own solution.

## Features

As this is a progressive app, it is installable to use locally! It uses the client-side database IndexedDB for its data storage.

## How to Use

### End User

This app has three screens, currently. The starting, or "Home" screen is meant to be a dashboard of sorts that shows what's currently on the docket. The "Entry" screen lets you add new things to log. The "Log" screen lets you view the full database of existing entries.

### Development
```
# build for development:
npm run dev

# build for production:
npm run build

#run prettier formatter:
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

## To-Do
* Create themes
  * Color-code by status
* ~~Allow deletion of existing entries~~
* ~~Allow editing of existing entries~~
* Make installable (installation function seems to have broken at some point)
* Add entries to the start page, filtered by what is "currently being played"

## Things to investigate

* Export data to local file, and import data from local file
* Cloud sync (specifically between desktop and mobile)
  * Considering Firebase or Dexie Cloud for this