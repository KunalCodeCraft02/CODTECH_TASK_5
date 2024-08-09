let crl1 = document.getElementById("crl1");
let crl2 = document.getElementById("crl2");
let crl3 = document.getElementById("crl3");

let seeStory = document.getElementById("seeStory");
let itag = document.getElementById("itag");

crl1.addEventListener("click", () => {
    gsap.to(seeStory, {
        top: 0
    });
});

itag.addEventListener("click", () => {
    gsap.to(seeStory, {
        top: "-150%"
    })
});

