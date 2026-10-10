# Pallavi & Nilotpal · Wedding Website

**Live at https://virtualart43.github.io/pallavi-weds-nilotpal/**

The whole site lives in this folder. Everything you'd edit (names, dates, venues,
phone numbers) is in **`js/config.js`**; nothing else needs touching.

## What happens on the page

0. **Intro film (34 s):** plays full screen first (`js/intro.js`, `assets/intro/`). Rudra narrates in Hindi over a
   moonlit Japanese and Indian world: shooting stars tie the red knot, lanterns rise over the ghats, the names in a
   sakura avenue, koi and a lotus, a family bowing in namaste, then through a torii gate. It always plays with
   sound. Where the browser allows sound on its own (some computers) it simply starts; phones never let a page
   start sound by itself, so they first see a start screen (the film's moonlit sky, the names, a jewelled gold
   medallion and "Tap to begin"), and that one tap starts the film with sound from the first word. When the film
   ends the palace doors open by themselves, with no button. A tiny, faint "skip" appears at the bottom after
   6 seconds. Phones get `intro-phone.mp4` (720x1280), wide screens `intro-wide.mp4` (1920x1080). The start
   screen uses `start-sky.jpg`, `start-sky-soft.jpg` (the blur beside it on wide screens), `gold-medallion.webp`
   and `gold-ring.webp`. Add `?nointro` (or `?open`) to skip the film while editing, or `?tap` to always see the
   start screen. The film is made in `../intro-video/` (see its README).
1. **Loader:** Lord Ganesha draws himself in gold, with ॥ श्री गणेशाय नमः ॥
2. **Palace doors:** carved doors with jali arches, mandala medallions, brass knockers, a
   marigold toran and lit brass lamps. Tapping breaks the PN seal in half; the doors swing
   inward with a soft temple bell, and you pass through the doorway.
3. **Hero:** a night sky over an illuminated palace with chasing festival lights, rising sky
   lanterns, occasional fireworks, swinging lanterns, and the names written in gold with a
   live countdown.
4. **Marquee:** two gold bands scroll the names and date, and speed up as you scroll.
5. **The invitation:** a royal scroll that unrolls as you read, ending in a wax seal.
6. **The couple:** red velvet curtains open to show the portrait in a jharokha frame with
   swinging temple bells, and a flower shower follows: marigolds, roses, mogra and petals burst
   out of the lotus at the top of the frame and from the flower beds in the bottom corners, then
   rain down gently. It plays every time the portrait comes into view, whether you scroll down to
   it or come back up to it; once it has almost left the screen the curtains close again. On
   desktop it tilts in 3D as you move the mouse.
7. **Celebrations:** the background colour shifts for each event:
   - Mehendi: a henna mandala that draws itself
   - Vivah: the mandap, with seven diyas circling the sacred fire

   (Scenes also exist for Shivcharcha, Satyanarayan, Devpoojan, Haldi, Sangeet and Reception. Use `icon: "shiv"`, `"satyanarayan"`, `"devpoojan"`, `"haldi"`, `"sangeet"` or `"reception"`.)
8. **Venue:** map and directions, plus travel tips for outstation guests.
9. **Family:** blessings, both families, and a line from the little ones.
10. **For any details:** contact cards with Call and WhatsApp buttons.
11. **Finale:** a night sky full of lanterns. Guests can tap to launch fireworks.

Tapping anywhere scatters marigold petals. On a computer, the mouse leaves a trail of fairy dust.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Page structure |
| `js/config.js` | **Edit this.** All names, dates, venues, contacts and text |
| `js/art.js` | All ornaments: palace, doors, toran, mandalas, lamps, seal, Ganesha, icons |
| `js/scenes.js` | The five animated celebration scenes |
| `js/fx.js` | Petals, the curtain flower shower, fireworks, stars and sky lanterns |
| `js/sound.js` | The temple bell, synthesised in the browser, so no sound file is needed |
| `js/app.js` | Builds the page and choreographs the motion |
| `js/vendor/` | GSAP, ScrollTrigger and Lenis, kept locally so no CDN is needed |
| `css/v2.css` | All styling (phone and desktop) |
| `assets/photos/` | The portrait (see below) |
| `assets/music/` | Optional `shehnai.mp3` |
| `assets/og.jpg` | The preview image shown when the link is shared on WhatsApp |

## The portrait

The Bride & Groom section is a framed paper-cut scene, layered from three parts (back to front):
- `assets/photos/portrait.webp`: the paper-cut portrait of Pallavi and Nilotpal (made with Codex from
  their photo, tika removed, transparent background). `portrait.png` is a full-quality fallback for
  very old browsers. It appears only in this section, not behind the names at the top.
- `assets/photos/background-landscape.webp` (computers) and `background-portrait.webp` (phones): the
  paper-cut scene behind them (ivory arches, paper flowers, bells, jali windows), made with Codex from
  the family's reference image, with no people in it.
- `assets/photos/foreground-landscape.webp` and `foreground-portrait.webp`: a bank of paper flowers
  along the bottom (transparent above). It sits in front of the couple and covers where the cut-out
  ends, so they stand in the scene instead of floating.
The couple sits between the two unchanged, so their faces stay exactly as approved. All three layers
are set in `js/config.js` (`portrait` and `backdrop`); the couple's height and position are
`.portrait__couple` in `css/v2.css`.

Drafts, the original photo, the reference and the Codex briefs stay on Piyush's Mac in
`../portrait-drafts/` and are not published. Ready-made combined images are there too:
`Pallavi-Nilotpal-paper-cut.jpg` (both versions side by side), `Pallavi-Nilotpal-wide.jpg` and
`Pallavi-Nilotpal-phone.jpg`. `composite.html` regenerates them.

To try another portrait in place, save it as `assets/photos/portrait-2.png` and open
`…/v2/?portrait=2`.

## Previewing

From the `Pallavi's marriage` folder:

```bash
python3 -m http.server 8877
```

Then open http://localhost:8877/v2/. After editing, hard-refresh with Cmd + Shift + R.
Adding `?open` to the URL skips the doors, which is handy while editing.

## Publishing

The site is hosted free on GitHub Pages from the `main` branch of
[VirtualArt43/pallavi-weds-nilotpal](https://github.com/VirtualArt43/pallavi-weds-nilotpal).
Every push to `main` goes live at the link above within a minute or two. To publish a change,
from this folder:

```bash
git add -A && git commit -m "Update wedding timings" && git push
```

If the `gh` CLI's active account is not VirtualArt43, push with that account's login for this one command:

```bash
GH_TOKEN="$(gh auth token --user VirtualArt43)" git push origin main
```

When you change `css/` or `js/` files, bump the `?v=` number on their tags in `index.html` so
phones don't keep an old copy. If the site ever moves to another address, update `og:url` and
`og:image` in `index.html` too; WhatsApp needs those full links for the preview card.
