// minimal enhancements
document.querySelectorAll('nav a').forEach(a=>{
  if (a.href === window.location.href) a.classList.add('active')
})
document.querySelectorAll('[data-year]').forEach(el=> el.textContent = new Date().getFullYear())

// Financial Market Animation
function createMarketAnimation() {
  const container = document.getElementById('marketAnimation');
  if (!container) {
    console.log('Market animation container not found');
    return;
  }

  // Clear any existing lines and prevent multiple animations
  if (container.hasChildNodes()) {
    console.log('Clearing existing animation');
    container.innerHTML = '';
  }

  // Create SVG for market lines
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.style.pointerEvents = 'none';
  svg.style.overflow = 'hidden';
  svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  
  container.appendChild(svg);

  // Create more market lines with random properties
  const lineCount = 20;
  
  for (let i = 0; i < lineCount; i++) {
    const startY = Math.random() * window.innerHeight;
    const startX = Math.random() * window.innerWidth; // Random starting X position
    const delay = Math.random() * 8; // 0-8s delay
    const duration = Math.random() * 6 + 8; // 8-14s duration
    const direction = Math.random() > 0.5 ? 'left-to-right' : 'right-to-left'; // Random direction
    
    // Create snake-like path with straight diagonal segments
    const path = createMarketPath(startY, startX, direction);
    
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', path);
    pathElement.setAttribute('stroke', 'rgba(255,255,255,0.4)');
    pathElement.setAttribute('stroke-width', '1');
    pathElement.setAttribute('fill', 'none');
    pathElement.setAttribute('opacity', '0');
    pathElement.style.animation = `marketSnake ${duration}s ease-in-out infinite`;
    pathElement.style.animationDelay = delay + 's';
    
    svg.appendChild(pathElement);
  }
  
  console.log('Created', lineCount, 'market snake lines');
}

function createMarketPath(startY, startX, direction) {
  const segments = 8; // Number of diagonal segments
  const viewportWidth = window.innerWidth; // Use actual viewport width
  const segmentWidth = viewportWidth / segments;
  
  let path, currentY = startY;
  
  if (direction === 'left-to-right') {
    // Start from random X position and go right
    path = `M ${startX} ${startY}`;
    
    for (let i = 0; i < segments; i++) {
      const x = startX + (i * segmentWidth);
      const nextX = startX + ((i + 1) * segmentWidth);
      
      // Random vertical movement for this segment
      const verticalChange = (Math.random() - 0.5) * 80; // -40px to +40px
      currentY += verticalChange;
      
      // Create diagonal line to next point
      path += ` L ${nextX} ${currentY}`;
    }
    
    // Add final segment to go to screen edge
    path += ` L ${viewportWidth} ${currentY}`;
    
  } else {
    // Start from random X position and go left
    path = `M ${startX} ${startY}`;
    
    for (let i = 0; i < segments; i++) {
      const x = startX - (i * segmentWidth);
      const nextX = startX - ((i + 1) * segmentWidth);
      
      // Random vertical movement for this segment
      const verticalChange = (Math.random() - 0.5) * 80; // -40px to +40px
      currentY += verticalChange;
      
      // Create diagonal line to next point
      path += ` L ${nextX} ${currentY}`;
    }
    
    // Add final segment to go to screen edge
    path += ` L 0 ${currentY}`;
  }
  
  return path;
}

// Initialize market animation when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, creating market animation');
  createMarketAnimation();
});

// Remove resize handler to prevent multiple animations

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      const isOpening = !mobileMenu.classList.contains('active');
      
      mobileMenu.classList.toggle('active');
      // toggle visual state of hamburger to X
      mobileMenuToggle.classList.toggle('is-open');
      
      // Smooth scroll effect when opening
      if (isOpening) {
        // Scroll to top with smooth animation
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
    
    // Close menu when clicking on links
    mobileMenu.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('is-open');
      }
    });
    
    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function(e) {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('is-open');
      }
    });
  }
});

// MyFXBook iframe error handling
document.addEventListener('DOMContentLoaded', function() {
  const iframes = document.querySelectorAll('iframe[id$="-iframe"]');
  
  iframes.forEach(iframe => {
    const fallback = iframe.parentElement.querySelector('.iframe-fallback');
    
    if (fallback) {
      // Check if iframe loads successfully
      iframe.addEventListener('error', function() {
        iframe.style.display = 'none';
        fallback.style.display = 'block';
      });
      
      // Also check after a timeout
      setTimeout(function() {
        try {
          // Try to access iframe content
          if (iframe.contentWindow === null || iframe.contentDocument === null) {
            iframe.style.display = 'none';
            fallback.style.display = 'block';
          }
        } catch (e) {
          // If we can't access iframe content, show fallback
          iframe.style.display = 'none';
          fallback.style.display = 'block';
        }
      }, 5000);
    }
  });
});