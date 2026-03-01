const LEVEL_PP = {
  1: 20,
  2: 30,
  3: 50,
  4: 80,
  5: 130,
  6: 210,
  7: 340,
  8: 550,
  9: 890,
  10: 1440,
};

const LEVEL_COIN = {
  1: 20,
  2: 35,
  3: 75,
  4: 140,
  5: 290,
  6: 480,
  7: 800,
  8: 1250,
  9: 1875,
  10: 2800,
};

const EXTRA_COSTS = {
  gadget: 1000,
  starPower: 2000,
  gearSuperRare: 1000,
  gearEpic: 1500,
  gearMythic: 2000,
  hypercharge: 5000,
  buffieCoin: 1000,
  buffiePP: 2000,
};

const UNLOCK_LEVELS = {
  gadget: 7,
  starPower: 9,
  gear: 8,
  hypercharge: 11,
};

const startRangeEl = document.getElementById("startRange");
const targetRangeEl = document.getElementById("targetRange");
const rangeFillEl = document.getElementById("rangeFill");
const startLevelValueEl = document.getElementById("startLevelValue");
const targetLevelValueEl = document.getElementById("targetLevelValue");

const gearSuperRareRangeEl = document.getElementById("gearSuperRareRange");
const gearCountValueEl = document.getElementById("gearCountValue");

const hcCheckedEl = document.getElementById("hcChecked");
const gearEpicCheckedEl = document.getElementById("gearEpicChecked");
const gearMythicCheckedEl = document.getElementById("gearMythicChecked");

const buffieGadgetEl = document.getElementById("buffieGadget");
const buffieStarEl = document.getElementById("buffieStar");
const buffieHyperEl = document.getElementById("buffieHyper");

const ppTotalEl = document.getElementById("ppTotal");
const coinTotalEl = document.getElementById("coinTotal");
const breakdownListEl = document.getElementById("breakdownList");

const gadgetRadios = [...document.querySelectorAll('input[name="gadgetCount"]')];
const spRadios = [...document.querySelectorAll('input[name="spCount"]')];

const gadgetCardEl = document.getElementById("gadgetCard");
const spCardEl = document.getElementById("spCard");
const gearCardEl = document.getElementById("gearCard");
const specialGearCardEl = document.getElementById("specialGearCard");
const hcCardEl = document.getElementById("hcCard");

function toNum(value) {
  return Number.parseInt(value, 10) || 0;
}

