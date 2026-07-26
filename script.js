// ================= 1. PAGE TRANSITION (FADE IN/OUT) =================
// Menjamin layar langsung muncul dan tidak blank hitam
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");

    // Transisi saat klik menu
    const links = document.querySelectorAll('a[href]:not([target="_blank"])');
    links.forEach(link => {
        link.addEventListener("click", function(e) {
            const url = this.getAttribute("href");
            if (url && url.endsWith(".html")) {
                e.preventDefault();
                document.body.classList.remove("loaded");
                document.body.classList.add("fade-out");
                
                setTimeout(() => {
                    window.location.href = url;
                }, 400);
            }
        });
    });

    // ================= 2. STICKY NAVBAR & ACTIVE LINK =================
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-links a");

    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    const currentPath = window.location.pathname.split("/").pop();
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath || (currentPath === "" && link.getAttribute("href") === "index.html")) {
            link.classList.add("active");
        }
    });

    // ================= 3. HAMBURGER MENU (MOBILE) =================
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    // ================= 4. SCROLL REVEAL ANIMATION =================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-show");
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // ================= 5. FORM SUBMIT (KONTAK) =================
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const submitBtn = document.getElementById("submitBtn");
            const formStatus = document.getElementById("formStatus");
            const emailTujuan = "emailkamu@gmail.com"; 

            submitBtn.innerText = "Mengirim...";
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const dataObj = Object.fromEntries(formData);
            dataObj["_captcha"] = "false";

            fetch(`https://formsubmit.co/ajax/${emailTujuan}`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dataObj)
            })
            .then(response => response.json())
            .then(data => {
                formStatus.style.display = "block";
                formStatus.style.color = "var(--accent-gold)";
                formStatus.innerText = "✓ Pesan berhasil terkirim!";
                contactForm.reset();
            })
            .catch(error => {
                formStatus.style.display = "block";
                formStatus.style.color = "#ff4d4d";
                formStatus.innerText = "✕ Gagal mengirim pesan.";
            })
            .finally(() => {
                submitBtn.innerText = "Kirim Pesan";
                submitBtn.disabled = false;
            });
        });
    }

    // ================= 6. FILTER PENGURUS =================
    const filterBtns = document.querySelectorAll(".filter-btn");
    const officerCards = document.querySelectorAll(".officer-card");

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.getAttribute("data-filter");
                officerCards.forEach(card => {
                    if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
                        card.classList.remove("hide");
                    } else {
                        card.classList.add("hide");
                    }
                });
            });
        });
    }

    // ================= 7. LIGHTBOX SLIDER GALERI =================
    const albumCards = document.querySelectorAll(".gallery-album-card");

    if (albumCards.length > 0) {
        let currentImages = [];
        let currentIndex = 0;
        let currentAlbumTitle = "";

        const lightbox = document.createElement("div");
        lightbox.classList.add("popup");
        lightbox.innerHTML = `
            <div class="popup-close">&times;</div>
            <div class="lightbox-container">
                <div class="lightbox-img-wrapper">
                    <button class="lightbox-btn lightbox-prev">&#10094;</button>
                    <img src="" alt="Gallery Image" class="lightbox-img">
                    <button class="lightbox-btn lightbox-next">&#10095;</button>
                </div>
                <div class="lightbox-meta">
                    <div class="lightbox-title"></div>
                    <div class="lightbox-counter"></div>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector(".lightbox-img");
        const lightboxTitle = lightbox.querySelector(".lightbox-title");
        const lightboxCounter = lightbox.querySelector(".lightbox-counter");
        const closeBtn = lightbox.querySelector(".popup-close");
        const prevBtn = lightbox.querySelector(".lightbox-prev");
        const nextBtn = lightbox.querySelector(".lightbox-next");

        function updateLightboxImage() {
            lightboxImg.src = currentImages[currentIndex];
            lightboxTitle.innerText = currentAlbumTitle;
            lightboxCounter.innerText = `Foto ${currentIndex + 1} dari ${currentImages.length}`;
        }

        albumCards.forEach(card => {
            card.addEventListener("click", () => {
                try {
                    currentImages = JSON.parse(card.getAttribute("data-images"));
                    currentAlbumTitle = card.getAttribute("data-title");
                    currentIndex = 0;

                    updateLightboxImage();
                    lightbox.classList.add("active");
                } catch (err) {
                    console.error("Error membaca format foto album:", err);
                }
            });
        });

        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightboxImage();
        });

        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightboxImage();
        });

        closeBtn.addEventListener("click", () => lightbox.classList.remove("active"));
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) lightbox.classList.remove("active");
        });

        document.addEventListener("keydown", (e) => {
            if (!lightbox.classList.contains("active")) return;
            if (e.key === "ArrowRight") nextBtn.click();
            if (e.key === "ArrowLeft") prevBtn.click();
            if (e.key === "Escape") lightbox.classList.remove("active");
        });
    }
});