(function() {
  const video = document.getElementById('scroll-video');
  if (!video) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  let ticking = false;

  function updateVideoTime() {
    const rect = hero.getBoundingClientRect();
    const scrollable = hero.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollable));

    if (video.duration && isFinite(video.duration)) {
      video.currentTime = progress * video.duration;
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      updateVideoTime();
      ticking = false;
    });
  }

  video.addEventListener('loadedmetadata', updateVideoTime);
  window.addEventListener('scroll', onScroll, { passive: true });
})();
