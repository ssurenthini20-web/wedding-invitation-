/* =========================
   OPEN INVITATION
========================= */

const opening = document.getElementById("opening");
const openButton = document.getElementById("openInvitation");

const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");

openButton.addEventListener("click", () => {

    opening.classList.add("hide");

    setTimeout(() => {
        music.volume = 0.35;

        music.play().catch(() => {
            console.log("Music requires user interaction.");
        });
    }, 700);

});


/* =========================
   MUSIC
========================= */

let musicPlaying = false;

musicButton.addEventListener("click", () => {

    if (musicPlaying) {

        music.pause();

        musicButton.innerHTML = "♫";

        musicPlaying = false;

    } else {

        music.play();

        musicButton.innerHTML = "❚❚";

        musicPlaying = true;

    }

});


/* =========================
   COUNTDOWN
========================= */

const weddingDate =
    new Date("July 15, 2027 10:30:00").getTime();


function updateCountdown() {

    const now = new Date().getTime();

    const difference =
        weddingDate - now;

    if (difference <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }

    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (difference %
                (1000 * 60 * 60 * 24))
            /
            (1000 * 60 * 60)
        );

    const minutes =
        Math.floor(
            (difference %
                (1000 * 60 * 60))
            /
            (1000 * 60)
        );

    const seconds =
        Math.floor(
            (difference %
                (1000 * 60))
            /
            1000
        );


    document.getElementById("days")
        .textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours")
        .textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes")
        .textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds")
        .textContent =
        String(seconds).padStart(2, "0");

}

updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================
   SCROLL REVEAL
========================= */

const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


document
    .querySelectorAll(".reveal")
    .forEach(element => {

        observer.observe(element);

    });


/* =========================
   LOCATION MESSAGE
========================= */

function showLocationMessage() {

    const toast =
        document.getElementById("toast");

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================
   GOLDEN PARTICLES
========================= */

function createParticle() {

    const particle =
        document.createElement("span");

    particle.style.position = "fixed";

    particle.style.width =
        Math.random() * 4 + 2 + "px";

    particle.style.height =
        particle.style.width;

    particle.style.borderRadius = "50%";

    particle.style.background =
        "rgba(225,185,105,.7)";

    particle.style.left =
        Math.random() * 100 + "vw";

    particle.style.top =
        Math.random() * 100 + "vh";

    particle.style.pointerEvents = "none";

    particle.style.zIndex = "1";

    particle.style.boxShadow =
        "0 0 10px rgba(225,185,105,.7)";

    document.body.appendChild(particle);


    const duration =
        4000 +
        Math.random() * 7000;


    particle.animate(

        [
            {
                transform: "translateY(0)",
                opacity: 0
            },

            {
                transform:
                    `translateY(-${100 + Math.random() * 300}px)`,
                opacity: 1
            },

            {
                transform:
                    `translateY(-${300 + Math.random() * 500}px)`,
                opacity: 0
            }
        ],

        {
            duration: duration,
            easing: "ease-out"
        }

    );


    setTimeout(() => {

        particle.remove();

    }, duration);

}


setInterval(
    createParticle,
    450
);


/* =========================
   CLICK HEARTS
========================= */

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.tagName === "BUTTON" ||
            event.target.tagName === "A"
        ) {
            return;
        }

        const heart =
            document.createElement("div");

        heart.innerHTML = "♥";

        heart.style.position = "fixed";

        heart.style.left =
            event.clientX + "px";

        heart.style.top =
            event.clientY + "px";

        heart.style.color = "#d79b50";

        heart.style.fontSize =
            "18px";

        heart.style.pointerEvents =
            "none";

        heart.style.zIndex =
            "99999";


        document.body.appendChild(heart);


        heart.animate(

            [
                {
                    transform:
                        "translate(-50%, -50%) scale(.5)",
                    opacity: 1
                },

                {
                    transform:
                        "translate(-50%, -150px) scale(1.5)",
                    opacity: 0
                }
            ],

            {
                duration: 1200,
                easing: "ease-out"
            }

        );


        setTimeout(
            () => heart.remove(),
            1200
        );

    }
);
