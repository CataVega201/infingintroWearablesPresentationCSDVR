document.addEventListener("DOMContentLoaded", function () {
    var vistaFieldHost = document.getElementById("vista_particle_field");
    var vistaParticleTotal = 70;
    var vistaBatchFragment = document.createDocumentFragment();
    var vistaRouteNodes = document.querySelectorAll(".vista_route_switch");
    var vistaPanelNodes = document.querySelectorAll(".vista_spa_panel");
    var vistaCardWraps = document.querySelectorAll(".vista_quienes_cardwrap");
    var vistaBulletLines = document.querySelectorAll(".vista_inicio_bullet_line");
    var vistaScrambleNodes = document.querySelectorAll(".vista_word_scramble");
    var vistaScrambleTimers = new WeakMap();

    for (var vistaIndex = 0; vistaIndex < vistaParticleTotal; vistaIndex++) {
        vistaBatchFragment.appendChild(vistaCreateParticle());
    }

    vistaFieldHost.appendChild(vistaBatchFragment);

    for (var vistaButtonIndex = 0; vistaButtonIndex < vistaRouteNodes.length; vistaButtonIndex++) {
        vistaRouteNodes[vistaButtonIndex].addEventListener("click", vistaSwitchPanelRoute);
    }

    for (var vistaCardIndex = 0; vistaCardIndex < vistaCardWraps.length; vistaCardIndex++) {
        vistaBindCardTilt(vistaCardWraps[vistaCardIndex]);
    }

    for (var vistaLineIndex = 0; vistaLineIndex < vistaBulletLines.length; vistaLineIndex++) {
        vistaBulletLines[vistaLineIndex].addEventListener("mouseenter", vistaStartWordAnimations);
        vistaBulletLines[vistaLineIndex].addEventListener("mouseleave", vistaStopWordAnimations);
    }

    for (var vistaScrambleIndex = 0; vistaScrambleIndex < vistaScrambleNodes.length; vistaScrambleIndex++) {
        vistaScrambleNodes[vistaScrambleIndex].textContent = vistaScrambleNodes[vistaScrambleIndex].getAttribute("data-vista-word");
    }

    vistaSetPanelState("vista_page_inicio");

    function vistaSwitchPanelRoute(vistaEventUnit) {
        var vistaPanelKey = vistaEventUnit.currentTarget.getAttribute("data-vista-section");
        vistaSetPanelState(vistaPanelKey);
    }

    function vistaSetPanelState(vistaPanelKey) {
        for (var vistaControlIndex = 0; vistaControlIndex < vistaRouteNodes.length; vistaControlIndex++) {
            var vistaControlUnit = vistaRouteNodes[vistaControlIndex];
            var vistaControlMatch = vistaControlUnit.getAttribute("data-vista-section") === vistaPanelKey;

            if (vistaControlMatch) {
                vistaControlUnit.classList.add("vista_route_switch_current");
                vistaControlUnit.setAttribute("aria-current", "page");
            } else {
                vistaControlUnit.classList.remove("vista_route_switch_current");
                vistaControlUnit.removeAttribute("aria-current");
            }
        }

        for (var vistaPanelIndex = 0; vistaPanelIndex < vistaPanelNodes.length; vistaPanelIndex++) {
            var vistaPanelUnit = vistaPanelNodes[vistaPanelIndex];
            var vistaPanelMatch = vistaPanelUnit.id === vistaPanelKey;

            if (vistaPanelMatch) {
                vistaPanelUnit.classList.add("vista_spa_panel_visible");
            } else {
                vistaPanelUnit.classList.remove("vista_spa_panel_visible");
            }
        }
    }

    function vistaStartWordAnimations(vistaEventUnit) {
        var vistaTargetLine = vistaEventUnit.currentTarget;
        vistaTargetLine.classList.add("vista_inicio_bullet_hover");

        var vistaScrambleTargets = vistaTargetLine.querySelectorAll(".vista_word_scramble");
        for (var vistaIndexUnit = 0; vistaIndexUnit < vistaScrambleTargets.length; vistaIndexUnit++) {
            vistaStartScramble(vistaScrambleTargets[vistaIndexUnit]);
        }
    }

    function vistaStopWordAnimations(vistaEventUnit) {
        var vistaTargetLine = vistaEventUnit.currentTarget;
        vistaTargetLine.classList.remove("vista_inicio_bullet_hover");

        var vistaScrambleTargets = vistaTargetLine.querySelectorAll(".vista_word_scramble");
        for (var vistaIndexUnit = 0; vistaIndexUnit < vistaScrambleTargets.length; vistaIndexUnit++) {
            vistaStopScramble(vistaScrambleTargets[vistaIndexUnit]);
        }
    }

    function vistaStartScramble(vistaWordUnit) {
        var vistaOriginalWord = vistaWordUnit.getAttribute("data-vista-word");
        var vistaAlphabetUnit = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var vistaStepIndex = 0;

        vistaStopScramble(vistaWordUnit);

        var vistaTimerUnit = setInterval(function () {
            var vistaNextWord = "";
            for (var vistaCharIndex = 0; vistaCharIndex < vistaOriginalWord.length; vistaCharIndex++) {
                if (vistaCharIndex < vistaStepIndex) {
                    vistaNextWord += vistaOriginalWord[vistaCharIndex];
                } else {
                    vistaNextWord += vistaAlphabetUnit[Math.floor(Math.random() * vistaAlphabetUnit.length)];
                }
            }
            vistaWordUnit.textContent = vistaNextWord;
            vistaStepIndex += 0.35;
        }, 36);

        vistaScrambleTimers.set(vistaWordUnit, vistaTimerUnit);
    }

    function vistaStopScramble(vistaWordUnit) {
        var vistaOriginalWord = vistaWordUnit.getAttribute("data-vista-word");
        var vistaTimerUnit = vistaScrambleTimers.get(vistaWordUnit);

        if (vistaTimerUnit) {
            clearInterval(vistaTimerUnit);
        }

        vistaWordUnit.textContent = vistaOriginalWord;
    }
});

