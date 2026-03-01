# Brawl Stars Resource Calculator

A static web app for calculating the resources needed to upgrade a brawler between two power levels.

## Features

- Dual-handle level slider (Start and Target between levels 1 and 11)
- Gadget count selector (0, 1, 2)
- Star Power count selector (0, 1, 2)
- Hypercharge checkbox
- Super Rare gear count slider (0 to 6)
- Epic gear checkbox
- Mythic gear checkbox
- Buffie checkboxes:
  - Gadget Buffie
  - Star Buffie
  - Hyper Buffie

## Unlock Rules (Auto-Forced)

If the target level is below an unlock level, related options are automatically unchecked:

- Gadget unlock: level 7
- Gears unlock: level 8
- Star Power unlock: level 9
- Hypercharge unlock: level 11

## Cost Model

- Base level costs: `LEVEL_PP` and `LEVEL_COIN` in `app.js`
- Gadget: 1000 coins each
- Star Power: 2000 coins each
- Super Rare Gear: 1000 coins each
- Epic Gear: 1500 coins
- Mythic Gear: 2000 coins
- Hypercharge: 5000 coins
- Buffie: 1000 coins + 2000 PP each

## Font

The app uses a local font from:

- `assets/fonts/LilitaOne-Regular.ttf`

## Run

Open `index.html` in a browser.
