import k from "./kaplayCtx";

export function makeKat() {
    return k.add([
        k.sprite("kat"),
        k.area(),
        k.pos(100, 100),
        k.anchor("center"),
        k.body({ jumpForce: 1700 }),
        "kat",
    ]);
}

export function makeHeart() {
    return k.add([
        k.sprite("heart"),
        k.area({ isSensor: true}),
        k.anchor("center"),
        "heart",
    ]);
}

export function makeGhost() {
    return k.add([
        k.sprite("ghosty"),
        k.area({ isSensor: true }),
        k.anchor("center"),
        "enemy",
    ]);
}

export function makeSpike() {
    return k.add([
        k.sprite("spike"),
        k.area({ isSensor: true }),
        k.anchor("center"),
        "danger",
    ]);
}

export function makePortal() {
    return k.add([
        k.sprite("portal"),
        k.area({ isStatic: true }),
        k.anchor("center"),
        "portal",
    ]);
}

export function makeGrass() {
    return k.add([
        k.sprite("grass"),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("bot"),
        "grass"
    ]);
}

export function makeStar() {
    return k.add([
        k.sprite("star"),
        k.anchor("center"),
        k.area({ isStatic: true }),
        "star",
    ]);
}

// special levels
export const SPECIAL_LEVELS = [
    [
        "@           !       >",
        "====================="
    ],
    [
        "@       %           >",
        "====================="
    ],
    [
        "@               ?   >",
        "====================="
    ]
];

// key object with its own randomizer
const randomMap = {
    posX: () => Math.floor(Math.random() * (1000 - 10 + 1)) + 10,
    posY: () => Math.floor(Math.random() * (600 - 10 + 1)) + 10,
    speed: () => Math.floor(Math.random() * (5 - 1 + 1)) + 1
};

function generateRandomHeartObject(randomMap) {
    if (typeof randomMap !== "object" || randomMap === null) {
        throw new Error("keyRandomMap must be a non-null object.");
    }

    const resultObj = {};
    for (const [key, randomFn] of Object.entries(randomMap)) {
        if (typeof key !== "string" || key.trim() === "") {
            throw new Error("Each key must be a non-empty string.");
        }
        if (typeof randomFn !== "function") {
            throw new Error(`Value for key "${key}" must be a function.`);
        }

        const value = randomFn();
        if (typeof value !== "number" || Number.isNaN(value)) {
            throw new Error(`Random function for key "${key}" must return a valid number.`);
        }

        resultObj[key] = value;
    }

    return resultObj;
}

export const hearts = [];
const motmot = 20;

for (let i = 0; i < motmot; i++) {
    hearts.push(generateRandomHeartObject(randomMap));
}