function vistaCreateParticle() {
    var vistaDotUnit = document.createElement("div");
    vistaDotUnit.className = "vista_particle_spark";

    var vistaSizeUnit = Math.random() * 0.4 + 0.15;
    vistaDotUnit.style.width = vistaSizeUnit + "vw";
    vistaDotUnit.style.height = vistaSizeUnit + "vw";

    var vistaPosXUnit = Math.random() * 100;
    var vistaScatterUnit = (Math.random() - 0.5) * 22.5;
    var vistaSlopeUnit = -0.39375;
    var vistaOffsetUnit = 42.1875;
    var vistaPosYUnit = (vistaPosXUnit * vistaSlopeUnit) + vistaOffsetUnit + vistaScatterUnit;

    if (vistaPosYUnit < 0) {
        vistaPosYUnit = Math.random() * 11.25;
    }

    vistaDotUnit.style.left = vistaPosXUnit + "vw";
    vistaDotUnit.style.top = vistaPosYUnit + "vw";

    var vistaDurationUnit = Math.random() * 3 + 2;
    vistaDotUnit.style.animationDuration = vistaDurationUnit + "s";

    var vistaDelayUnit = Math.random() * 6;
    vistaDotUnit.style.animationDelay = vistaDelayUnit + "s";

    return vistaDotUnit;

}

function vistaBindCardTilt(vistaWrapUnit) {
    var vistaCardUnit = vistaWrapUnit.querySelector(".vista_quienes_card");
    var vistaBackUnit = vistaWrapUnit.querySelector(".vista_quienes_cardbg");
    var vistaMouseXUnit = 0;
    var vistaMouseYUnit = 0;
    var vistaCurXUnit = 0;
    var vistaCurYUnit = 0;
    var vistaSpeedUnit = 0.08;

    function vistaAnimateCard() {
        vistaCurXUnit += (vistaMouseXUnit - vistaCurXUnit) * vistaSpeedUnit;
        vistaCurYUnit += (vistaMouseYUnit - vistaCurYUnit) * vistaSpeedUnit;

        var vistaRotXUnit = vistaCurXUnit * 20;
        var vistaRotYUnit = vistaCurYUnit * -20;
        var vistaMoveXUnit = vistaCurXUnit * -30;
        var vistaMoveYUnit = vistaCurYUnit * -30;

        vistaCardUnit.style.transform = "rotateY(" + vistaRotXUnit + "deg) rotateX(" + vistaRotYUnit + "deg)";
        vistaBackUnit.style.transform = "translateX(" + vistaMoveXUnit + "px) translateY(" + vistaMoveYUnit + "px)";

        requestAnimationFrame(vistaAnimateCard);
    }

    vistaWrapUnit.addEventListener("mousemove", function (vistaEventUnit) {
        var vistaRectUnit = vistaWrapUnit.getBoundingClientRect();
        vistaMouseXUnit = (vistaEventUnit.clientX - (vistaRectUnit.left + vistaRectUnit.width / 2)) / (vistaRectUnit.width / 2);
        vistaMouseYUnit = (vistaEventUnit.clientY - (vistaRectUnit.top + vistaRectUnit.height / 2)) / (vistaRectUnit.height / 2);
    });

    vistaWrapUnit.addEventListener("mouseleave", function () {
        vistaMouseXUnit = 0;
        vistaMouseYUnit = 0;
    });

    vistaAnimateCard();
}