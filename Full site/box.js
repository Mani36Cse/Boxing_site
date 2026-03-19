// Initialize Animations
AOS.init({ duration: 1000, once: true });

const bag = document.getElementById('bag');
if (bag && typeof gsap !== 'undefined') {
    const punchAudio = new Audio('../punch.mp3');

    function punchBag() {
        gsap.killTweensOf(bag);

        const timeline = gsap.timeline();
        timeline
            .to(bag, {
                rotation: 20,
                duration: 0.12,
                ease: 'power2.out'
            })
            .to(bag, {
                rotation: -15,
                duration: 0.15,
                ease: 'power2.inOut'
            })
            .to(bag, {
                rotation: 10,
                duration: 0.12
            })
            .to(bag, {
                rotation: -5,
                duration: 0.1
            })
            .to(bag, {
                rotation: 0,
                duration: 0.1,
                ease: 'power2.out'
            });

        gsap.fromTo(
            bag,
            { scale: 1 },
            {
                scale: 1.06,
                duration: 0.08,
                yoyo: true,
                repeat: 1
            }
        );

        gsap.fromTo(
            bag,
            { filter: 'brightness(1) drop-shadow(0 22px 22px rgba(0, 0, 0, 0.45))' },
            {
                filter: 'brightness(1.35) drop-shadow(0 0 22px rgba(255, 204, 0, 0.85))',
                duration: 0.08,
                yoyo: true,
                repeat: 1
            }
        );

        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        punchAudio.currentTime = 0;
        punchAudio.play().catch(() => {});
    }

    bag.addEventListener('click', punchBag);
    bag.addEventListener('touchstart', punchBag, { passive: true });
}

const coachCards = document.querySelectorAll('.coach-card');
coachCards.forEach(card => {
    const video = card.querySelector('.coach-video');
    if (!video) {
        return;
    }

    card.addEventListener('pointerenter', () => {
        video.load();
        video.currentTime = 0;
        video.play().catch(() => {});
    });

    card.addEventListener('pointerleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});

// Configuration - replace this with your deployed Google Apps Script web app URL.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyB8JuFayrL7TCCEXfGzep0xfw5mpyXy8fl4Z-7mDrH3EVC68NPIa_p9m3JTB-KkluP/exec';

const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const modal = document.getElementById('successModal');

form.addEventListener('submit', e => {
    e.preventDefault();

    if (!SCRIPT_URL || SCRIPT_URL.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE')) {
        alert('Add your Google Apps Script web app URL in box.js before using the form.');
        return;
    }

    // UI Feedback
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'SUBMITTING...';

    // Prepare Data
    const formData = new FormData(form);
    formData.append('submittedAt', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

    // Send to Google Sheets
    fetch(SCRIPT_URL, { method: 'POST', body: formData })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Show Success Modal
        modal.classList.add('active');

        // Reset Form
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'SEND REGISTRATION';
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('Submission failed. Check your Apps Script URL and internet connection, then try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'RETRY';
    });
});

// Close Modal function
function closeModal() {
    modal.classList.remove('active');
}
