const surprise = document.getElementById('surprise');
const btn = document.getElementById('btn');
const image = document.getElementById('image');
const curtain = document.getElementById('curtain');

btn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    image.classList = 'imageAnimation';
    curtain.classList = 'curtain-closed';

    setTimeout(() => {
        video.classList = 'video-open';
        video.setAttribute('src', video.getAttribute('src') + '?autoplay=1');
    }, 5000);

    console.dir(video);
});
