<script>
  import { fade, scale, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // State management
  export let showIntro = writable(true);
  let loaded = false;

  onMount(() => {
    // Trigger intro animations
    setTimeout(() => {
      loaded = true;
    }, 300);

    // Switch from intro to bio after 5 seconds
    const introTimeout = setTimeout(() => {
      showIntro.set(false);
    }, 5000);

    return () => {
      clearTimeout(introTimeout); // Cleanup timeout
    };
  });

  // Function to skip intro
  function skipIntro() {
    showIntro.set(false);
  }
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet">
</svelte:head>

<div class="intro-container">
  {#if loaded}
    <div class="intro-content" in:fade={{ duration: 1200 }}>
      <!-- Intro Title -->
      <h1 
        in:scale={{ duration: 1400, delay: 300 }}
        class="title font-orbitron"
      >
        Clara Introducing
      </h1>

      <!-- Tagline -->
      <p 
        in:fly={{ y: 20, duration: 1000, delay: 600 }}
        class="tagline font-orbitron"
      >
        Official Introducing of Ngo Van Hao
      </p>

      <!-- Loading Bar -->
      <div 
        in:fly={{ y: 30, duration: 1000, delay: 900 }}
        class="loading-bar-container"
        role="progressbar"
        aria-valuenow="0"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div class="loading-bar"></div>
      </div>

      <!-- Skip Button -->
      <button 
        class="skip-button font-orbitron"
        on:click={skipIntro}
        in:fade={{ duration: 500, delay: 1200 }}
      >
        Skip Intro
      </button>
    </div>
  {/if}
</div>

<style>
  .intro-container {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20; /* Ensure intro is above other content */
  }

  .intro-content {
    text-align: center;
  }

  .title {
    font-size: 5rem;
    background: linear-gradient(90deg, #00c4cc, #0074d9, #00ffcc, #00c4cc);
    background-size: 300%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: ocean-flow 8s infinite linear;
    text-shadow: 0 0 15px rgba(0, 196, 204, 0.8), 
                0 0 30px rgba(0, 116, 217, 0.6),
                0 0 60px rgba(0, 255, 204, 0.4);
  }

  .tagline {
    font-size: 1.5rem;
    color: #e6f7ff;
    margin: 1.5rem 0;
    text-shadow: 0 0 10px rgba(0, 196, 204, 0.5);
    animation: wave 4s infinite ease-in-out;
  }

  .loading-bar-container {
    width: 300px;
    height: 10px;
    background: rgba(0, 116, 217, 0.3);
    border-radius: 5px;
    overflow: hidden;
    margin: 2rem auto;
    box-shadow: 0 0 10px rgba(0, 196, 204, 0.5);
  }

  .loading-bar {
    width: 0;
    height: 100%;
    background: linear-gradient(45deg, #00c4cc, #0074d9);
    animation: load 5s linear forwards;
    border-radius: 5px;
  }

  .skip-button {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background: rgba(0, 196, 204, 0.5);
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
    font-family: 'Orbitron', sans-serif;
  }

  .skip-button:hover {
    background: rgba(0, 196, 204, 0.8);
  }

  @keyframes ocean-flow {
    0% { background-position: 0%; }
    100% { background-position: 300%; }
  }

  @keyframes wave {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  @keyframes load {
    0% { width: 0%; }
    100% { width: 100%; }
  }

  /* Responsive Design */
  @media (max-width: 600px) {
    .title {
      font-size: 3rem;
    }
    .tagline {
      font-size: 1.2rem;
    }
    .loading-bar-container {
      width: 200px;
    }
  }

  /* Accessibility: Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .title, .tagline, .loading-bar {
      animation: none !important;
      transform: none !important;
    }
  }

  .font-orbitron {
    font-family: 'Orbitron', sans-serif;
  }
</style>