function format(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function setRadioValue(name, value) {
  const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (radio) {
    radio.checked = true;
  }
}

function getRadioValue(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? toNum(selected.value) : 0;
}

function levelCosts(startLevel, targetLevel) {
  if (targetLevel <= startLevel) {
    return { pp: 0, coin: 0 };
  }

  let pp = 0;
  let coin = 0;

  for (let level = startLevel; level < targetLevel; level += 1) {
    pp += LEVEL_PP[level] || 0;
    coin += LEVEL_COIN[level] || 0;
  }

  return { pp, coin };
}

function updateRangeFill(start, target) {
  const min = 1;
  const max = 11;
  const left = ((start - min) / (max - min)) * 100;
  const right = ((target - min) / (max - min)) * 100;
  rangeFillEl.style.left = `${left}%`;
  rangeFillEl.style.right = `${100 - right}%`;
}

function normalizeRange(source) {
  let start = toNum(startRangeEl.value);
  let target = toNum(targetRangeEl.value);

  if (start > target) {
    if (source === "start") {
      target = start;
      targetRangeEl.value = String(target);
    } else {
      start = target;
      startRangeEl.value = String(start);
    }
  }

  return { start, target };
}

function lockRadioGroup(radios, locked) {
  radios.forEach((radio) => {
    if (radio.value === "0") {
      radio.disabled = false;
    } else {
      radio.disabled = locked;
    }
  });
}

function setCardLocked(card, locked) {
  card.classList.toggle("locked", locked);
}

function applyUnlockRules(target) {
  const gadgetLocked = target < UNLOCK_LEVELS.gadget;
  if (gadgetLocked) {
    setRadioValue("gadgetCount", 0);
  }
  lockRadioGroup(gadgetRadios, gadgetLocked);
  setCardLocked(gadgetCardEl, gadgetLocked);

  const spLocked = target < UNLOCK_LEVELS.starPower;
  if (spLocked) {
    setRadioValue("spCount", 0);
  }
  lockRadioGroup(spRadios, spLocked);
  setCardLocked(spCardEl, spLocked);

  const gearLocked = target < UNLOCK_LEVELS.gear;
  if (gearLocked) {
    gearSuperRareRangeEl.value = "0";
    gearEpicCheckedEl.checked = false;
    gearMythicCheckedEl.checked = false;
  }
  gearSuperRareRangeEl.disabled = gearLocked;
  gearEpicCheckedEl.disabled = gearLocked;
  gearMythicCheckedEl.disabled = gearLocked;
  setCardLocked(gearCardEl, gearLocked);
  setCardLocked(specialGearCardEl, gearLocked);

  const hcLocked = target < UNLOCK_LEVELS.hypercharge;
  if (hcLocked) {
    hcCheckedEl.checked = false;
  }
  hcCheckedEl.disabled = hcLocked;
  setCardLocked(hcCardEl, hcLocked);
}

function calculate() {
  const { start, target } = normalizeRange("none");
  applyUnlockRules(target);

  const base = levelCosts(start, target);

  const gadgetCount = getRadioValue("gadgetCount");
  const spCount = getRadioValue("spCount");
  const gearSuperRareCount = Math.min(Math.max(toNum(gearSuperRareRangeEl.value), 0), 6);
  const gearEpicCount = gearEpicCheckedEl.checked ? 1 : 0;
  const gearMythicCount = gearMythicCheckedEl.checked ? 1 : 0;
  const hcCount = hcCheckedEl.checked ? 1 : 0;

  const buffieGadget = buffieGadgetEl.checked ? 1 : 0;
  const buffieStar = buffieStarEl.checked ? 1 : 0;
  const buffieHyper = buffieHyperEl.checked ? 1 : 0;
  const totalBuffies = buffieGadget + buffieStar + buffieHyper;

  const extrasCoin =
    gadgetCount * EXTRA_COSTS.gadget +
    spCount * EXTRA_COSTS.starPower +
    gearSuperRareCount * EXTRA_COSTS.gearSuperRare +
    gearEpicCount * EXTRA_COSTS.gearEpic +
    gearMythicCount * EXTRA_COSTS.gearMythic +
    hcCount * EXTRA_COSTS.hypercharge +
    totalBuffies * EXTRA_COSTS.buffieCoin;

  const extrasPP = totalBuffies * EXTRA_COSTS.buffiePP;

  startLevelValueEl.textContent = String(start);
  targetLevelValueEl.textContent = String(target);
  gearCountValueEl.textContent = String(gearSuperRareCount);
  updateRangeFill(start, target);

  ppTotalEl.textContent = format(base.pp + extrasPP);
  coinTotalEl.textContent = format(base.coin + extrasCoin);

  breakdownListEl.innerHTML = "";
  const ppIcon = '<img class="inline-icon" src="./assets/icons/power_points.svg" alt="PP" />';
  const coinIcon = '<img class="inline-icon" src="./assets/icons/gold.svg" alt="Coin" />';
  const lines = [
    `Levels ${start} to ${target}: ${format(base.pp)} ${ppIcon} + ${format(base.coin)} ${coinIcon}`,
    `Gadget x${gadgetCount}: ${format(gadgetCount * EXTRA_COSTS.gadget)} ${coinIcon}`,
    `Star Power x${spCount}: ${format(spCount * EXTRA_COSTS.starPower)} ${coinIcon}`,
    `Super Rare Gear x${gearSuperRareCount}: ${format(gearSuperRareCount * EXTRA_COSTS.gearSuperRare)} ${coinIcon}`,
    `Epic Gear x${gearEpicCount}: ${format(gearEpicCount * EXTRA_COSTS.gearEpic)} ${coinIcon}`,
    `Mythic Gear x${gearMythicCount}: ${format(gearMythicCount * EXTRA_COSTS.gearMythic)} ${coinIcon}`,
    `Hypercharge x${hcCount}: ${format(hcCount * EXTRA_COSTS.hypercharge)} ${coinIcon}`,
    `Buffies x${totalBuffies}: ${format(extrasPP)} ${ppIcon} + ${format(totalBuffies * EXTRA_COSTS.buffieCoin)} ${coinIcon}`,
  ];

  lines.forEach((line) => {
    const li = document.createElement("li");
    li.innerHTML = line;
    breakdownListEl.append(li);
  });
}

function bindEvents() {
  startRangeEl.addEventListener("input", () => {
    normalizeRange("start");
    calculate();
  });

  targetRangeEl.addEventListener("input", () => {
    normalizeRange("target");
    calculate();
  });

  gearSuperRareRangeEl.addEventListener("input", calculate);

  [
    ...gadgetRadios,
    ...spRadios,
    hcCheckedEl,
    gearEpicCheckedEl,
    gearMythicCheckedEl,
    buffieGadgetEl,
    buffieStarEl,
    buffieHyperEl,
  ].forEach((el) => el.addEventListener("change", calculate));

  document.getElementById("resetAll").addEventListener("click", () => {
    applyDefaultState();
    calculate();
  });
}

function applyDefaultState() {
  startRangeEl.value = "1";
  targetRangeEl.value = "11";

  setRadioValue("gadgetCount", 1);
  setRadioValue("spCount", 1);

  gearSuperRareRangeEl.value = "2";
  hcCheckedEl.checked = true;
  gearEpicCheckedEl.checked = false;
  gearMythicCheckedEl.checked = false;

  buffieGadgetEl.checked = true;
  buffieStarEl.checked = true;
  buffieHyperEl.checked = true;
}

function initialize() {
  bindEvents();
  applyDefaultState();
  calculate();
}

initialize();
