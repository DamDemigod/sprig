/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: Crates, Gates, and Hot Plates
@description: A fun puzzle game where you must push boxes, maneuver around(or over!) lava, and go through portals to place the boxes into the goals!
@author: Varad Nair
@tags: ['puzzle', 'portal']
@addedOn: 2026-06-02
*/


const player  = "p";
const box     = "b";
const goal    = "g";
const wall    = "w";
const lava    = "l";
const portalA = "a";
const portalB = "o";

setLegend(
  [player, bitmap`
................
....DDDDDDDD....
...DD444444DD...
..D4444444444D..
.DD4444444444DD.
.D444DD44DD444D.
.D444DD44DD444D.
.D444444444444D.
.D444444444444D.
.D444D44444444D.
.D4444DDD44444D.
.DD4444444444DD.
..D4444444444D..
...DD444444DD...
....DDDDDDDD....
................`],
  [box, bitmap`
6666666666666666
6666666666666666
6666666666666666
666FCCCCCCCCF666
666CFCCCCCCFC666
666CCFCCCCFCC666
666CCCFCCFCCC666
666CCCCFFCCCC666
666CCCCFFCCCC666
666CCCFCCFCCC666
666CCFCCCCFCC666
666CFCCCCCCFC666
666FCCCCCCCCF666
6666666666666666
6666666666666666
6666666666666666`],
  [goal, bitmap`
6666666666666666
6666666666666666
6666666666666666
6660202020202666
6662020202020666
6660202020202666
6662020202020666
6660202020202666
6662020202020666
6660202020202666
6662020202020666
6660202020202666
6662020202020666
6666666666666666
6666666666666666
6666666666666666`],
  [wall, bitmap`
LLLLLLLLLLL1LDDD
LLLDLLLLDLLLLDDL
LL1LLLLL1111LDDD
DLLLLLLL1111LLDD
DLLLD111LLLLLLLD
D11LLLLL1LLLL11L
LLLLLLLLL1LDLLLL
LLLL1DL11LDLLLDL
LLLLD11LLLL111LL
LLLDLLL11LL11DLL
LLLLLLLLLLL111LL
LL11LLLLLDLLLDLL
DL111LLLLLLLL11L
LL1D1LLLL11LLLLD
LL1111LLLLLLLLLL
LLLLLLLLLL11LDDD`],
  [lava, bitmap`
9333333333333339
9333333333333339
9933366633366333
3396633663663333
3333633363363333
3333633663366333
3336633633366333
3333333633333333
3333333633993333
3333333639993333
3333333339339993
9933333339336699
3993333339336363
6399333339999936
6996333333339996
9966333333333399`],
  [portalA, bitmap`
................
....88888888....
...8HHHHHHH88...
..8HH888888HH8..
.8HH8HHHHHH8H88.
.8H8HH8888HH8H8.
.8H8H8HHHH8H8H8.
.8H8H8H88H8H8H8.
.8H8H8H88H8H8H8.
.8H8H8HHHH8H8H8.
.8H8HH8888HH8H8.
.88H8HHHHHH8H88.
..8HH888888HH8..
...88HHHHHH88...
....88888888....
................`],
  [portalB, bitmap`
................
....HHHHHHHH....
...HH888888HH...
..H88HHHHHH88H..
.HH8H888888H8HH.
.H8H88HHHH88H8H.
.H8H8H8888H8H8H.
.H8H8H8HH8H8H8H.
.H8H8H8HH8H8H8H.
.H8H8H8888H8H8H.
.H8H88HHHH88H8H.
.HH8H888888H8HH.
..H88HHHHHH88H..
...HH888888HH...
....HHHHHHHH....
................`]
);

const levels = [
map`
p.w..g.
..w....
..w....
..lwb..
.......
.......
.......`,map`
.p.
...
b.b
...
...
g.g`,map`
.www.
p.bbg
.www.`,map`
.l..
.lbp
glb.
.l..`,map`
p.l..
.al..
.lo..
glbb.
l....`,map`
p.bgp`, map`
..lbl....l
pbl.l.l...
..l.l....l
wwwwwww...
wobblgw...
wwwwwww.l.
l.........
a.ll.l.l..`,map`
lb.wgbawo
ol.w..w..
wp.w.w...
wwwwwa...
a..wwwwww
...wa....
...w.....
...w.....
ogblb...o`,map`
p.wwwwwlwwwww
w.wwwww.wabgw
w.ww....wwwgw
g.....wwwwwbw
waww..wwwwo.w
www.b.wwwww.w
www...wwwww.w
wwwwwwww....w
wwwwwwww.wwlw
wwwwwwww...ow`]

let level = 0;
setMap(levels[level]);

let gameOver = false;

onInput("w", () => {
  if (gameOver) return;
  getFirst(player).y -= 1;
});

onInput("a", () => {
  if (gameOver) return;
  getFirst(player).x -= 1;
});

onInput("s", () => {
  if (gameOver) return;
  getFirst(player).y += 1;
});

onInput("d", () => {
  if (gameOver) return;
  getFirst(player).x += 1;
});

onInput("k", () => {
  clearText();
  setMap(levels[level]);
  gameOver = false;
});



setSolids([player, box, wall]);

setPushables({
  [player]: [box],
  [box]: [box]
});

afterInput(() => {
  const numberCovered = tilesWith(goal, box).length;
  const targetNumber = tilesWith(goal).length;

  if (numberCovered === targetNumber) {
    level += 1;
    const currentLevel = levels[level];

    if (currentLevel !== undefined) {
      setMap(currentLevel);
    } else {
      gameOver = true;
      addText("YOU WIN WOO HOO", { y: 0, color: color`4` });
      return;
    }
  }

  const lavaAndPlayer = tilesWith(lava, player).length;
  if (lavaAndPlayer > 0 && !gameOver) {
    gameOver = true;
    addText("GAME OVER", { y: 0, color: color`3` });
  }

  const lavaBoxTiles = tilesWith(lava, box);
  for (const tile of lavaBoxTiles) {
    for (const sprite of tile) {
      sprite.remove();
    }
  }

  const onPortalA = tilesWith(player, portalA);
  const onPortalB = tilesWith(player, portalB);

  if (onPortalA.length > 0) {
    const targets = tilesWith(portalB);
    if (targets.length > 0) {
      const targetTile = targets[Math.floor(Math.random() * targets.length)];
      const targetSprite = targetTile[0];
      const p = getFirst(player);
      p.x = targetSprite.x;
      p.y = targetSprite.y;
    }
  }

  if (onPortalB.length > 0) {
    const targets = tilesWith(portalA);
    if (targets.length > 0) {
      const targetTile = targets[Math.floor(Math.random() * targets.length)];
      const targetSprite = targetTile[0];
      const p = getFirst(player);
      p.x = targetSprite.x;
      p.y = targetSprite.y;
    }
  }
});

