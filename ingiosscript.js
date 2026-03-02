document.addEventListener("DOMContentLoaded", function () {
    var vistaFieldHost = document.getElementById("vista_particle_field");
    var vistaParticleTotal = 70;
    var vistaBatchFragment = document.createDocumentFragment();
    var vistaRouteNodes = document.querySelectorAll(".vista_route_switch");
    var vistaPanelNodes = document.querySelectorAll(".vista_spa_panel");
    var vistaCardWraps = document.querySelectorAll(".vista_quienes_cardwrap");
    var vistaBulletLines = document.querySelectorAll(".vista_inicio_bullet_line");
    var vistaBulletScrambleMap = new WeakMap();
    var vistaScrambleNodes = document.querySelectorAll(".vista_word_scramble");
    var vistaScrambleTimers = new WeakMap();

    var vistaStoryTabs = document.querySelectorAll(".vista_story_tab");
    var vistaStoryPanels = document.querySelectorAll(".vista_story_panel");
    var vistaEmpathyNodes = document.querySelectorAll(".vista_empathy_node");

    for (var vistaIndex = 0; vistaIndex < vistaParticleTotal; vistaIndex++) {
        vistaBatchFragment.appendChild(vistaCreateParticle());
    }

    if (vistaFieldHost) {
        vistaFieldHost.appendChild(vistaBatchFragment);
    }

    for (var vistaButtonIndex = 0; vistaButtonIndex < vistaRouteNodes.length; vistaButtonIndex++) {
        vistaRouteNodes[vistaButtonIndex].addEventListener("click", vistaSwitchPanelRoute);
    }

    for (var vistaCardIndex = 0; vistaCardIndex < vistaCardWraps.length; vistaCardIndex++) {
        vistaBindCardTilt(vistaCardWraps[vistaCardIndex]);
    }

    for (var vistaLineIndex = 0; vistaLineIndex < vistaBulletLines.length; vistaLineIndex++) {
        var vistaBulletLine = vistaBulletLines[vistaLineIndex];
        vistaBulletScrambleMap.set(vistaBulletLine, vistaBulletLine.querySelectorAll(".vista_word_scramble"));
        vistaBulletLine.addEventListener("mouseenter", vistaStartWordAnimations);
        vistaBulletLine.addEventListener("mouseleave", vistaStopWordAnimations);
    }

    for (var vistaScrambleIndex = 0; vistaScrambleIndex < vistaScrambleNodes.length; vistaScrambleIndex++) {
        vistaScrambleNodes[vistaScrambleIndex].textContent = vistaScrambleNodes[vistaScrambleIndex].getAttribute("data-vista-word");
    }

    for (var vistaStoryIndex = 0; vistaStoryIndex < vistaStoryTabs.length; vistaStoryIndex++) {
        vistaStoryTabs[vistaStoryIndex].addEventListener("click", vistaSwitchStoryTab);
    }

    for (var vistaEmpathyIndex = 0; vistaEmpathyIndex < vistaEmpathyNodes.length; vistaEmpathyIndex++) {
        vistaEmpathyNodes[vistaEmpathyIndex].addEventListener("click", vistaSwitchEmpathyNode);
        vistaEmpathyNodes[vistaEmpathyIndex].addEventListener("mouseenter", vistaPreviewEmpathyNode);
    }

    vistaSetPanelState("vista_page_inicio");
    vistaSetStoryState("1");

    function vistaSwitchPanelRoute(vistaEventUnit) {
        var vistaPanelKey = vistaEventUnit.currentTarget.getAttribute("data-vista-section");
        vistaSetPanelState(vistaPanelKey);
    }

    function vistaSetPanelState(vistaPanelKey) {
        for (var vistaControlIndex = 0; vistaControlIndex < vistaRouteNodes.length; vistaControlIndex++) {
            var vistaControlUnit = vistaRouteNodes[vistaControlIndex];
            var vistaControlMatch = vistaControlUnit.getAttribute("data-vista-section") === vistaPanelKey;
            var vistaHasCurrentClass = vistaControlUnit.classList.contains("vista_route_switch_current");

            if (vistaControlMatch && !vistaHasCurrentClass) {
                vistaControlUnit.classList.add("vista_route_switch_current");
                vistaControlUnit.setAttribute("aria-current", "page");
            } else if (!vistaControlMatch && vistaHasCurrentClass) {
                vistaControlUnit.classList.remove("vista_route_switch_current");
                vistaControlUnit.removeAttribute("aria-current");
            }
        }

        for (var vistaPanelIndex = 0; vistaPanelIndex < vistaPanelNodes.length; vistaPanelIndex++) {
            var vistaPanelUnit = vistaPanelNodes[vistaPanelIndex];
            var vistaPanelMatch = vistaPanelUnit.id === vistaPanelKey;
            var vistaPanelVisible = vistaPanelUnit.classList.contains("vista_spa_panel_visible");

            if (vistaPanelMatch && !vistaPanelVisible) {
                vistaPanelUnit.classList.add("vista_spa_panel_visible");
            } else if (!vistaPanelMatch && vistaPanelVisible) {
                vistaPanelUnit.classList.remove("vista_spa_panel_visible");
            }
        }
    }

    function vistaSwitchStoryTab(vistaEventUnit) {
        var vistaStoryId = vistaEventUnit.currentTarget.getAttribute("data-vista-story");
        vistaSetStoryState(vistaStoryId);
    }

    function vistaSetStoryState(vistaStoryId) {
        for (var vistaTabIndex = 0; vistaTabIndex < vistaStoryTabs.length; vistaTabIndex++) {
            var vistaTabUnit = vistaStoryTabs[vistaTabIndex];
            var vistaIsCurrentTab = vistaTabUnit.getAttribute("data-vista-story") === vistaStoryId;
            var vistaTabIsActive = vistaTabUnit.classList.contains("vista_story_tab_active");

            if (vistaIsCurrentTab && !vistaTabIsActive) {
                vistaTabUnit.classList.add("vista_story_tab_active");
                vistaTabUnit.setAttribute("aria-selected", "true");
            } else if (!vistaIsCurrentTab && vistaTabIsActive) {
                vistaTabUnit.classList.remove("vista_story_tab_active");
                vistaTabUnit.setAttribute("aria-selected", "false");
            }
        }

        for (var vistaPanelStoryIndex = 0; vistaPanelStoryIndex < vistaStoryPanels.length; vistaPanelStoryIndex++) {
            var vistaStoryPanelUnit = vistaStoryPanels[vistaPanelStoryIndex];
            var vistaIsCurrentPanel = vistaStoryPanelUnit.getAttribute("data-vista-story-panel") === vistaStoryId;
            var vistaPanelIsActive = vistaStoryPanelUnit.classList.contains("vista_story_panel_active");

            if (vistaIsCurrentPanel && !vistaPanelIsActive) {
                vistaStoryPanelUnit.classList.add("vista_story_panel_active");
            } else if (!vistaIsCurrentPanel && vistaPanelIsActive) {
                vistaStoryPanelUnit.classList.remove("vista_story_panel_active");
            }
        }
    }

    function vistaSwitchEmpathyNode(vistaEventUnit) {
        var vistaNodeUnit = vistaEventUnit.currentTarget;
        vistaActivateEmpathyNode(vistaNodeUnit);
    }

    function vistaPreviewEmpathyNode(vistaEventUnit) {
        var vistaNodeUnit = vistaEventUnit.currentTarget;
        vistaActivateEmpathyNode(vistaNodeUnit);
    }

    function vistaActivateEmpathyNode(vistaNodeUnit) {
        if (vistaNodeUnit.classList.contains("vista_empathy_node_active")) {
            return;
        }

        for (var vistaNodeIndex = 0; vistaNodeIndex < vistaEmpathyNodes.length; vistaNodeIndex++) {
            vistaEmpathyNodes[vistaNodeIndex].classList.remove("vista_empathy_node_active");
        }
        vistaNodeUnit.classList.add("vista_empathy_node_active");
    }

    function vistaStartWordAnimations(vistaEventUnit) {
        var vistaTargetLine = vistaEventUnit.currentTarget;
        vistaTargetLine.classList.add("vista_inicio_bullet_hover");

        var vistaScrambleTargets = vistaBulletScrambleMap.get(vistaTargetLine);
        if (!vistaScrambleTargets || vistaScrambleTargets.length === 0) {
            return;
        }

        for (var vistaIndexUnit = 0; vistaIndexUnit < vistaScrambleTargets.length; vistaIndexUnit++) {
            vistaStartScramble(vistaScrambleTargets[vistaIndexUnit]);
        }
    }

    function vistaStopWordAnimations(vistaEventUnit) {
        var vistaTargetLine = vistaEventUnit.currentTarget;
        vistaTargetLine.classList.remove("vista_inicio_bullet_hover");

        var vistaScrambleTargets = vistaBulletScrambleMap.get(vistaTargetLine);
        if (!vistaScrambleTargets || vistaScrambleTargets.length === 0) {
            return;
        }

        for (var vistaIndexUnit = 0; vistaIndexUnit < vistaScrambleTargets.length; vistaIndexUnit++) {
            vistaStopScramble(vistaScrambleTargets[vistaIndexUnit]);
        }
    }

    function vistaStartScramble(vistaWordUnit) {
        var vistaOriginalWord = vistaWordUnit.getAttribute("data-vista-word");
        if (!vistaOriginalWord) {
            return;
        }

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

            if (vistaStepIndex >= vistaOriginalWord.length) {
                clearInterval(vistaTimerUnit);
                vistaScrambleTimers.delete(vistaWordUnit);
                vistaWordUnit.textContent = vistaOriginalWord;
            }
        }, 36);

        vistaScrambleTimers.set(vistaWordUnit, vistaTimerUnit);
    }

    function vistaStopScramble(vistaWordUnit) {
        var vistaOriginalWord = vistaWordUnit.getAttribute("data-vista-word");
        var vistaTimerUnit = vistaScrambleTimers.get(vistaWordUnit);

        if (vistaTimerUnit) {
            clearInterval(vistaTimerUnit);
            vistaScrambleTimers.delete(vistaWordUnit);
        }

        if (vistaOriginalWord && vistaWordUnit.textContent !== vistaOriginalWord) {
            vistaWordUnit.textContent = vistaOriginalWord;
        }
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
    var vistaAnimationFrameId = null;
    var vistaCardTransformState = "";
    var vistaBackTransformState = "";

    function vistaAnimateCard() {
        vistaCurXUnit += (vistaMouseXUnit - vistaCurXUnit) * vistaSpeedUnit;
        vistaCurYUnit += (vistaMouseYUnit - vistaCurYUnit) * vistaSpeedUnit;

        var vistaRotXUnit = vistaCurXUnit * 20;
        var vistaRotYUnit = vistaCurYUnit * -20;
        var vistaMoveXUnit = vistaCurXUnit * -30;
        var vistaMoveYUnit = vistaCurYUnit * -30;

        var vistaCardTransformNext = "rotateY(" + vistaRotXUnit + "deg) rotateX(" + vistaRotYUnit + "deg)";
        var vistaBackTransformNext = "translateX(" + vistaMoveXUnit + "px) translateY(" + vistaMoveYUnit + "px)";

        if (vistaCardTransformState !== vistaCardTransformNext) {
            vistaCardTransformState = vistaCardTransformNext;
            vistaCardUnit.style.transform = vistaCardTransformState;
        }

        if (vistaBackTransformState !== vistaBackTransformNext) {
            vistaBackTransformState = vistaBackTransformNext;
            vistaBackUnit.style.transform = vistaBackTransformState;
        }

        var vistaShouldContinue =
            Math.abs(vistaMouseXUnit - vistaCurXUnit) > 0.001 ||
            Math.abs(vistaMouseYUnit - vistaCurYUnit) > 0.001 ||
            Math.abs(vistaCurXUnit) > 0.001 ||
            Math.abs(vistaCurYUnit) > 0.001;

        if (vistaShouldContinue) {
            vistaAnimationFrameId = requestAnimationFrame(vistaAnimateCard);
            return;
        }

        vistaAnimationFrameId = null;
        if (vistaCardTransformState !== "rotateY(0deg) rotateX(0deg)") {
            vistaCardTransformState = "rotateY(0deg) rotateX(0deg)";
            vistaCardUnit.style.transform = vistaCardTransformState;
        }
        if (vistaBackTransformState !== "translateX(0px) translateY(0px)") {
            vistaBackTransformState = "translateX(0px) translateY(0px)";
            vistaBackUnit.style.transform = vistaBackTransformState;
        }
    }

    function vistaEnsureCardAnimation() {
        if (vistaAnimationFrameId !== null) {
            return;
        }

        vistaAnimationFrameId = requestAnimationFrame(vistaAnimateCard);
    }

    vistaWrapUnit.addEventListener("mousemove", function (vistaEventUnit) {
        var vistaRectUnit = vistaWrapUnit.getBoundingClientRect();
        vistaMouseXUnit = (vistaEventUnit.clientX - (vistaRectUnit.left + vistaRectUnit.width / 2)) / (vistaRectUnit.width / 2);
        vistaMouseYUnit = (vistaEventUnit.clientY - (vistaRectUnit.top + vistaRectUnit.height / 2)) / (vistaRectUnit.height / 2);
        vistaEnsureCardAnimation();
    });

    vistaWrapUnit.addEventListener("mouseleave", function () {
        vistaMouseXUnit = 0;
        vistaMouseYUnit = 0;
        vistaEnsureCardAnimation();
    });
}
