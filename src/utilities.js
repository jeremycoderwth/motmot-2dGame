import k from "./kaplayCtx";
import { hearts, SPECIAL_LEVELS, messages } from "./entities";

export function loadAssets() {
    // sprites
    k.loadCrew("sprite", "kat");
    k.loadCrew("sprite", "ghosty");
    k.loadCrew("sprite", "heart");
    k.loadCrew("sprite", "portal");
    k.loadCrew("sprite", "grass");
    k.loadCrew("sprite", "spike");
    k.loadCrew("sprite", "star");
    k.loadCrew("sprite", "firing");
    k.loadCrew("sprite", "sparkling-o");
    k.loadCrew("sprite", "meat");
    k.loadCrew("sprite", "cake");
    k.loadCrew("sprite", "egg");
    k.loadCrew("sprite", "heart-o");
    k.loadCrew("sprite", "zombean");
    k.loadCrew("sprite", "star");
    k.loadCrew("sprite", "moon");
    k.loadCrew("sprite", "flowy");

    // font
    k.loadCrew("font", "happy");
    k.loadFont("cheri", "/fonts/cheri.TTF");

    // ui
    k.loadCrew("sprite", "arrow");

    // backgrounds
    k.loadSprite("sky", "/backgrounds/sky-bg.jpg");
    k.loadSprite("sunset", "/backgrounds/sunset-sky.jpg");

    // sound effects
    k.loadCrew("sound", "mark_voice");
    k.loadCrew("sound", "bean_voice");
    k.loadCrew("sound", "burp");
}

export function gameInit() {
    // start with the game scene with the initial values
    k.releaseButton("left");
    k.releaseButton("right");
    k.releaseButton("jump");

    k.go("game", {
        levelIdx: 0,
        score: 0,
    });
}

export function gameOver(restart) {
    k.scene("lose", () => {
        k.add([
            k.text("You lose, bebe. Please try again po"),
            k.pos(220, k.center().y),
        ]);

        const retry = () => restart();
        
        k.onKeyPress(["space", "enter"], retry);
        k.onMousePress("left", retry);
    });
}

export function winnerOverlay(score) {
    // overlay
    k.add([
        k.rect(k.width(), k.height()),
        k.pos(k.center()),
        k.anchor("center"),
        k.color(141, 183, 255),
        'win-overlay'
    ]);

    const congratsOverlay = k.add([
        k.rect(800, 200, { radius: 8 }),
        k.color(245, 250, 245),
        k.outline(4),
        k.pos(350, 250),
        k.z(20),
        k.area(),
        'win-overlay'
    ]);

    congratsOverlay.add([
        k.text(`Yey!! You grabbed ${score} hearts! Well done, my love hihi<3`, { size: 30, width: 700, align: "center" }),
        k.pos(395, 100),
        k.anchor("center"),
        k.color(194, 9, 102),
        'win-overlay'
    ]);

    const sparkleBIg1 = k.add([
        k.sprite("sparkling-o", { anim: "anim", animSpeed: 2 }),
        k.anchor("center"),
        k.pos(1145, 250),
        k.z(25),
        k.scale(1.5),
        'win-overlay'
    ]);

    const sparkleSmall1 = k.add([
        k.sprite("sparkling-o", { anim: "anim", animSpeed: 1 }),
        k.anchor("center"),
        k.pos(1090, 250),
        k.z(25),
        'win-overlay'
    ]);

    const sparkleSmall2 = k.add([
        k.sprite("sparkling-o", { anim: "anim", animSpeed: 1.5 }),
        k.anchor("center"),
        k.pos(1145, 300),
        k.z(25),
        'win-overlay'
    ]);

    const sparkleBig2 = k.add([
        k.sprite("sparkling-o", { anim: "anim", animSpeed: 2 }),
        k.anchor("center"),
        k.pos(355, 450),
        k.z(25),
        k.scale(1.5),
    ]);

    const sparkleSmall3 = k.add([
        k.sprite("sparkling-o", { anim: "anim", animSpeed: 1 }),
        k.anchor("center"),
        k.pos(355, 400),
        k.z(25),
        'win-overlay'
    ]);

    const sparkleSmall4 = k.add([
        k.sprite("sparkling-o", { anim: "anim", animSpeed: 1.5 }),
        k.anchor("center"),
        k.pos(410, 450),
        k.z(25),
        'win-overlay'
    ]);

    hearts.forEach((heart) => {
        k.add([
            k.sprite("heart-o"),
            k.pos(heart.posX, heart.posY),
            k.anchor("center"),
            'hearteu'
        ]);
    });

    // random spawns of heart


    k.onKeyPress(specialSegmentInit);
    specialSegment();
}

