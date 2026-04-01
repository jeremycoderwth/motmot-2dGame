import k from "./kaplayCtx.js";
import { loadAssets, createUIButtons, gameInit, gameOver, winnerOverlay } from "./utilities.js";

export default function App() {
    const SPEED = 480; // speed of kat
    // 10 levels for now
    const LEVELS = [
        [
            "@  ^ $ $ * ^ #   $  >",
            "====================="
        ],
        [
            "@    $   ^     * $$ >",
            "==  === ====  ======="
        ],
        [
            "@  *  #   #   ^  $$ >",
            "== == == ==== == ===="
        ],
        [
            "@    *    ##    ^   >",
            "====================="
        ],
        [
            "@   $    $    ^     >",
            "== === ==== ===== ==="
        ],
        [
            " $    #   @   #     >",
            "====================="
        ],
        [
            "@          $        >",
            "====================="
        ],
        [
            "@              <    >",
            "====================="
        ],
        [
            "@    $    $         >",
            "====================="
        ],
        [
            "@ ^^  ^^  ^^  ^^  $ >",
            "====================="
        ]
    ];

    let isTutorialHasBeenShown = false; // for displaying tutorial UI

    loadAssets(); // load all neccessary assets

    k.scene("game", ({ levelIdx, score }) => {
        k.setGravity(3100); // gravity in the game

        let scoreMultplier = 2; // multiplier when bubby got start

        let totalScore = score;

        // custom bg which is sky
        k.add([
            k.sprite("sky"),
            k.pos(k.width(), k.height()),
            k.anchor("center"),
            k.z(0),
            'custom-bg'
        ]);

        // display for the score
        const scoreText = k.add([
            k.text(`SCORE : ${totalScore}`, { size: 48 }),
            k.pos(20, 20),
            k.z(2),
        ]);

        if (!isTutorialHasBeenShown) {
            // bg for mini-tutorial
            const bgGameControlText = k.add([
                k.rect(800, 200, { radius: 8 }),
                k.pos(k.center().x, k.center().y),
                k.z(5),
                k.outline(4),
                k.anchor("center"),
                k.area(),
                k.color(255, 250, 245),
                "mini-tutorial-ui"
            ]);

            // display text for controls in the game
            bgGameControlText.add([
                k.text(`
                    Press Space/W/Arrow Up/Jump to jump
                    Press Arrow Right, D to move forward
                    Press Arrow Left, A to move backward
                    
                    [Press enter or tap this to start]
                `, { size: 24 }),
                k.z(6),
                k.pos(-180, 0),
                k.area(),
                k.anchor("center"),
                k.color(0, 0, 0),
                "mini-tutorial-ui"
            ]);

            // controls diplay removed when pressed any of these keys
            k.onKeyPress(["enter"], () => {
                k.destroy(bgGameControlText);
                // k.destroyAll('mini-tutorial-ui');
                isTutorialHasBeenShown = true;
            }); 
            k.onClick("mini-tutorial-ui", () => {
                k.destroy(bgGameControlText);
                // k.destroyAll('mini-tutorial-ui');
                isTutorialHasBeenShown = true;
            });
        }

        // make the game with levels defined
        const level = k.addLevel(LEVELS[levelIdx || 0], {
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
                "$": () => [
                    k.sprite("heart"),
                    k.area({ isSensor: true}),
                    k.anchor("bot"),
                    "heart",
                ],
                "*": () => [
                    k.sprite("star"),
                    k.anchor("bot"),
                    k.area({ isStatic: true }),
                    "star",
                ],
                "^": () => [
                    k.sprite("spike"),
                    k.area({ isSensor: true }),
                    k.anchor("bot"),
                    "danger",
                ],
                "#": () => [
                    k.sprite("ghosty"),
                    k.area({ isSensor: true }),
                    k.anchor("bot"),
                    "enemy",
                ],
                ">": () => [
                    k.sprite("portal"),
                    k.area({ isStatic: true }),
                    k.anchor("bot"),
                    k.opacity(1),
                    "portal",
                ],
                "<": () => [
                    k.sprite("zombean"),
                    k.anchor("bot"),
                    k.area({ isSensor: true }),
                    k.state("idle", ["idle", "shot", "move"]),
                    "zombie"
                ],
            },
        });

        // get the player obj from level
        const kat = level.get("kat")[0];

        // get the zombie obj and portal obj from level 
        const zombie = level.get("zombie")[0];
        const portal = level.get("portal")[0];

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

        // collision detections in the game
        kat.onCollide("danger", () => {
            kat.pos = level.tile2Pos(0, 0);
            gameOver(gameInit);
            k.go("lose");
        });

        kat.onCollide("enemy", () => {
            kat.pos = level.tile2Pos(0, 0);
            gameOver(gameInit);
            k.go("lose");
        });

        if (levelIdx === 7) {
            if (portal) {
                portal.opacity = 0;
                portal.use(k.opacity(0));
            }

            k.wait(10, () => {
                if (portal) {
                    portal.opacity = 1;
                    k.play("bean_voice");
                }
            });
        }

        // a zombie
        if (zombie) {
            zombie.onStateEnter("idle", async () => {
                await k.wait(0.2);
                zombie.enterState("shot");
            });

            zombie.onStateEnter("shot", async () => {
                if (kat.exists()) {
                    const p1 = zombie.worldPos();
                    const p2 = kat.worldPos();
                    const dir = p2.sub(p1).unit();

                    k.add([
                        k.pos(p1),
                        k.move(dir, 350),
                        k.sprite("firing", { anim: "anim", animSpeed: 2 }), 
                        k.area(),
                        k.offscreen({ destroy: true }),
                        k.anchor("center"),
                        k.rotate(dir.angle() - 90),
                        k.scale(0.8),
                        "fireball",
                    ]);
                }

                await k.wait(1);
                zombie.enterState("move");
            });

            zombie.onStateEnter("move", async () => {
                await k.wait(1);
                zombie.enterState("idle");
            });

            zombie.onStateUpdate("move", () => {
                if (!kat.exists()) return;

                const dir = kat.pos.sub(zombie.pos).unit();
                zombie.move(dir.scale(150));
            });

            kat.onCollide("zombie", () => {
                kat.pos = level.tile2Pos(0, 0);
                gameOver(gameInit);
                k.go("lose");
            });

            kat.onCollide("fireball", (fireball) => {
                k.destroy(fireball);
                k.destroy(kat);
                k.addKaboom(fireball.pos);
                k.wait(1.5, () => {
                    gameOver(gameInit);
                    k.go('lose');
                });
            });
        }

        kat.onCollide("heart", (heart) => {
            k.destroy(heart);
            k.play("mark_voice");
            scoreText.text = `SCORE : ${totalScore = totalScore + 1}`;
        });

        kat.onCollide("star", (star) => {
            k.destroy(star);
            k.play("mark_voice");
            scoreText.text = `SCORE : ${totalScore = totalScore * scoreMultplier}`;
        });

        // if the kat falls down, game lose
        kat.onUpdate(() => {
            if (kat.pos.y >= 400) {
                gameOver(gameInit);
                k.go('lose');
            }
        });

        // when collision with portal detected, proceed to next level
        kat.onCollide("portal", () => {
            if (portal && portal.opacity === 1) {
                if (levelIdx < LEVELS.length - 1) {
                    k.play("bean_voice");
                    k.go("game", {
                        levelIdx: levelIdx + 1,
                        score: totalScore
                    });
                } else {
                    winnerOverlay(totalScore);
                }
            } else {
                k.debug.log("The portal is not ready yet! Go bebe, kaya mo yannnn lezgo");
            }
        });
    });

    gameInit();
    //specialSegmentInit();
    
    return (
        <div id="canvas"></div>
    );
}