<script>
	import Header from './routes/Header.svelte';
	import Footer from './routes/Footer.svelte';
	import Intro from './routes/Intro.svelte';
	import { writable } from 'svelte/store';
	let showIntro = writable(true);
</script>

<Header />
{#if $showIntro}
	<Intro {showIntro} />
{:else}
	<slot />
{/if}
<Footer />