export function specialSegmentInit() {
    k.go('special', { levelIdx: 0 });
}

export function specialSegment() {
    k.scene('special', ({ levelIdx }) => {
        k.setGravity(3100); // game gravity

        const SPEED = 480; // speed of kat

        // sunset background
        k.add([
            k.sprite("sunset"),
            k.pos(k.width(), k.height()),
            k.anchor("center"),
            k.z(0),
            "sunset-bg"
        ]);

        // game levels
        const level = k.addLevel(SPECIAL_LEVELS[levelIdx || 0], {
            tileWidth: 64,
            tileHeight: 64,
            pos: k.vec2(100, k.center().y),
            tiles: {
                "@": () => [
                    k.sprite("kat"),
                    k.area(),
                    k.anchor("bot"),
                    k.body({ jumpForce: 1100 }),
                    k.pos(),
                    "kat",
                ],
                "=": () => [
                    k.sprite("grass"),
                    k.area(),
                    k.body({ isStatic: true }),
                    k.anchor("bot"),
                    "grass"
                ],
                ">": () => [
                    k.sprite("portal"),
                    k.area({ isStatic: true }),
                    k.anchor("bot"),
                    "portal",
                ],
                "!": () => [
                    k.sprite("meat"),
                    k.area({ isSensor: true }),
                    k.anchor("bot"),
                    "meat"
                ],
                "%": () => [
                    k.sprite("egg"),
                    k.area({ isSensor: true }),
                    k.anchor("bot"),
                    "egg"
                ],
                "?": () => [
                    k.sprite("cake"),
                    k.area({ isSensor: true }),
                    k.anchor("bot"),
                    "cake"
                ]
            }
        });

        // get the player obj from level
        const kat = level.get("kat")[0];

        // if bubby using her phone or iPad
        createUIButtons(kat);

        // movements (for keyboard, mouse, gamepad)
        k.onKeyPress(["space", "up", "w"], () => {
            if (kat.isGrounded()) {
                kat.jump();
            }
        });

        k.onKeyDown(["left", "a"], () => {
            kat.move(-SPEED, 0);
        });

        k.onKeyDown(["right", "d"], () => {
            kat.move(SPEED, 0);
        });

        // collisions detections in this special game
        kat.onCollide("meat", (meat) => {
            k.destroy(meat);
            k.play("mark_voice");
            popupMessageHeart(messages.message1);
        });

        kat.onCollide("egg", (egg) => {
            k.destroy(egg);
            k.play("mark_voice");
            popupMessageStar(messages.message2);
        });

        kat.onCollide("cake", (cake) => {
            k.destroy(cake);
            k.play("mark_voice");
            popupMessageMoon(messages.message3);
        });

        k.wait(1, () => {
            confettiRain(5);
        });

        kat.onCollide("portal", () => {
            if (levelIdx < SPECIAL_LEVELS.length - 1) {
                k.play("bean_voice");
                k.go("special", {
                    levelIdx: levelIdx + 1
                });
            } else {
                gameInit();
            }
        });
    });
}

