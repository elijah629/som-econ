// TECHINCALLY! I should be checking shop prices over time, but it SHOULD not change things that much since we get the closest shop item if there is none.

export function findClosestItems(price: number): string[] {
  return PRICE_MAP.get(price) ?? [];

  /*if (PRICE_MAP.has(price)) {
    return PRICE_MAP.get(price)!;
  }*/

  /*const availablePrices = Array.from(PRICE_MAP.keys());

  if (availablePrices.length === 0) return [];

  let closestPrice = availablePrices[0];
  let smallestDiff = Math.abs(price - closestPrice);

  for (const p of availablePrices) {
    const diff = Math.abs(price - p);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestPrice = p;
    }
  }

  return PRICE_MAP.get(closestPrice)!;*/
}

export const PRICE_MAP = new Map<number, string[]>([
  [5, ["Spider"]],
  [10, ["Graphic design is my passion"]],
  [40, ["Summer of Making Blue"]],
  [100, ["Sunglasses", "Pocket Watcher"]],
  [150, ["Offshore Bank Account"]],
  [160, ["Gold Verified"]],
  [1000, ["I am Rich"]],
  [25, ["Pile of Stickers"]],
  [32, ["TIS-100"]],
  [35, ["64GB USB Drive"]],
  [45, ["Domain grant", "64GB USB Drive"]],
  [50, ["Logic Analyzer"]],
  [60, ["Pico-8 License", "128GB USB Drive"]],
  [65, ["128GB USB Drive"]],
  [66, ["Hot Glue Gun"]],
  [80, ["Voxatron License", "Cat Printer"]],
  [92, ["Allen Wrench"]],
  [100, ["sketch from msw", "Raspberry Pi Zero 2 W"]],
  [102, ["Digital Calipers"]],
  [103, ["20 bucks in Framework credit"]],
  [110, ["256GB microSD card + adapter", "sketch from msw"]],
  [115, ["256GB USB Drive", "sketch from msw"]],
  [137, ["shapez 2"]],
  [144, ["Pinecil"]],
  [145, ["USB C Cable + Wall Adapter"]],
  [147, ["CH341A Programmer"]],
  [150, ["Orpheus Pico! (preorder)"]],
  [155, ["Cat Printer"]],
  [162, ["Dupont Crimping Tool Kit"]],
  [170, ["25 bucks in IKEA credit"]],
  [175, ["Factorio", "Lexaloffle Games bundle"]],
  [180, ["Brother Label Maker"]],
  [182, ["Qiyi XMD XT3 speedcube"]],
  [211, ["Smolhaj"]],
  [220, ["Squishmallow"]],
  [250, ["Proxmark 3 Easy"]],
  [330, ["Yubikey USB-C"]],
  [398, ["Baofeng UV-5R (2 pack)"]],
  [400, ["Yubikey USB-A"]],
  [460, ["min(amame) Parts Kit"]],
  [502, ["Waveshare 7.5inch E-Ink Display"]],
  [542, ["Seagate 2TB external HDD"]],
  [595, ["Logitech MX Master 3S"]],
  [657, ["Raspberry Pi 5"]],
  [665, ["Thermal Imager"]],
  [750, ["K4 desktop laser engraver"]],
  [775, ["head(amame) Parts Kit", "Logitech G Pro X Superlight"]],
  [812, ["Glasgow Interface Explorer"]],
  [820, ["XPPen Deco Pro MW"]],
  [850, ["Logitech G Pro X Superlight"]],
  [1175, ["Cricut Explore 3", "Bambu A1 mini Printer"]],
  [1390, ["Playdate"]],
  [1475, ["Bambu A1 mini Printer"]],
  [1632, ["100MHZ Oscilloscope"]],
  [1750, ["$500 in Amp credit", "Bambu Labs A1"]],
  [1800, ["Nebula.tv Lifetime subscription", "Bambu Labs A1"]],
  [2100, ["Bambu Labs A1"]],
  [3400, ["iPad + Apple Pencil"]],
  [4050, ["M4 Mac Mini"]],
  [5612, ["13-inch M4 MacBook Air"]],
  [5875, ["Prusa MK4S 3D Printer"]],
  [11075, ["MacBook Pro"]],
  [75, ["Orpheus Pico! (preorder)"]],
  [97, ["CH341A Programmer"]],
  [125, ["256GB USB Drive", "Orpheus Pico! (preorder)"]],
  [136, ["Smolhaj"]],
  [237, ["Dupont Crimping Tool Kit"]],
  [300, ["Yubikey USB-A"]],
  [427, ["Waveshare 7.5inch E-Ink Display"]],
  [448, ["Baofeng UV-5R (2 pack)"]],
  [630, ["Thermal Imager"]],
  [632, ["Raspberry Pi 5"]],
  [670, ["Logitech MX Master 3S"]],
  [690, ["K4 desktop laser engraver", "Thermal Imager"]],
  [762, ["Glasgow Interface Explorer"]],
  [770, ["XPPen Deco Pro MW"]],
  [950, ["Flipper Zero"]],
  [1135, ["Cricut Explore 3"]],
  [1150, ["Bambu A1 mini Printer"]],
  [1775, ["Bambu Labs A1"]],
  [4499, ["Framework Laptop 12"]],
  [5500, ["Prusa MK4S 3D Printer"]],
  [8995, ["MacBook Pro"]],
  [40, ["64GB USB Drive"]],
  [120, ["256GB USB Drive"]],
  [122, ["USB C Cable + Wall Adapter"]],
  [350, ["Yubikey USB-A"]],
  [492, ["Seagate 2TB external HDD"]],
  [620, ["Logitech MX Master 3S"]],
  [1125, ["Bambu A1 mini Printer", "Cricut Explore 3"]],
  [6000, ["Prusa MK4S 3D Printer"]],
  [12665, ["MacBook Pro"]],
  [55, ["128GB USB Drive"]],
  [375, ["Yubikey USB-A"]],
  [5750, ["Prusa MK4S 3D Printer"]],
  [5800, ["Prusa MK4S 3D Printer"]],
  [9245, ["MacBook Pro"]],
  [800, ["K4 desktop laser engraver"]],
  [6250, ["Prusa MK4S 3D Printer"]],
]);
