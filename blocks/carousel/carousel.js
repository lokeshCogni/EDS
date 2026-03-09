export default function decorate(block) {
  const images = [...block.querySelectorAll('img, picture img')]
    .map((img) => img.src)
    .filter(Boolean);

  if (!images.length) return;

  block.innerHTML = `
    <div class="carousel-wrapper">
      <button class="carousel-prev" aria-label="Previous">❮</button>
      <div class="carousel-viewport">
        <div class="carousel-track">
          ${images.map((src, i) => `
            <div class="carousel-slide" aria-label="Slide ${i + 1}">
              ${src}
            </div>
          `).join('')}
        </div>
      </div>
      <button class="carousel-next" aria-label="Next">❯</button>
    </div>
    <div class="carousel-dots">
      ${images.map((_, i) => `<button class="carousel-dot" aria-label="Go to slide ${i + 1}"></button>`).join('')}
    </div>
  `;

  const track = block.querySelector('.carousel-track');
  const slides = [...block.querySelectorAll('.carousel-slide')];
  const dots = [...block.querySelectorAll('.carousel-dot')];
  const prev = block.querySelector('.carousel-prev');
  const next = block.querySelector('.carousel-next');

  let index = 0;

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function go(delta) {
    index = (index + delta + slides.length) % slides.length;
    update();
  }

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      update();
    });
  });

  // Autoplay with pause-on-hover
  const autoplaySpeed = block.classList.contains('autoplay-fast') ? 3000 : 7000;
  let timer = setInterval(() => go(1), autoplaySpeed);

  block.addEventListener('mouseenter', () => {
    clearInterval(timer);
  });

  block.addEventListener('mouseleave', () => {
    timer = setInterval(() => go(1), autoplaySpeed);
  });

  update();
}