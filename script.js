  
document.addEventListener("DOMContentLoaded", () => {
  // Log Experience section icon element to verify replacement
  const experienceIcon = document.querySelector('i[data-lucide="briefcase"]')
  console.log("Experience icon element after lucide.createIcons():", experienceIcon)

  // Log replaced SVG element for briefcase icon
  const briefcaseSVG = document.querySelector('svg[data-icon="briefcase"]')
  console.log("Replaced SVG element for briefcase icon:", briefcaseSVG)

  // Initialize scroll effects
  handleScroll()
  window.addEventListener("scroll", handleScroll)

  // Add click handlers for mobile nav links
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobileMenuOpen) {
        toggleMobileMenu()
      }
    })
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe cards for animation
  const cards = document.querySelectorAll(".card")
  cards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out"
    observer.observe(card)
  })

  // Animate stats numbers
  const stats = document.querySelectorAll(".stat-number")
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stat = entry.target
          const finalValue = stat.textContent

          // Animate number counting
          if (finalValue.includes("%")) {
            const numValue = Number.parseFloat(finalValue)
            animateValue(stat, 0, numValue, 2000, "%")
          } else if (finalValue.includes("$")) {
            const numValue = Number.parseInt(finalValue.replace("$", ""))
            animateValue(stat, 0, numValue, 2000, "$")
          } else if (finalValue.includes("+")) {
            const numValue = Number.parseInt(finalValue.replace("+", ""))
            animateValue(stat, 0, numValue, 2000, "+")
          }

          statsObserver.unobserve(stat)
        }
      })
    },
    { threshold: 0.5 },
  )

  stats.forEach((stat) => statsObserver.observe(stat))

  // Add accessibility features
  const socialLinks = document.querySelectorAll(".social-link")
  socialLinks.forEach((link) => {
    const title = link.getAttribute("title")
    if (title) {
      link.setAttribute("aria-label", title)
    }
  })

  // Add keyboard navigation for custom buttons
  const customButtons = document.querySelectorAll("[onclick]")
  customButtons.forEach((button) => {
    button.setAttribute("tabindex", "0")
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        this.click()
      }
    })
  })

  })

// Mobile menu functionality
let isMobileMenuOpen = false

function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu")
  const menuIcon = document.querySelector(".menu-icon")
  const closeIcon = document.querySelector(".close-icon")

  isMobileMenuOpen = !isMobileMenuOpen

  if (isMobileMenuOpen) {
    mobileMenu.classList.add("active")
    menuIcon.classList.add("hidden")
    closeIcon.classList.remove("hidden")
  } else {
    mobileMenu.classList.remove("active")
    menuIcon.classList.remove("hidden")
    closeIcon.classList.add("hidden")
  }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }

  // Close mobile menu if open
  if (isMobileMenuOpen) {
    toggleMobileMenu()
  }
}

// Handle scroll effects
function handleScroll() {
  const navbar = document.getElementById("navbar")
  const scrollY = window.scrollY

  if (scrollY > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
}

// Handle keyboard navigation
document.addEventListener("keydown", (event) => {
  // Handle escape key to close mobile menu
  if (event.key === "Escape" && isMobileMenuOpen) {
    toggleMobileMenu()
  }
})

// Prevent default behavior for anchor links
document.addEventListener("DOMContentLoaded", () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      scrollToSection(targetId)
    })
  })
})

// Enhanced button interactions
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      // Add ripple effect
      const ripple = document.createElement("span")
      ripple.classList.add("ripple")
      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
})

// Animate value function
function animateValue(element, start, end, duration, suffix = "") {
  let startTimestamp = null
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    const current = Math.floor(progress * (end - start) + start)

    if (suffix === "%") {
      element.textContent = current + "%"
    } else if (suffix === "$") {
      element.textContent = "$" + current
    } else if (suffix === "+") {
      element.textContent = current + "+"
    } else {
      element.textContent = current
    }

    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}

// Debounce function for performance
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(handleScroll, 10)
window.addEventListener("scroll", debouncedScrollHandler)

// Error handling for external links
function handleExternalLink(url, fallbackMessage) {
  try {
    window.open(url, "_blank", "noopener,noreferrer")
  } catch (error) {
    console.error("Failed to open external link:", error)
    alert(fallbackMessage || "Unable to open link. Please try again.")
  }
}

// Print optimization
function optimizeForPrint() {
  const style = document.createElement("style")
  style.textContent = `
    @media print {
      .navbar, .scroll-indicator, .mobile-menu { display: none !important; }
      .section { padding: 2rem 0 !important; }
      .card { break-inside: avoid; }
      body { font-size: 12pt; line-height: 1.4; }
    }
  `
  document.head.appendChild(style)
}

