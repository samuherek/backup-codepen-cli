# Backup Codepen.io CLI

> **This tool is still just WIP**. You have to clone it and run with ts-node directly on ./src/index.ts to get it working!

If you find yourself in a need to backup your codepen pens into real files on your computer, this cli tool can help you out.

The need behind this tool was for me to backup my private pens and delete them from codepen.
I find myself to use codepen less and less because my development focused has changed.
So.... as much as I like codepen, my "PRO" account needs to retire.

## What this tool can do for you

- It can scrape basic info for public pens for specific profile
- It can scrap pen's files and save them to your disk
- _there is a helper script to help you get a list of your private pens in `scripts` folder_

## What packages this tool uses

This CLI uses "Typescript" for code and "Puppeteer" for scraping. (Puppeteer, is a headless chrome browser which you can control pretend you are a real user).

## How you get it to work

1. Clone this repo
2. `cd` into the cloned repo
3. run `npm install`
4. read the crappy docks below to see how to use it

### Usage

> NOTE: Because this uses puppeteer, things can take a bit of time. Make sure you have more than just a couple of minutes if you have many pens.

Firstly, you need to create a `json` file which has all the necessary data for this tool to know which pens to backup.
The minimum JSON structure needs to be in this format, to make it work properly.

```json
[
  {
    "title": "I believe this not required, but it is used to show you progress in terminal",
    "link": "https://codepen.io/ ...link to the pen",
    "sourceFiles": [
      "https://codepen.io/ ... link to the pen + the extensions (.html|.css|.js)",
      "..."
    ]
  }
]
```

**There are two ways you can speed up the process of collecting the json data.**

#### 1A. Use the script in google developer tool form "scripts" folder

Because you have to sign in to access your private pens, the quickest way to collect the pens, was to run a simple script in your Google Developer Console. This script will save the necessary info about the pens into the "localStorage". You can then read them from the local storage and copy/paste into a JSON file to be used for the CLI.

**Here are the steps to follow:**

Navigate to "./scripts/collect-private-pens.js". Select and copy the script into clipboard.
Then navigate to codepen.io, and sign in. Next, navigate to your dashboard select private pens. Next, it's important you select the _List view_ so the pens show up as a list instead of grid. You can use the URL example from below if you don't know where it is.

`https://codepen.io/${your_username}/pens/private?grid_type=list`

You have to do some manual work now. Open Google Developers Console (ALT + CMD + i).
Paste the script you copied from the clipboard and hit "ENTER".

Now you are ready to run `scrape()` in the console. You should see an output in the console as an "array" with some items in it. That means all went well. Now, let's do next pagination page if it exists.

Run `next()` in the console. Now, make sure you wait until the next list of pens loads and appears on the screen (this might take a second). Once they are there, repeat the process of running `scrape()` and `next()` until you go through all your private pens.

As the last step, we need to copy all the pens saved in your localStorage and put then in a local JSON file.

Run `JSON.stringify(JSON.parse(localStorage.getItem("cp")), null, 2)` in the chrome console. It should output a big formated string with all the data. Now just copy it and paste it to a local JSON file.

#### 1B. Use the CLI with command "get-public"

Important! This only works for collecting public pens, because we don't want to mess with all the authentication mess right now :D.

You can simply run this command from within the cloned repo:

```cli
ts-node ./src/index.ts get-public -u USERNAME -o PATH_TO_OUTPUT_DIR
```

`USERNAME` -> That is the username of the profile you want to scrape
`PATH_TO_OUTPUT_FILE` -> some directory path on your computer where the CLI needs to save this intermediate step with the list of links. It will save a file in there with name `scraped-public-data.json`

#### 2. Intermediate step to get pen's info

Now, when we have all the links collected, let's get extra information for each pen. Info like the preprocessor you used or what other extra "packages" are needed to run this pen.

Run this command from within the cloned repo:

```cli
ts-node ./src/index.ts get-source -i PATH_TO_JSON_FILE -o PATH_TO_OUTPUT_DIR
```

`PATH_TO_JSON_FILE` -> this is the file we created in the step 1. (../scraped-public-data.json)
`PATH_TO_OUTPUT_DIR` -> this is the directory a new JSON file will be created with extra information about the pen. It will be called `scraped-with-settings-data.json`

#### 3. Finally grab all the codepen files

After all the hard work, the easy bit comes now.
Simply run this command.

```cli
ts-node ./src/index.ts backup -i PATH_TO_JSON_FILE -o PATH_TO_OUTPUT_DIR
```

`PATH_TO_JSON_FILE` -> Important! This is the file from step 2. (not the one from step 1). (../scraped-with-settings-data.json)
`PATH_TO_OUTPUT_DIR` -> this it the directory all the codepen files will be put.

#### The output will be

The final output will look like this, if you followed all the above steps;

```
/outputDir
-- /penName/
----- /index.html // if used in pen
----- /index.haml // if used in pen
----- /index.markdown // if used in pen
----- /index.slim // if used in pen
----- /index.pug // if used in pend
----- /style.css // if used in pend
----- /style.scss // if used in pend
----- /style.sass // if used in pend
----- /style.less // if used in pend
----- /style.stylus // if used in pend
----- /style.postcss // if used in pend
----- /script.js // if used in pend
----- /script.babel // if used in pend
----- /script.typescript // if used in pend
----- /script.coffeescript // if used in pend
----- /script.livescript // if used in pend
----- /config.json
```

The _config.json_ file for each pen will look like this:

```json
{
  "title": "Pen title",
  "link": "https://codepen.io/username/pen/penId",
  "createdAt": "Date",
  "updatedAt": "Date",
  "hearts": "0",
  "comments": "0",
  "views": "0",
  "settings": {
    "html": { "preprocessor": "none", "head": "" },
    "css": { "preprocessor": "scss", "resources": [] },
    "js": {
      "preprocessor": "babel",
      "resources": [
        "https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react-dom.min.js",
        "https://unpkg.com/prop-types/prop-types.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/immutable/3.8.1/immutable.js",
        "https://cdnjs.cloudflare.com/ajax/libs/draft-js/0.10.1/Draft.js",
        "https://cdnjs.cloudflare.com/ajax/libs/redux/3.6.0/redux.js",
        "https://cdnjs.cloudflare.com/ajax/libs/react-redux/5.0.3/react-redux.js"
      ]
    }
  },
  "sourceFiles": [
    "https://codepen.io/username/pen/penId.html",
    "https://codepen.io/username/pen/penId.css",
    "https://codepen.io/username/pen/penId.scss",
    "https://codepen.io/username/pen/penId.js",
    "https://codepen.io/username/pen/penId.babel"
  ]
}
```

## Possible todo

- [ ] Collect the images for each pen as well
- [ ] Make a simple online service that would do all the work