export function createUIButtons(katObj) {
    if (!isMobileDevice()) return null;

    const SPEED = 480;
    // Map to link Touch ID -> Action Name
    const activeTouches = new Map();

    // 1. Setup Buttons
    const leftBtn = k.add([
        k.circle(38),
        k.pos(150, k.height() - 100),
        k.color(0, 0, 0),
        k.opacity(0.5),
        k.area(),
        k.fixed(),
        k.z(10),
        k.anchor("center"),
        "mobile-btn",
        { action: "left" }
    ]);

    const rightBtn = k.add([
        k.circle(38),
        k.pos(280, k.height() - 100),
        k.color(0, 0, 0),
        k.opacity(0.5),
        k.area(),
        k.fixed(),
        k.z(10),
        k.anchor("center"),
        "mobile-btn",
        { action: "right" }
    ]);

    const jumpBtn = k.add([
        k.rect(140, 70, { radius: 10 }),
        k.pos(k.width() - 150, k.height() - 100),
        k.color(0, 0, 0),
        k.opacity(0.5),
        k.area(),
        k.fixed(),
        k.z(10),
        k.anchor("center"),
        "mobile-btn",
        { action: "jump" }
    ]);

    // 2. Visuals
    leftBtn.add([k.sprite("arrow"), k.anchor("center"), k.rotate(180)]);
    rightBtn.add([k.sprite("arrow"), k.anchor("center")]);
    jumpBtn.add([k.text("JUMP", { size: 24 }), k.anchor("center")]);

    // 3. Robust Touch Events
    k.onTouchStart((pos, t) => {
        // We find which button was hit at the START of the touch
        const btn = k.get("mobile-btn").find((b) => b.hasPoint(pos));
        if (btn) {
            activeTouches.set(t.id, btn.action);
            k.pressButton(btn.action);
            btn.opacity = 0.8;
        }
    });

    k.onTouchEnd((pos, t) => {
        // IMPORTANT: We do NOT check hasPoint(pos) here.
        // We just check if this specific touch ID was tied to an action.
        const action = activeTouches.get(t.id);
        if (action) {
            k.releaseButton(action);
            activeTouches.delete(t.id);

            // Reset visual opacity
            k.get("mobile-btn").forEach(b => {
                if (b.action === action) b.opacity = 0.5;
            });
        }
    });

    // 4. Clean Movement (Inside onUpdate to prevent listener stacking)
    katObj.onUpdate(() => {
        if (k.isButtonDown("left")) {
            katObj.move(-SPEED, 0);
        }
        if (k.isButtonDown("right")) {
            katObj.move(SPEED, 0);
        }
    });

    // Jump logic using virtual button
    k.onButtonPress("jump", () => {
        if (katObj.isGrounded()) {
            katObj.jump();
        }
    });

    return { leftBtn, rightBtn, jumpBtn };
}

