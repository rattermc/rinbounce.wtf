<script lang="ts">
    import { fade, slide, scale } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { cubicInOut } from 'svelte/easing';

    // --- Mobile Sidebar State ---
    let showMobileSidebar = false;
    function toggleMobileSidebar() {
        showMobileSidebar = !showMobileSidebar;
    }
    function closeMobileSidebar() {
        showMobileSidebar = false;
    }

    // --- Interfaces ---
    interface ClientConfig {
        name: string;
        description: string;
        status: 'Discontinued' | 'Actively Updated' | 'Unknown';
        risk: string;
        versions: { version: string; configs: { name: string; link: string }[] }[];
        downloadLink?: string;
        downloadLinks?: { type: string; link: string; version?: string }[];
        clientpreview?: string;
        folder?: string;
    }

    interface LoadingStatus {
        key: string;
        label: string;
        status: 'loading' | 'success' | 'error';
    }

    // --- State ---
    let clients: ClientConfig[] = [];
    let clientGroups: { [key: string]: string[] } = {};
    let selectedClient = '';
    let selectedVersion = '1.8.9';
    let isDropdownOpen: Record<string, boolean> = {};
    let mainClients: string[] = [];
    let searchQuery = '';
    let showDocumentation = false;
    let singleClientMode = false;
    let showLoadingOverlay = true;
    let loadingStatus: LoadingStatus[] = [
        { key: 'cloner', label: 'Cloner', status: 'loading' },
        { key: 'bot', label: 'Bot', status: 'loading' },
        { key: 'clients', label: 'Clients', status: 'loading' }
    ];

    let theme = 'dark';

    // --- Mobile Detection (SSR safe) ---
    let isMobile = false;
    if (typeof window !== 'undefined') {
        isMobile = window.innerWidth <= 768;
    }
    function checkMobile() {
        if (typeof window !== 'undefined') {
            isMobile = window.innerWidth <= 768;
        }
    }
    onMount(() => {
        checkMobile();
        window.addEventListener

('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    });

    // --- Theme Management ---
    function initializeTheme() {
        if (typeof window === 'undefined') return;
        const savedTheme = localStorage.getItem('theme');
        theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    function toggleTheme() {
        theme = theme === 'light' ? 'dark' : 'light';
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', theme);
            document.documentElement.classList.toggle('dark', theme === 'dark');
        }
    }

    // --- Translations ---
    const translations = {
        en: {
            title: '',
            clients: 'Clients',
            noClients: 'No clients found.',
            status: 'Status',
            risk: 'Risk',
            version: 'Version',
            configs: 'Configs',
            noConfigs: 'No configs available.',
            footer: 'Built with ❤️ for the Minecraft Cheat community',
            download: 'Get',
            searchPlaceholder: 'Search clients...',
            documentation: 'Documentation',
            statusDiscontinued: 'Discontinued: No longer updated or supported.',
            statusActivelyUpdated: 'Actively Updated: Regularly maintained with new features or fixes.',
            statusUnknown: 'Unknown: Status not verified or unclear.',
            riskUseAtOwnRisk: 'Use at Own Risk: Potential for bans or instability.',
            themeLight: 'Light mode',
            themeDark: 'Dark mode',
            themeSwitch: 'Switch theme'
        }
    };

    // --- Utilities ---
    const toTitleCase = (str: string) =>
        str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

    const normalizeClientName = (str: string) =>
        str.toLowerCase().replace(/\s+/g, '-');

    const isValidClient = (client: any): boolean => {
        if (!client || typeof client !== 'object') return false;
        if (typeof client.name !== 'string' || !client.name) return false;
        if (typeof client.description !== 'string' || !client.description) return false;
        if (client.downloadLink && client.downloadLinks) return false;
        if (client.downloadLink && typeof client.downloadLink !== 'string') return false;
        if (client.downloadLinks && !Array.isArray(client.downloadLinks)) return false;
        if (client.downloadLinks && !client.downloadLinks.every((dl: any) =>
            typeof dl.type === 'string' && typeof dl.link === 'string')) return false;
        if (!['Discontinued', 'Actively Updated', 'Unknown'].includes(client.status)) return false;
        if (typeof client.risk !== 'string' || !client.risk) return false;
        if (!Array.isArray(client.versions)) return false;
        if (client.clientpreview && typeof client.clientpreview !== 'string') return false;
        return client.versions.every((v: any) =>
            typeof v.version === 'string' &&
            Array.isArray(v.configs) &&
            v.configs.every((c: any) =>
                typeof c.name === 'string' && typeof c.link === 'string'));
    };

    const getYouTubeEmbedUrl = (url: string): string => {
        const videoId = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    };

    const downloadConfig = (link: string) => {
        const a = document.createElement('a');
        a.href = link;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // --- Client Grouping ---
    function updateClientGroups() {
        const filteredClients = clients.filter(client =>
            !searchQuery ||
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        singleClientMode = filteredClients.length === 1;
        if (singleClientMode) {
            const client = filteredClients[0];
            mainClients = [client.name];
            clientGroups = { [normalizeClientName(client.name)]: [client.name] };
        } else {
            clientGroups = filteredClients.reduce((acc, client) => {
                const folder = client.folder || normalizeClientName(client.name);
                acc[folder] = acc[folder] || [];
                acc[folder].push(client.name);
                return acc;
            }, {} as { [key: string]: string[] });

            mainClients = Object.keys(clientGroups)
                .sort((a, b) => clientGroups[b].length - clientGroups[a].length || a.localeCompare(b))
                .map(toTitleCase);
        }
    }

    // --- Event Handlers ---
    function toggleDropdown(folder: string) {
        isDropdownOpen = { ...isDropdownOpen, [folder]: !isDropdownOpen[folder] };
    }

    function selectClient(client: string) {
        showDocumentation = false;
        selectedClient = client;
        selectedVersion = clients.find(c => c.name === client)?.versions[0]?.version || '1.8.9';
        window.location.hash = normalizeClientName(client);
        isDropdownOpen = {};
        closeMobileSidebar();
    }

    function selectDocumentation() {
        showDocumentation = true;
        selectedClient = '';
        window.location.hash = 'documentation';
        isDropdownOpen = {};
        closeMobileSidebar();
    }

    // --- Lifecycle ---
    onMount(async () => {
        initializeTheme();

        // Check Cloner
        try {
            const res = await fetch('https://cloner.theatlantis.asia/');
            loadingStatus = loadingStatus.map(s =>
                s.key === 'cloner' ? { ...s, status: res.ok ? 'success' : 'error' } : s);
        } catch {
            loadingStatus = loadingStatus.map(s =>
                s.key === 'cloner' ? { ...s, status: 'error' } : s);
        }

        // Check Bot
        try {
            const res = await fetch('https://theatlantis.asia/');
            loadingStatus = loadingStatus.map(s =>
                s.key === 'bot' ? { ...s, status: res.ok ? 'success' : 'error' } : s);
        } catch {
            loadingStatus = loadingStatus.map(s =>
                s.key === 'bot' ? { ...s, status: 'error' } : s);
        }

        // Load Clients
        try {
            const clientModules = import.meta.glob('/src/clients/**/*.js', { eager: true });
            clients = Object.entries(clientModules)
                .map(([path, module]) => {
                    const folder = path.match(/\/src\/clients\/([^/]+)\//)?.[1] || '';
                    const clientData = (module as any).default;
                    const clientsInModule = Array.isArray(clientData) ? clientData : [clientData];
                    return clientsInModule
                        .filter(isValidClient)
                        .map(client => ({ ...client, folder }));
                })
                .flat();
            updateClientGroups();
            loadingStatus = loadingStatus.map(s =>
                s.key === 'clients' ? { ...s, status: 'success' } : s);
        } catch (error) {
            console.error('Failed to load clients:', error);
            loadingStatus = loadingStatus.map(s =>
                s.key === 'clients' ? { ...s, status: 'error' } : s);
        }

        // Hide Overlay
        setTimeout(() => showLoadingOverlay = false, 1200);

        // Handle Hash
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (hash) {
            if (hash === 'documentation') {
                selectDocumentation();
            } else {
                const client = clients.find(c => normalizeClientName(c.name) === hash);
                if (client) selectClient(client.name);
            }
        }
    });

    // --- Reactive ---
    $: updateClientGroups();
    $: selectedClientData = clients.find(c => c.name === selectedClient);
    $: filteredVersions = selectedClientData?.versions || [];
    $: filteredConfigs = filteredVersions.find(v => v.version === selectedVersion)?.configs || [];
    $: clientDescription = selectedClientData?.description || '';
    $: clientStatus = selectedClientData?.status || '';
    $: clientRisk = selectedClientData?.risk || '';
    $: clientPreview = selectedClientData?.clientpreview || '';
</script>

<div class="min-h-screen p-2 font-sans transition-colors duration-500 ease-in-out
    {theme === 'light' ? 'bg-gradient-to-br from-pink-200 via-white to-pink-100 text-pink-900' : 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'}
    {isMobile ? 'flex flex-col gap-0' : 'flex gap-2'}">

    {#if showLoadingOverlay}
        <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 text-white backdrop-blur-sm"
             in:fade={{ duration: 400, easing: cubicInOut }} out:fade={{ duration: 400, easing: cubicInOut }}>
            <div class="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-pink-900/80 rounded-xl p-6 shadow-xl w-full max-w-[90%] animate-fadein">
                <h2 class="text-xl font-bold mb-4 text-center text-pink-200 tracking-wide animate-bounce-slow">Loading Functions</h2>
                <ul class="space-y-3">
                    {#each loadingStatus as { label, status }}
                        <li class="flex items-center gap-2">
                            <span class="font-medium text-sm animate-fadein-delay">{label}</span>
                            {#if status === 'loading'}
                                <span class="ml-auto flex items-center gap-1 text-yellow-300 animate-pulse-slow">
                                    <svg class="w-4 h-4 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke-width="2" class="opacity-30"/>
                                        <path stroke-width="2" d="M12 2a10 10 0 0110 10"/>
                                    </svg>
                                    Loading...
                                </span>
                            {:else if status === 'success'}
                                <span class="ml-auto flex items-center gap-1 text-green-400 animate-fadein-delay">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    OK
                                </span>
                            {:else}
                                <span class="ml-auto flex items-center gap-1 text-red-400 animate-fadein-delay">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                    Error
                                </span>
                            {/if}
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    {/if}

    <!-- Theme Toggle -->
    <button class="fixed top-2 right-2 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md border
                   {theme === 'light' ? 'bg-white/90 text-pink-700 hover:bg-pink-100 border-pink-200' : 'bg-gray-900/90 text-pink-200 hover:bg-gray-800 border-gray-700'}
                   transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            on:click={toggleTheme} aria-label={translations.en.themeSwitch}>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if theme === 'light'}
                <circle cx="12" cy="12" r="5" stroke-width="2"/>
                <path stroke-width="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"/>
            {:else}
                <path stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
            {/if}
        </svg>
        <span class="text-xs font-medium">{theme === 'light' ? translations.en.themeLight : translations.en.themeDark}</span>
    </button>

    {#if isMobile}
        <!-- Mobile Hamburger Button -->
        <button class="fixed top-2 left-2 z-50 p-2 rounded-full shadow-md border
                       {theme === 'light' ? 'bg-white/90 text-pink-700 hover:bg-pink-100 border-pink-200' : 'bg-gray-900/90 text-pink-200 hover:bg-gray-800 border-gray-700'}
                       transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                on:click={toggleMobileSidebar} aria-label="Toggle sidebar">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>

        <!-- Mobile Sidebar -->
        {#if showMobileSidebar}
            <button type="button"
                class="fixed inset-0 z-[9998] bg-black/60 focus:outline-none"
                on:click={closeMobileSidebar}
                on:keydown={(e) => { if (e.key === 'Escape') closeMobileSidebar(); }}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile Sidebar Overlay"
                tabindex="0"
                style="padding:0;margin:0;border:none;">
                <div class="w-4/5 max-w-xs h-full bg-white dark:bg-gray-900 p-4 shadow-xl"
                     in:slide={{ duration: 300, easing: cubicInOut, axis: 'x' }}
                     out:slide={{ duration: 300, easing: cubicInOut, axis: 'x' }}
                     on:click|stopPropagation>
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-lg font-bold text-pink-500 dark:text-cyan-300">{translations.en.clients}</span>
                        <button class="text-gray-400 hover:text-pink-400 text-xl font-bold"
                                on:click={closeMobileSidebar}
                                aria-label="Close sidebar">×</button>
                    </div>
                    <input type="text" bind:value={searchQuery} placeholder={translations.en.searchPlaceholder}
                           class="w-full p-2 rounded-lg text-sm shadow-md border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:focus:ring-cyan-300 focus:ring-pink-300 focus:ring-1 mb-3"/>
                    {#if !mainClients.length}
                        <p class="text-xs italic text-gray-400 dark:text-gray-500">{translations.en.noClients}</p>
                    {/if}
                    {#each mainClients as mainClient}
                        <div class="mb-2">
                            {#if singleClientMode}
                                <button on:click={() => selectClient(mainClient)}
                                        class="w-full text-left p-2 rounded-lg text-sm font-medium
                                               {theme === 'light' ? `hover:bg-pink-100 ${selectedClient === mainClient ? 'bg-pink-200 text-pink-900 font-bold' : 'text-pink-700'}` :
                                               `hover:bg-cyan-900 ${selectedClient === mainClient ? 'bg-cyan-800 text-white font-bold' : 'text-gray-200'}`}">
                                    <span class="flex items-center">
                                        <svg class="w-4 h-4 mr-2 {theme === 'light' ? 'text-pink-400' : 'text-cyan-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                        </svg>
                                        {mainClient}
                                    </span>
                                </button>
                            {:else}
                                <button on:click={() => clientGroups[normalizeClientName(mainClient)]?.length > 1 ? toggleDropdown(normalizeClientName(mainClient)) : selectClient(clientGroups[normalizeClientName(mainClient)][0])}
                                        class="w-full text-left p-2 rounded-lg text-sm font-medium flex justify-between items-center
                                               {theme === 'light' ? `hover:bg-pink-100 text-pink-700` : `hover:bg-cyan-900 text-gray-200`}">
                                    <span>{mainClient}</span>
                                    {#if clientGroups[normalizeClientName(mainClient)]?.length > 1}
                                        <svg class="w-4 h-4 {isDropdownOpen[normalizeClientName(mainClient)] ? 'rotate-90' : ''} transition-transform duration-300 {theme === 'light' ? 'text-pink-400' : 'text-cyan-400'}"
                                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                        </svg>
                                    {/if}
                                </button>
                                {#if isDropdownOpen[normalizeClientName(mainClient)] && clientGroups[normalizeClientName(mainClient)]?.length > 1}
                                    <div class="pl-4 mt-1 space-y-1">
                                        {#each clientGroups[normalizeClientName(mainClient)] as client}
                                            <button on:click={() => selectClient(client)}
                                                    class="w-full text-left p-1.5 rounded-lg text-xs font-medium
                                                           {theme === 'light' ? `hover:bg-pink-100 ${selectedClient === client ? 'bg-pink-200 text-pink-900 font-bold' : 'text-pink-600'}` :
                                                           `hover:bg-gray-700 ${selectedClient === client ? 'bg-cyan-800 text-white font-bold' : 'text-gray-300'}`}">
                                                <span class="flex items-center">
                                                    <svg class="w-3 h-3 mr-2 {theme === 'light' ? 'text-pink-400' : 'text-cyan-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                                    </svg>
                                                    {client}
                                                </span>
                                            </button>
                                        {/each}
                                    </div>
                                {/if}
                            {/if}
                        </div>
                    {/each}
                    <hr class="my-3 border-gray-200 dark:border-gray-700"/>
                    <button on:click={selectDocumentation}
                            class="w-full text-left p-2 rounded-lg text-sm font-medium italic
                                   {theme === 'light' ? `hover:bg-pink-100 ${showDocumentation ? 'bg-pink-200 text-pink-900 font-bold' : 'text-pink-700'}` : 
                                   `hover:bg-gray-700 ${showDocumentation ? 'bg-cyan-800 text-white font-bold' : 'text-gray-200'}`}">
                        <span class="flex items-center">
                            <svg class="w-4 h-4 mr-2 {theme === 'light' ? 'text-pink-400' : 'text-cyan-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            {translations.en.documentation}
                        </span>
                    </button>
                </div>
            </button>
        {/if}
    {:else}
        <!-- PC Sidebar -->
        <aside class="w-56 rounded-lg p-2 flex flex-col gap-2 shadow-lg border
                      {theme === 'light' ? 'bg-white/80 border-pink-100' : 'bg-gray-800/90 border-gray-700'}
                      transition-all duration-300"
               in:fade={{ duration: 200, easing: cubicInOut }}>
            <input type="text" bind:value={searchQuery} placeholder={translations.en.searchPlaceholder}
                   class="w-full p-2 rounded-md text-sm border shadow-sm
                         {theme === 'light' ? 'bg-pink-50 text-pink-600 placeholder-pink-300 focus:ring-2 focus:ring-pink-300' : 'bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-400'}"/>
            
            {#if !mainClients.length}
                <p class="text-xs italic {theme === 'light' ? 'text-pink-400' : 'text-gray-400'}">{translations.en.noClients}</p>
            {/if}

            {#each mainClients as mainClient}
                <div>
                    {#if singleClientMode}
                        <button on:click={() => selectClient(mainClient)}
                                class="w-full text-left p-2 rounded-md text-sm font-medium shadow-sm
                                      {theme === 'light' ? `hover:bg-pink-100 ${selectedClient === mainClient ? 'bg-pink-200 text-pink-900 font-bold' : 'text-pink-700'}` : 
                                      `hover:bg-gray-700 ${selectedClient === mainClient ? 'bg-cyan-800 text-white font-bold' : 'text-gray-100'}`}">
                            <span class="flex items-center">
                                <svg class="w-4 h-4 mr-2 {theme === 'light' ? 'text-pink-400' : 'text-cyan-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                                {mainClient}
                            </span>
                        </button>
                    {:else}
                        <button on:click={() => clientGroups[normalizeClientName(mainClient)]?.length > 1 ? toggleDropdown(normalizeClientName(mainClient)) : selectClient(clientGroups[normalizeClientName(mainClient)][0])}
                                class="w-full text-left p-2 rounded-md text-sm font-medium flex justify-between items-center shadow-sm
                                      {theme === 'light' ? 'hover:bg-pink-100 text-pink-700' : 'hover:bg-gray-700 text-gray-100'}">
                            <span>{mainClient}</span>
                            {#if clientGroups[normalizeClientName(mainClient)]?.length > 1}
                                <svg class="w-4 h-4 transition-transform duration-200 {isDropdownOpen[normalizeClientName(mainClient)] ? 'rotate-180' : ''} {theme === 'light' ? 'text-pink-400' : 'text-cyan-400'}"
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            {/if}
                        </button>
                        {#if isDropdownOpen[normalizeClientName(mainClient)] && clientGroups[normalizeClientName(mainClient)]?.length > 1}
                            <div class="mt-1 space-y-1 pl-4"
                                 in:slide={{ duration: 200, easing: cubicInOut }} out:slide={{ duration: 200, easing: cubicInOut }}>
                                {#each clientGroups[normalizeClientName(mainClient)] as client}
                                    <button on:click={() => selectClient(client)}
                                            class="w-full text-left p-1.5 rounded-md text-xs font-medium
                                                  {theme === 'light' ? `hover:bg-pink-100 ${selectedClient === client ? 'bg-pink-200 text-pink-900 font-bold' : 'text-pink-600'}` : 
                                                  `hover:bg-gray-700 ${selectedClient === client ? 'bg-cyan-800 text-white font-bold' : 'text-gray-300'}`}">
                                        <span class="flex items-center">
                                            <svg class="w-3 h-3 mr-2 {theme === 'light' ? 'text-pink-400' : 'text-cyan-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                            {client}
                                        </span>
                                    </button>
                                {/each}
                            </div>
                        {/if}
                    {/if}
                </div>
            {/each}

            <hr class="my-3 border-gray-200 dark:border-gray-700"/>
            <button on:click={selectDocumentation}
                    class="w-full text-left p-2 rounded-md text-sm font-medium italic shadow-sm
                          {theme === 'light' ? `hover:bg-pink-100 ${showDocumentation ? 'bg-pink-200 text-pink-900 font-bold' : 'text-pink-700'}` : 
                          `hover:bg-gray-700 ${showDocumentation ? 'bg-cyan-800 text-white font-bold' : 'text-gray-100'}`}">
                <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2 {theme === 'light' ? 'text-pink-400' : 'text-cyan-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    {translations.en.documentation}
                </span>
            </button>
        </aside>
    {/if}

    <!-- Main Content -->
    <main class="flex-1 rounded-lg p-3 flex flex-col min-h-[calc(100vh-4px)] shadow-sm
                 {theme === 'light' ? 'bg-white/80 border-pink-100' : 'bg-gray-900/80 border-gray-700'}
                 transition-all duration-300
                 {isMobile ? 'p-3 pt-12 rounded-none shadow-none' : ''}"
          in:fade={{ duration: 200, easing: cubicInOut }}>
        <h1 class="text-xl font-semibold text-center mb-3 text-transparent bg-clip-text bg-gradient-to-r
                   {theme === 'light' ? 'from-pink-400 to-white' : 'from-cyan-400 to-blue-400'}">
            {translations.en.title}
        </h1>

        {#if showDocumentation}
            <div class="max-w-sm mx-auto {theme === 'light' ? 'text-pink-600' : 'text-gray-200'}"
                 in:fade={{ duration: 200, easing: cubicInOut }}>
                <h2 class="text-base font-bold mb-2 text-pink-500 dark:text-blue-400">
                    {translations.en.documentation}
                </h2>
                <ul class="text-xs space-y-1.5 leading-relaxed">
                    {#each [translations.en.statusDiscontinued, translations.en.statusActivelyUpdated, translations.en.statusUnknown, translations.en.riskUseAtOwnRisk] as item}
                        <li class="flex items-start">
                            <svg class="w-3 h-3 mr-1.5 mt-1 text-pink-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6"/>
                            </svg>
                            {item}
                        </li>
                    {/each}
                </ul>
            </div>
        {:else if selectedClient}
            {#if clientPreview}
                <div class="mb-4" in:scale={{ duration: 200, easing: cubicInOut }}>
                    <iframe class="w-full max-w-lg mx-auto rounded-lg aspect-video border {theme === 'light' ? 'border-pink-200/50' : 'border-gray-700'} shadow-sm"
                            src={getYouTubeEmbedUrl(clientPreview)} frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen title="{selectedClient} Preview"></iframe>
                </div>
            {:else}
                <p class="text-xs italic text-center mb-3 {theme === 'light' ? 'text-pink-400' : 'text-gray-400'}">
                    Debug: No preview URL found.
                </p>
            {/if}

            <div class="mb-4">
                <h2 class="text-base font-semibold mb-1.5 text-pink-600 dark:text-cyan-400">
                    {selectedClient}
                </h2>
                <p class="text-xs leading-tight max-w-sm {theme === 'light' ? 'text-pink-600' : 'text-gray-200'}">
                    {clientDescription}
                </p>
                <div class="mt-1.5 flex flex-wrap gap-1.5">
                    <p class="text-xs font-medium {theme === 'light' ? 'text-pink-500' : 'text-gray-300'}">
                        <strong>{translations.en.status}:</strong>
                        <span class="ml-1 px-1.5 py-0.5 rounded-sm text-xs
                                     {theme === 'light' ? 
                                     clientStatus === 'Actively Updated' ? 'bg-pink-200/80 text-pink-700' :
                                     clientStatus === 'Discontinued' ? 'bg-pink-100/80 text-pink-400' : 'bg-pink-50/80 text-pink-400' :
                                     clientStatus === 'Actively Updated' ? 'bg-green-600/20 text-green-400' :
                                     clientStatus === 'Discontinued' ? 'bg-red-600/20 text-red-300' : 'bg-gray-600/20 text-gray-300'}">
                            {clientStatus}
                        </span>
                    </p>
                    <p class="text-xs font-medium {theme === 'light' ? 'text-pink-500' : 'text-gray-300'}">
                        <strong>{translations.en.risk}:</strong>
                        <span class="ml-1 px-1.5 py-0.5 rounded-sm text-xs
                                     {theme === 'light' ? 
                                     clientRisk === 'Safe to Use' ? 'bg-pink-200/80 text-pink-700' : 'bg-pink-100/80 text-pink-400' :
                                     clientRisk === 'Safe to Use' ? 'bg-green-600/20 text-green-300' : 'bg-yellow-600/20 text-yellow-400'}">
                            {clientRisk}
                        </span>
                    </p>
                </div>
            </div>

            {#each filteredVersions as version}
                <div class="mb-4">
                    <h2 class="text-sm font-semibold mb-1.5 text-blue-600 dark:text-purple-400">
                        {translations.en.version} {version.version}
                    </h2>
                    {#if selectedClientData?.downloadLinks}
                        <div class="flex flex-col gap-1.5">
                            {#each selectedClientData.downloadLinks.filter(dl => dl.version === version.version || !dl.version) as dl}
                                <a href={dl.link} target="_blank"
                                   class="inline-block text-xs font-medium px-3 py-1 rounded-md shadow-sm transition-all duration-200 hover:scale-105
                                         {theme === 'light' ? 'bg-pink-200/80 hover:bg-pink-300/80 text-gray-900' : 'bg-cyan-600/20 hover:bg-cyan-500/30 text-white'}">
                                    <span class="flex items-center">
                                        <svg class="w-3 h-3 mr-1 {theme === 'light' ? 'text-pink-400' : 'text-cyan-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                        </svg>
                                        {translations.en.download} {selectedClient} {version.version} ({dl.type})
                                    </span>
                                </a>
                            {/each}
                        </div>
                    {:else if selectedClientData?.downloadLink}
                        <a href="{selectedClientData.downloadLink}" target="_blank"
                           class="inline-block text-xs font-medium px-3 py-1 rounded-md shadow-sm transition-all duration-200 hover:scale-105
                                 {theme === 'light' ? 'bg-pink-200/80 hover:bg-pink-300/80 text-gray-900' : 'bg-cyan-600/20 hover:bg-cyan-500/30 text-white'}">
                            <span class="flex items-center">
                                <svg class="w-3 h-3 mr-1 {theme === 'light' ? 'text-pink-400' : 'text-cyan-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                                {translations.en.download} {selectedClient} {version.version}
                            </span>
                        </a>
                    {/if}

                    <h3 class="text-xs font-semibold mt-3 mb-1.5 text-pink-500 dark:text-teal-400">
                        {translations.en.configs}
                    </h3>
                    {#if version.configs.length}
                        <ul class="space-y-1" in:slide={{ duration: 150, easing: cubicInOut }}>
                            {#each version.configs as config}
                                <li>
                                    <button on:click={() => downloadConfig(config.link)}
                                            class="text-xs font-medium border rounded-md px-2.5 py-1 shadow-sm transition-all duration-200 hover:scale-105
                                                  {theme === 'light' ? 'text-pink-400 hover:text-pink-500 border-pink-300/50 hover:border-pink-400 bg-white/60' : 
                                                  'text-cyan-400 hover:text-cyan-300 border-cyan-400/50 hover:border-cyan-300 bg-gray-800/30'}">
                                        <span class="flex items-center">
                                            <svg class="w-2.5 h-2.5 mr-1 {theme === 'light' ? 'text-pink-400' : 'text-cyan-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                            </svg>
                                            {config.name}
                                        </span>
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <p class="text-xs italic text-pink-400 dark:text-gray-400">{translations.en.noConfigs}</p>
                    {/if}
                </div>
            {/each}
        {/if}

        <footer class="text-center text-xs mt-auto {theme === 'light' ? 'text-pink-300' : 'text-gray-400'}">
            {translations.en.footer}
        </footer>
    </main>

    <!-- Discord Button -->
    <a id="discord-button" href="https://discord.com/invite/fBNZyvfMGe" target="_blank"
       class="fixed bottom-2 right-2 z-50 flex items-center justify-center w-12 h-12 rounded-lg shadow-md border transition-all duration-200 hover:scale-110
             {theme === 'light' ? 'bg-pink-200/80 hover:bg-pink-300/80 border-pink-200 text-gray-900' : 
             'bg-cyan-600/20 hover:bg-cyan-500/30 border-gray-600 text-white'}">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.369a19.7913 0 00-4.8851-1.5152 .0741 .0741 0 00-.0785.0371c-.211.7-.375-.4447-.8648-.6083-.2495-1.8447-.2762-.3.68-.2762-.5361 0-.1636-.3857-.3968-.8752-.6083-.2495 a .077 .077 0 00-.0785-.037 19.7363 0 00-4.8851 1.515 .0699 .0699 0 00-.032 .0277C5.5336 9.045.319-0.3.5799.0992 18.0578 a .0824 .0824 0 00.0312 .0561c2.0528 1.5075 4.0413 2.4228 5.9929 3.0294 a .0777 .0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.2260-.9942 a .076 .076 0 00.0416-.1056c-.6528-.2476-1.2743-.5495-1.8722-.8923 a .077 .077 0 00-.0076-.1277c.1258.0942.2517-.1923.3718-.2914 a .0743 .0743 0 00-.0776-.0105c3.9278 1.7933 8.18 1.7933 11.8266 0 a .0739 .0739 0 00-.0785.0094c.1202.0991.2460.1981.3728.2924 a .0743 .0743 0 00.1276-.0066c.1202-.1258.1981-.2517.2924-.3718 a .0743 .0743 0 00-.0105-.1276 12.2986 12.2986 0 01-1.8732.8913 a .0766 .0766 0 00.0407.1067c.3604.698.7719.3628 1.225.9952 a .076 .076 0 00.0842-.0286c1.961-.6061 3.9495-1.5219 5.9923-3.0294 a .0747 .0747 0 00.0313-.0552c-.5004-.5.177.8382-.9.6739-3.5485-.13.6604-.061.061-.0312-.0286M8.02 15.3312a2 2 0 00-2.1569-1.0857 2 2 0 00-2.1569 1.0857 2 2 0 00-.0952 2.1568 2 2 0 002.419 0 2 2 0 00.0952-2.1568zm6.9748 0a2 2 0 00-2.1569-1.0857 2 2 0 00-2.1569 1.0857 2 2 0 00-.0952 2.1568 2 2 0 002.419 0 2 2 0 00.0952-2.1568z"/>
        </svg>
    </a>
</div>

<style>
    @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
    :global(body) {
        font-family: 'Inter', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', Arial;
        min-height: 100vh;
        background: linear-gradient(135deg, #ffe4f7 0%, #fff 50%, #ffd6f7 100%);
        transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    :global(.dark body) {
        background: linear-gradient(135deg, #1e3a8a 0%, #111827 50%, #4c1d95 100%);
        color: #fff;
        transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    :global(a, button) {
        transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, transform 0.2s ease-in-out, border-color 0.2s ease-in-out;
    }
    .animate-pulse-slow {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(255, 182, 193, 0.3); }
        50% { box-shadow: 0 0 0 8px rgba(255, 182, 193, 0); }
    }
    .aspect-video { aspect-ratio: 16 / 9; }

    /* Custom Animations */
    .animate-fadein {
        animation: fadein 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .animate-bounce-slow {
        animation: bounce 1.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
    }
    .animate-spin-slow {
        animation: spin-slow 1.5s linear infinite;
    }
    .animate-fadein-delay {
        animation: fadein 1s ease-out 0.2s both;
    }
    @keyframes fadein {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
    @keyframes spin-slow {
        100% { transform: rotate(360deg); }
    }
</style>