export const messagesArray = [
    {
        id: 1,
        message: `
            HAPPY MONTHSARY, BUBBYY!!  20th motmot na natin and we're still together no and andito pa rin ang love pati beat HAHAHAHHA eme pero di naman nagbago and wlala pa rin naman nagbago. This past few days is may tampuhan or kainisan na nangyari and ik u hate me non pero it doesn't matter kasi we're here pa rin with the same love and bond and siguro wish ko lang naman satin is sana mas tumibay pa lalo na this time medyo mahina ang business and napapadalang ang date so sana andon pa rin ang excitement pag magkikita man tayo kasi iiyak ako pag hindi like be prank mo na ako paulit-ulit okay lang pero pag pagod ka na or di mo na ako need, di ko kaya yon and sana more love and growth for the both of us. Sana this month is full of surprises pa rin and sana magkita na us kasi te miss na miss na kita and di ko alam if kakayanin ko pa. Ang gusto ko lang naman is una, ikaw pa rin, and syempre maging maayos life mo like ma-achieve mo pa mga gusto and magawa mo pa lahat ng ikakasaya mo kasi deserve mo po yan kasi sa lahat ng nakilala ko na tao sa balat ng lupa, wala nang papantay pa sayo like in all aspects kasi you're so amazing, talented, skillful, intelligent, ka-strong and ka-stable and such kahit na mahirap yung situation mo tapos kaya mo harapin ket mag-isa like im very proud of you and i will always admire you. Ikaw na yan e bubby, im in love talaga like just the way you are. Wish ko lang din sana mas maging gentle ka pa sa self mo and sana unahin mo sarili mo, di man kita maalagaan pa ng buong-buo kasi di pa us magkasama sa araw-araw pero pag sa mga times na wala ako or di ako makakapunta or what, make sure na safe ka and always be careful di lang sa pisikal  ah pati rin sa emotions mo. Take care of your mental health too kasi mahalaga rin yan. If may problem ka man, sabihin mo lang lagi or kahit thoughts man yan basta i-share mo sakin para rin di mabigat sayo. Or kahit na di ako yung maisip mo na pagsabihan ng ibang bagay, okay lang, at least may support ka and napapakinggan ka nila kasi ikaw ang mahalaga at ang sarili mo so please wag mo i-contain lang sa sarili mo if di mo na kaya ah.
        `
    }, 
    {
        id: 2,
        message: `
            Tsaka pala i know im so broke like barya nalang meron me pero please sana nandon pa rin tiwala and yung nakikita mong potential sakin :(( im doing my best para mapalago sarili ko and mag-invest pa more sa sarili kaya sana kasama pa rin kita until maabot ko na paisa-isa. I know it's just a phase lang and i believe magpa-pay off din mga hirap and efforts ko. I can't promise pero ang assurance ko lang is handa ako sa araw-araw para tumayo and magsikap sa buhay and maging responsible and maayos problem ko and thank you kasi may support pa rin ako from you and sana mafeel ko yan lagi when the life this hard lalo na this time.
        `
    },
    {
        id: 3,
        message: `
            And wish ko lang naman for us is maging strong and maabot natin dreams natin and advance good luck sa exam hehe. And bubby, sorry if naging incompetent and bad bf/partner ako sayo and mas sisikapan ko pa para mafeel mo ulit na deserve mo ko as your man. Ang gusto ko lang is magpatuloy pa kung anong meron tayo and sana di mawala. I'm here always pag need mo ko, if di man andito pa rin ako for u kahit ayaw man nila, wag kang mahihiya magsabi sa'kin ng anything. Miss na miss ko na ikaw talagaa huhu parang iiyak na ako pero sana magkita na us soon kasi miss ko na rin date day and all. Happy 20th Monthsary to us, bebe! i love you so much and gaya ng dati, i love you always and in any ways MWAHHHH
        `
    }
];

export const messages = {
    message1: `
        HAPPY MONTHSARY, BUBBYY!!  20th motmot na natin and we're still together noh and andito pa rin ang love pati beat HAHAHAHHA eme pero di naman nagbago and nababasa mo to siguro tapos na motmot natin but its your game so please play it pag stress ka or overwhelmed sa school. Sana this month is full of surprises pa rin and sana magkita na us kasi te miss na miss na kita and di ko alam if kakayanin ko pa. Ang gusto ko lang naman is una, ikaw pa rin, wala na akong hahanapin and every day goes by mas nagiging sure ako sa life ko in future kasama ka and nothing can change my mind.
    `,
    message2: `
        Ikaw na yan bubby, im in love talaga like just the way you are. Wish ko lang din sana mas maging gentle ka pa sa self mo and sana unahin mo sarili mo, di man kita maalagaan pa ng buong-buo kasi di pa us magkasama sa araw-araw pero pag sa mga times na wala ako or di ako makakapunta or what, make sure na safe ka and always be careful di lang sa pisikal ah pati rin sa emotions mo. Take care of your mental health too kasi mahalaga rin yan. If may problem ka man, sabihin mo lang lagi or kahit thoughts man yan basta i-share mo sakin para rin di mabigat sayo. Or kahit na di ako yung maisip mo na pagsabihan ng ibang bagay, okay lang, at least may support ka and napapakinggan ka nila kasi ikaw ang mahalaga at ang sarili mo so please wag mo i-contain lang sa sarili mo if di mo na kaya ah. 
    `,
    message3: `
        I'm very grateful lagi kasi i have you and i have someone na very important and natatangi, wish ko lang satin is growth pa and maging successful even sa little things lalo na ikaw. Kung umabot ka here po, congrats bubby hihi i love you so much. Happy 20th Monthsary to us, bebe! i love you so much and gaya ng dati, i love you always and in any ways MWAHHHH!
    `,
    message4: `
        P.S suggest ka pa ng idaragdag na features here or kung anong update gusto mong gawin ko kasi basically it's your game rin since i made it for you. Yun lang my love, bye bye i wuv u mwah ^3^
    `
};