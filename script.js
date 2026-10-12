/*
  ==========================================
  BRYLLUPSSIDE – JAVASCRIPT
  ==========================================

  Denne filen styrer:

  1. Nedtelling til bryllupet
  2. Mobilmeny
  3. Animasjoner når man scroller
  4. Åpningsanimasjon med ballonger og fyrverkeri

  RSVP-svarene samles inn med Microsoft Forms, som
  er bygget inn direkte i index.html.
*/


/*
  ------------------------------------------
  1. NEDTELLING TIL BRYLLUPET
  ------------------------------------------

  Bytt denne datoen til faktisk bryllupsdato.

  Format:
  ÅR-MÅNED-DAG TID

  Eksempel:
  "2027-06-12T14:00:00"
*/
const weddingDate = new Date("2027-06-12T14:00:00");

/*
  Henter HTML-elementene der vi skal vise
  dager, timer og minutter.
*/
const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");


/*
  Funksjonen regner ut hvor lang tid det er igjen
  fra nåværende tidspunkt til bryllupsdatoen.
*/
function updateCountdown() {
  // Dato og klokkeslett akkurat nå
  const now = new Date();

  /*
    getTime() gir antall millisekunder siden 1. januar 1970.
    Ved å trekke dem fra hverandre får vi antall millisekunder
    frem til bryllupet.
  */
  const difference = weddingDate.getTime() - now.getTime();

  /*
    Hvis bryllupet har startet eller datoen har passert,
    setter vi alle tall til 0.
  */
  if (difference <= 0) {
    daysElement.textContent = "0";
    hoursElement.textContent = "0";
    minutesElement.textContent = "0";
    return;
  }

  /*
    Antall millisekunder i:
    - ett minutt
    - én time
    - ett døgn
  */
  const oneMinute = 1000 * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;

  // Regner ut hele dager igjen
  const days = Math.floor(difference / oneDay);

  /*
    % betyr resten etter divisjon.

    Eksempel:
    Når vi har funnet hele dager, regner vi ut hvor
    mange timer som gjenstår etter disse dagene.
  */
  const hours = Math.floor((difference % oneDay) / oneHour);

  // Regner ut minutter etter hele timer
  const minutes = Math.floor((difference % oneHour) / oneMinute);

  /*
    textContent setter teksten inne i HTML-elementet.

    padStart(2, "0") gjør at for eksempel 8 blir til "08".
  */
  daysElement.textContent = days;
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
}

/*
  Kjører nedtellingen med én gang siden lastes,
  så brukeren ikke trenger å vente ett minutt.
*/
updateCountdown();

/*
  Oppdaterer nedtellingen hvert minutt.

  60 000 millisekunder = 60 sekunder = 1 minutt.
*/
setInterval(updateCountdown, 60_000);


/*
  ------------------------------------------
  2. MOBILMENY
  ------------------------------------------

  På mobil viser HTML-en en hamburgerknapp.
  JavaScript åpner og lukker menyen når brukeren
  trykker på knappen.
*/

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");


/*
  Sjekker at elementene finnes før vi bruker dem.

  Dette gjør at JavaScript ikke krasjer hvis du senere
  fjerner menyen fra HTML-en.
*/
if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    /*
      aria-expanded forteller skjermlesere om menyen er åpen.
      Vi leser den eksisterende verdien først.
    */
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    /*
      Hvis menyen var lukket blir den åpnet.
      Hvis den var åpen blir den lukket.
    */
    menuButton.setAttribute("aria-expanded", String(!isOpen));

    /*
      Endrer tekst som leses opp av skjermlesere.
    */
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Åpne meny" : "Lukk meny"
    );

    /*
      CSS-klassen .open gjør mobilmenyen synlig.
      CSS-klassen .menu-open på body stopper scrolling
      i bakgrunnen mens menyen er åpen.
    */
    navLinks.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  /*
    Når brukeren klikker på en lenke i mobilmenyen,
    lukker vi menyen automatisk.
  */
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");

      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Åpne meny");
    });
  });
}


/*
  ------------------------------------------
  3. ANIMASJONER NÅR MAN SCROLLER
  ------------------------------------------

  Elementer med class="reveal" er gjennomsiktige
  og litt flyttet ned i CSS.

  Når de kommer inn på skjermen, legger JavaScript
  på class="visible". CSS gjør da at de toner inn.
*/

const revealElements = document.querySelectorAll(".reveal");


/*
  IntersectionObserver er en effektiv måte å sjekke
  om et element er synlig på skjermen.

  Det er bedre enn å lytte kontinuerlig på scroll.
*/
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      /*
        isIntersecting er true når elementet er synlig
        i nettleservinduet.
      */
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        /*
          Når animasjonen først er kjørt, trenger vi ikke
          følge med på dette elementet lenger.
        */
        observer.unobserve(entry.target);
      }
    });
  },
  {
    /*
      threshold: 0.12 betyr at omtrent 12 % av elementet
      må være synlig før animasjonen starter.
    */
    threshold: 0.12,
  }
);


