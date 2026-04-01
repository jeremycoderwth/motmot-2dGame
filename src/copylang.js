export function setEvents(gameObj, level, score = 0, scoreLabelObj, levelIdx, LEVELS = []) {
    gameObj.onCollide("danger", () => {
        gameObj.pos = level.tile2Pos(0, 0);
        gameObj.go("lose");
    });

    gameObj.onCollide("heart", (heart) => {
        gameObj.destroy(heart);
        gameObj.play("score");
        score++;
        scoreLabelObj.text = score;
    });

    gameObj.onUpdate(() => {
        if (gameObj.pos.y >= 400) {
            k.go("lose");
        }
    });

    gameObj.onCollide("portal", () => {
        k.play("portal"); // sound sfx when entering portal
        if (levelIdx < LEVELS.length - 1) {
            k.go("game", {
                levelIdx: levelIdx + 1,
                score: score,
            });
        } else {
            k.go("win", { score: score });
        }
    });

    gameObj.onCollide("ghosty", () => {
        // what will happen if kat collides with ghosty
    });
}