import kaplay from "kaplay";
import { crew } from "@kaplayjs/crew";

const k = kaplay({
    plugins: [crew],
    width: 1500,
    height: 720,
    letterbox: true,
    font: 'happy',
    global: false,
    touchToMouse: true,
    buttons: {
        jump: {
            keyboard: ["space", "up", "w"],
        },
        left: {
            keyboard: ["left", "a"],
        },
        right: {
            keyboard: ["right", "d"],
        }
    },
    debug: true,
    pixelDensity: window.devicePixelRatio,
    background: [141, 183, 255],
    root: document.getElementById("canvas"),
});

export default k;