/*
  Starter overvåkingen for alle elementer med .reveal.
*/
revealElements.forEach((element) => {
  observer.observe(element);
});


/*
  ------------------------------------------
  4. ÅPNINGSANIMASJON:
     BALLONGER OG FYRVERKERI
  ------------------------------------------

  Animasjonen kjører kun når nettsiden åpnes.
  Den respekterer også innstillingen "redusert bevegelse"
  for brukere som ikke ønsker animasjoner.
*/

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion) {
  const hero = document.querySelector(".hero");
  const fireworksCanvas = document.getElementById("fireworks-canvas");

  /*
    Lager dekorative ballonger inne i hero-seksjonen.
  */
  function createOpeningBalloons() {
    const balloonColors = [
      "#f4c6c2",
      "#d99aa1",
      "#e8d7b7",
      "#c78b94",
      "#f3dfdc",
      "#b87882",
    ];

    const numberOfBalloons = 9;

    for (let i = 0; i < numberOfBalloons; i += 1) {
      const balloon = document.createElement("div");

      balloon.className = "opening-balloon";

      /*
        Hver ballong får tilfeldig farge, posisjon,
        størrelse og hastighet.
      */
      balloon.style.left = `${Math.random() * 100}%`;
      balloon.style.backgroundColor =
        balloonColors[Math.floor(Math.random() * balloonColors.length)];

      balloon.style.animationDuration = `${7 + Math.random() * 5}s`;
      balloon.style.animationDelay = `${Math.random() * 1.5}s`;

      const size = 0.75 + Math.random() * 0.55;
      balloon.style.transform = `scale(${size})`;

      hero.appendChild(balloon);
    }
  }

  /*
    Fyrverkeri tegnes i et canvas-element.

    Et canvas er som en tom flate JavaScript kan tegne
    prikker, linjer og former på.
  */
  function startFireworks() {
    const context = fireworksCanvas.getContext("2d");
    const particles = [];

    /*
      Tilpasser canvaset til skjermens størrelse.
      devicePixelRatio gjør at fyrverkeriet blir skarpt
      også på skjermer med høy oppløsning.
    */
    function resizeCanvas() {
      const pixelRatio = window.devicePixelRatio || 1;

      fireworksCanvas.width = window.innerWidth * pixelRatio;
      fireworksCanvas.height = window.innerHeight * pixelRatio;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    resizeCanvas();

    /*
      Lager én eksplosjon med mange små partikler.
    */
    function createFirework(x, y) {
      const colors = [
        "#ffffff",
        "#f7d7d1",
        "#f4c6c2",
        "#e6bc77",
        "#d99aa1",
      ];

      const color = colors[Math.floor(Math.random() * colors.length)];
      const particleCount = 55;

      for (let i = 0; i < particleCount; i += 1) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 1.5 + Math.random() * 4.5;

        particles.push({
          x,
          y,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          gravity: 0.035,
          friction: 0.975,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.01,
          size: 1.5 + Math.random() * 2,
          color,
        });
      }
    }

    /*
      Oppdaterer posisjonen til hver partikkel og tegner den.
    */
    function animateFireworks() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];

        particle.velocityX *= particle.friction;
        particle.velocityY *= particle.friction;
        particle.velocityY += particle.gravity;

        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.alpha -= particle.decay;

        if (particle.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

        context.fillStyle = particle.color;
        context.globalAlpha = particle.alpha;
        context.fill();
      }

      context.globalAlpha = 1;

      /*
        Fortsetter å animere så lenge det finnes partikler.
      */
      if (particles.length > 0) {
        requestAnimationFrame(animateFireworks);
      }
    }

    /*
      Fyrverkeriet starter litt etter litt, slik at det
      ikke kommer alt på én gang.
    */
    setTimeout(() => createFirework(window.innerWidth * 0.25, window.innerHeight * 0.3), 250);
    setTimeout(() => createFirework(window.innerWidth * 0.75, window.innerHeight * 0.25), 650);
    setTimeout(() => createFirework(window.innerWidth * 0.5, window.innerHeight * 0.42), 1050);
    setTimeout(() => createFirework(window.innerWidth * 0.2, window.innerHeight * 0.48), 1450);
    setTimeout(() => createFirework(window.innerWidth * 0.82, window.innerHeight * 0.45), 1750);

    animateFireworks();

    window.addEventListener("resize", resizeCanvas);
  }

  createOpeningBalloons();
  startFireworks();
}
