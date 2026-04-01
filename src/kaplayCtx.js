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
    debug: true,
    pixelDensity: window.devicePixelRatio,
    background: [141, 183, 255],
    root: document.getElementById("canvas"),
});

export default k;