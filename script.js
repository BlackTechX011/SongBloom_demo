// Global state
let currentlyPlaying = null

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  initializeParticles()
  initializeContributionGraph()

  generateTextToSongTable("gen_cn", 16, "cn")
  generateTextToSongTable("gen_en", 13, "en")
})

// Create floating particles
function initializeParticles() {
  const particlesContainer = document.getElementById("particles")
  const particleCount = 50

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"

    // Random position
    particle.style.left = Math.random() * 100 + "%"
    particle.style.top = Math.random() * 100 + "%"

    // Random animation duration and delay
    const duration = 10 + Math.random() * 20
    const delay = Math.random() * 10

    particle.style.animationDuration = duration + "s"
    particle.style.animationDelay = delay + "s"

    particlesContainer.appendChild(particle)
  }
}

// Generate contribution graph
function initializeContributionGraph() {
  const grid = document.getElementById("contributionGrid")
  const today = new Date()

  // Generate 365 days of contribution data
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseChance = isWeekend ? 0.3 : 0.7

    let count = 0
    let level = 0

    if (Math.random() < baseChance) {
      count = Math.floor(Math.random() * 15) + 1
      if (count >= 12) level = 4
      else if (count >= 8) level = 3
      else if (count >= 4) level = 2
      else level = 1
    }

    const day = document.createElement("div")
    day.className = `contribution-day level-${level}`
    day.title = `${date.toISOString().split("T")[0]}: ${count} contributions`

    grid.appendChild(day)
  }
}

// Toggle play/pause for demo songs
function togglePlay(songId) {
  const button = event.target.closest(".play-button")
  const playIcon = button.querySelector(".play-icon")
  const pauseIcon = button.querySelector(".pause-icon")
  const buttonText = button.querySelector(".button-text")

  if (currentlyPlaying === songId) {
    // Stop playing
    currentlyPlaying = null
    playIcon.classList.remove("hidden")
    pauseIcon.classList.add("hidden")
    buttonText.textContent = "Play"

    // Reset all other buttons
    resetAllPlayButtons()
  } else {
    // Start playing
    currentlyPlaying = songId
    playIcon.classList.add("hidden")
    pauseIcon.classList.remove("hidden")
    buttonText.textContent = "Pause"

    // Reset all other buttons
    resetAllPlayButtons(button)

    // Simulate audio playback (in a real implementation, you'd use the Web Audio API)
    console.log(`Playing: ${songId}`)
  }
}

// Reset all play buttons except the active one
function resetAllPlayButtons(activeButton = null) {
  const allButtons = document.querySelectorAll(".play-button")

  allButtons.forEach((button) => {
    if (button !== activeButton) {
      const playIcon = button.querySelector(".play-icon")
      const pauseIcon = button.querySelector(".pause-icon")
      const buttonText = button.querySelector(".button-text")

      playIcon.classList.remove("hidden")
      pauseIcon.classList.add("hidden")
      buttonText.textContent = "Play"
    }
  })
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add intersection observer for fade-in animations
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

// Observe all sections for animations
document.querySelectorAll(".section").forEach((section) => {
  section.style.opacity = "0"
  section.style.transform = "translateY(30px)"
  section.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(section)
})

// Generate audio HTML
function createAudioHTML(path) {
  return `<audio controls controlslist="nodownload" class="audio-player">
    <source src="${path}" type="audio/wav">
    <source src="${path}" type="audio/mp3">
    <source src="${path}" type="audio/flac">
    Your browser does not support the audio element.
  </audio>`
}

// Fetch text for lyrics
async function getText(file, cell) {
  try {
    console.log("Fetching " + file)
    const response = await fetch(file)
    const text = await response.text()
    cell.innerHTML = text
  } catch (error) {
    console.error("Error fetching text:", error)
    cell.innerHTML = "Error loading lyrics"
  }
}

// Generate text-to-song table
function generateTextToSongTable(tableId, n_samples, lang) {
  const table = document.getElementById(tableId)
  if (!table) return

  // Clear existing content
  table.innerHTML = ""

  // Create table head
  const thead = table.createTHead()
  const headRow = thead.insertRow()

  const lyricsHeader = headRow.insertCell(0)
  lyricsHeader.innerHTML = "Lyrics"
  lyricsHeader.style.textAlign = "center"
  lyricsHeader.className = "table-header"

  const referenceHeader = headRow.insertCell(1)
  referenceHeader.innerHTML = "Reference"
  referenceHeader.style.textAlign = "center"
  referenceHeader.className = "table-header"

  const generatedHeader = headRow.insertCell(2)
  generatedHeader.innerHTML = "Generated"
  generatedHeader.style.textAlign = "center"
  generatedHeader.className = "table-header"

  // Create table body
  const tbody = table.createTBody()

  for (let i = 1; i <= n_samples; i++) {
    const row = tbody.insertRow()
    row.className = "table-row"

    const lyricsCell = row.insertCell(0)
    lyricsCell.className = "lyrics-cell"
    getText(`lyric/${lang}/${i}.txt`, lyricsCell)

    const referenceCell = row.insertCell(1)
    referenceCell.className = "audio-cell"
    referenceCell.innerHTML = createAudioHTML(`prompt/${lang}/${i}.mp3`)

    const generatedCell = row.insertCell(2)
    generatedCell.className = "audio-cell"
    generatedCell.innerHTML = createAudioHTML(`music/${lang}/${i}.flac`)
  }
}

function initializeAudioPlayers() {
  const audioPlayers = document.querySelectorAll(".audio-player")

  audioPlayers.forEach((player) => {
    player.addEventListener("play", () => {
      // Pause other audio players when one starts playing
      audioPlayers.forEach((otherPlayer) => {
        if (otherPlayer !== player && !otherPlayer.paused) {
          otherPlayer.pause()
        }
      })
    })

    // Add loading state
    player.addEventListener("loadstart", () => {
      player.style.opacity = "0.7"
    })

    player.addEventListener("canplay", () => {
      player.style.opacity = "1"
    })

    player.addEventListener("error", () => {
      player.style.opacity = "0.5"
      console.error("Audio loading error for:", player.src)
    })
  })
}

// Initialize audio players
document.addEventListener("DOMContentLoaded", () => {
  initializeAudioPlayers()
})