export function isMobileDevice() {
    return (
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
}

export function popupMessageHeart(message = "Happy Monthsary!") {
    // overlay for message
    const msgOverlay = k.add([
        k.rect(1000, 650, { radius: 8 }),
        k.color(240, 250, 245),
        k.outline(4, k.color(176, 25, 74)),
        k.pos(k.center()),
        k.anchor("center"),
        k.area(),
        k.z(20),
        "popup"
    ]);

    // message
    msgOverlay.add([
        k.text(message, { font: 'cheri', size: 24, width: 900, align: "left", lineSpacing: 8 }),
        k.color(186, 75, 22),
        k.anchor("center"),
        k.z(25),
        k.pos(0, 0),
        k.area(),
        "popup"
    ]);

    // heart decor
    const bigHeart = k.add([
        k.sprite("heart"),
        k.pos(1250, 60),
        k.anchor("center"),
        k.scale(2),
        k.z(25),
        k.rotate(20),
        k.area(),
        "popup"
    ]);

    const smallHeart = k.add([
        k.sprite("heart"),
        k.pos(270, 400),
        k.anchor("center"),
        k.scale(0.8),
        k.rotate(20),
        k.z(25),
        k.area(),
        "popup"
    ]);

    const mediumHeart = k.add([
        k.sprite("heart"),
        k.pos(1245, 645),
        k.anchor("center"),
        k.scale(1.5),
        k.rotate(20),
        k.z(25),
        k.area(),
        "popup"
    ]);

    k.onKeyPress(["enter"], () => {
        k.destroy(msgOverlay);
        k.destroy(bigHeart);
        k.destroy(smallHeart);
        k.destroy(mediumHeart);
    }); 
    k.onClick("popup", () => {
        k.destroy(msgOverlay);
        k.destroy(bigHeart);
        k.destroy(smallHeart);
        k.destroy(mediumHeart);
    });
}

export function popupMessageStar(message = "Happy 20th Monthsary!") {
    // overlay for message
    const msgOverlay = k.add([
        k.rect(1000, 650, { radius: 8 }),
        k.color(240, 250, 245),
        k.outline(4, k.color(176, 25, 74)),
        k.pos(k.center()),
        k.anchor("center"),
        k.area(),
        k.z(20),
        "popup"
    ]);

    // message
    msgOverlay.add([
        k.text(message, { font: 'cheri', size: 24, width: 900, align: "left", lineSpacing: 8 }),
        k.color(189, 183, 31),
        k.anchor("center"),
        k.z(25),
        k.pos(0, 0),
        k.area(),
        "popup"
    ]);

    // star decor
    const bigStar = k.add([
        k.sprite("star"),
        k.pos(1250, 60),
        k.anchor("center"),
        k.scale(2),
        k.z(25),
        k.rotate(20),
        k.area(),
        "popup"
    ]);

    const smallStar = k.add([
        k.sprite("star"),
        k.pos(270, 400),
        k.anchor("center"),
        k.scale(0.8),
        k.rotate(20),
        k.z(25),
        k.area(),
        "popup"
    ]);

    const mediumStar = k.add([
        k.sprite("star"),
        k.pos(1245, 645),
        k.anchor("center"),
        k.scale(1.5),
        k.rotate(20),
        k.z(25),
        k.area(),
        "popup"
    ]);

    k.onKeyPress(["enter"], () => {
        k.destroy(msgOverlay);
        k.destroy(bigStar);
        k.destroy(smallStar);
        k.destroy(mediumStar);
    }); 
    k.onClick("popup", () => {
        k.destroy(msgOverlay);
        k.destroy(bigStar);
        k.destroy(smallStar);
        k.destroy(mediumStar);
    });
}

export function popupMessageMoon(message = "Happy Motmot, my loveyyyy!") {
    // overlay for message
    const msgOverlay = k.add([
        k.rect(1000, 650, { radius: 8 }),
        k.color(240, 250, 245),
        k.outline(4, k.color(176, 25, 74)),
        k.pos(k.center()),
        k.anchor("center"),
        k.area(),
        k.z(20),
        "popup"
    ]);

    // message
    msgOverlay.add([
        k.text(message, { font: 'cheri', size: 24, width: 900, align: "left", lineSpacing: 8 }),
        k.color(28, 31, 181),
        k.anchor("center"),
        k.z(25),
        k.pos(0, 0),
        k.area(),
        "popup"
    ]);

    // moon decor
    const bigMoon = k.add([
        k.sprite("moon"),
        k.pos(1250, 60),
        k.anchor("center"),
        k.scale(2),
        k.z(25),
        k.rotate(-20),
        k.area(),
        "popup"
    ]);

    const smallMoon = k.add([
        k.sprite("moon"),
        k.pos(270, 400),
        k.anchor("center"),
        k.scale(0.8),
        k.rotate(20),
        k.z(25),
        k.area(),
        "popup"
    ]);

    const mediumMoon = k.add([
        k.sprite("moon"),
        k.pos(1245, 645),
        k.anchor("center"),
        k.scale(1.5),
        k.rotate(20),
        k.z(25),
        k.area(),
        "popup"
    ]);

    k.onKeyPress(["enter"], () => {
        k.destroy(msgOverlay);
        k.destroy(bigMoon);
        k.destroy(smallMoon);
        k.destroy(mediumMoon);
    }); 
    k.onClick("popup", () => {
        k.destroy(msgOverlay);
        k.destroy(bigMoon);
        k.destroy(smallMoon);
        k.destroy(mediumMoon);
    });
}

export function popupMessageFire(message = "I love you, bubbab") {
    // overlay for message
    const msgOverlay = k.add([
        k.rect(1000, 650, { radius: 8 }),
        k.color(240, 250, 245),
        k.outline(4, k.color(176, 25, 74)),
        k.pos(k.center()),
        k.anchor("center"),
        k.area(),
        k.z(20),
        "popup"
    ]);

    // message
    msgOverlay.add([
        k.text(message, { font: 'cheri', size: 24, width: 900, align: "left", lineSpacing: 8 }),
        k.color(42, 125, 82),
        k.anchor("center"),
        k.z(25),
        k.pos(0, 0),
        k.area(),
        "popup"
    ]);

    // flower decor
    const bigFlower = k.add([
        k.sprite("flowy"),
        k.pos(1250, 60),
        k.anchor("center"),
        k.scale(2),
        k.z(25),
        k.rotate(-20),
        k.area(),
        "popup"
    ]);

    const smallFlower = k.add([
        k.sprite("flowy"),
        k.pos(270, 400),
        k.anchor("center"),
        k.scale(0.8),
        k.rotate(20),
        k.z(25),
        k.area(),
        "popup"
    ]);

    const mediumFlower = k.add([
        k.sprite("flowy"),
        k.pos(1245, 645),
        k.anchor("center"),
        k.scale(1.5),
        k.rotate(20),
        k.z(25),
        k.area(),
        "popup"
    ]);

    k.onKeyPress(["enter"], () => {
        k.destroy(msgOverlay);
        k.destroy(bigFlower);
        k.destroy(smallFlower);
        k.destroy(mediumFlower);
    }); 
    k.onClick("popup", () => {
        k.destroy(msgOverlay);
        k.destroy(bigFlower);
        k.destroy(smallFlower);
        k.destroy(mediumFlower);
    });
}

export function confettiRain(duration = 5, positions = []) {
    const rainLoop = k.loop(0.2, () => {
        const spawnPos = positions.length > 0 
        ? k.choose(positions) 
        : k.vec2(k.rand(0, k.width()), k.rand(0, k.height()));

        showConfetti({
            pos: spawnPos,
            count: 20,
        });
    });

    k.wait(duration, () => {
        rainLoop.cancel();
    });
}

function showConfetti(opt = {}) {
    const DEF_COUNT = 80;
    const DEF_GRAVITY = 800;
    const DEF_AIR_DRAG = 0.9;
    const DEF_VELOCITY = [1000, 4000];
    const DEF_ANGULAR_VELOCITY = [-200, 200];
    const DEF_FADE = 0.3;
    const DEF_SPREAD = 60;
    const DEF_SPIN = [2, 8];
    const DEF_SATURATION = 0.7;
    const DEF_LIGHTNESS = 0.6;

    const sample = (s) => typeof s === "function" ? s() : s;

	for (let i = 0; i < (opt.count ?? DEF_COUNT); i++) {
		const p = k.add([
			k.pos(sample(opt.pos ?? k.vec2(600, 200))),
			k.choose([
				k.rect(k.rand(5, 20), k.rand(5, 20)),
				k.circle(k.rand(3, 10)),
			]),
			k.color(sample(opt.color ?? k.hsl2rgb(k.rand(0, 1), DEF_SATURATION, DEF_LIGHTNESS))),
			k.opacity(1),
			k.lifespan(4),
			k.scale(1),
			k.anchor("center"),
			k.rotate(k.rand(0, 360)),
		]);

		const spin = k.rand(DEF_SPIN[0], DEF_SPIN[1]);
		const gravity = opt.gravity ?? DEF_GRAVITY;
		const airDrag = opt.airDrag ?? DEF_AIR_DRAG;
		const heading = sample(opt.heading ?? 0) - 90;
		const spread = opt.spread ?? DEF_SPREAD;
		const head = heading + k.rand(-spread / 2, spread / 2);
		const fade = opt.fade ?? DEF_FADE;
		const vel = sample(opt.velocity ?? k.rand(DEF_VELOCITY[0], DEF_VELOCITY[1]));
		let velX = Math.cos(k.deg2rad(head)) * vel;
		let velY = Math.sin(k.deg2rad(head)) * vel;
		const velA = sample(opt.angularVelocity ?? k.rand(DEF_ANGULAR_VELOCITY[0], DEF_ANGULAR_VELOCITY[1]));

		p.onUpdate(() => {
			velY += gravity * k.dt()
			p.pos.x += velX * k.dt()
			p.pos.y += velY * k.dt()
			p.angle += velA * k.dt()
			p.opacity -= fade * k.dt()
			velX *= airDrag
			velY *= airDrag
			p.scale.x = k.wave(-1, 1, k.time() * spin)
		});
	}
}
