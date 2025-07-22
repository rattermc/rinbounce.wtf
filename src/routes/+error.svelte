<script>
    import { onMount } from 'svelte';
  
    let searchQuery = '';
    function handleSearch(event) {
      if (event.key === 'Enter' && searchQuery.trim()) {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      }
    }
  </script>
  
  <svelte:head>
    <title>404 - Lost in the Sky</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <style>
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      .animate-bounce-slow {
        animation: bounce-slow 3s infinite;
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .animate-float {
        animation: float 5s ease-in-out infinite;
      }
    </style>
  </svelte:head>
  
  <div class="bg-gradient-to-br from-blue-300 via-blue-400 to-orange-400 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Cloud Elements -->
    <div class="absolute top-10 left-10 text-6xl opacity-50 animate-float">☁️</div>
    <div class="absolute bottom-20 right-10 text-8xl opacity-50 animate-float delay-1000">☁️</div>
  
    <div class="container max-w-2xl mx-auto text-center bg-blue-50 rounded-2xl shadow-xl p-8 md:p-12 relative z-10">
      <!-- Animated 404 -->
      <h1 class="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500 animate-pulse">
        404
      </h1>
      
      <!-- Updated Title with Sky Theme -->
      <h2 class="text-2xl md:text-3xl font-semibold text-blue-800 mt-4 flex items-center justify-center gap-2">
        Lost in the Sky!
        <span class="text-3xl">🌤️</span>
      </h2>
      
      <!-- Description]Description -->
      <p class="text-blue-700 mt-4 text-lg">
        Looks like you've drifted into the clouds. The page you're seeking doesn't exist (or has floated away)!
      </p>
  
      <!-- Search Bar -->
      <div class="mt-8 relative max-w-md mx-auto">
        <input 
          type="text" 
          placeholder="Search for your destination..." 
          bind:value={searchQuery}
          on:keydown={handleSearch}
          class="w-full p-3 pl-10 rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:outline-none transition-colors"
        >
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
          <i class="fas fa-search"></i>
        </span>
      </div>
  
      <!-- Action Buttons -->
      <div class="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <a 
          href="/" 
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <i class="fas fa-home mr-2"></i> Return Home
        </a>
        <button 
          on:click={() => history.back()} 
          class="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <i class="fas fa-arrow-left mr-2"></i> Go Back
        </button>
      </div>
  
      <!-- Fun Hot Air Balloon Animation -->
      <div class="mt-10 relative">
        <div class="animate-bounce-slow">
          <span class="text-6xl">🎈</span>
        </div>
        <div class="absolute -top-4 -left-4 animate-spin-slow text-2xl text-yellow-400">🌟</div>
        <div class="absolute -top-4 -right-4 animate-spin text-2xl text-yellow-400">✨</div>
      </div>
  
      <!-- Contact Link -->
      <p class="mt-6 text-blue-600 text-sm">
        Need help? 
        <a href="/contact" class="text-orange-500 hover:text-orange-600 transition-colors">Contact Sky Patrol</a>
      </p>
    </div>
  </div>