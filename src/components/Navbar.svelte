<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { auth } from '../lib/firebase.js';
    import { toggleDarkMode } from '../stores/darkModeStore';
    import { LogOut, Moon, Palette, Sun, User } from 'lucide-svelte';
    import Modal from './Modal.svelte';
  
    let isDarkMode = writable(false);
    let user = writable(null);
    let showModal = writable(false);
    let showPalette = writable(false);

    function setColorTheme(themeClass) {
        if (typeof window !== 'undefined') {
            document.documentElement.classList.remove('theme-yellow', 'theme-pink', 'theme-gray', 'theme-blue');
            document.documentElement.classList.add(themeClass);
            localStorage.setItem('color-theme', themeClass);
        }
    }
    
    function loadSavedTheme() {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('color-theme');
            if (savedTheme) {
                document.documentElement.classList.add(savedTheme);
            }
        }
    }

    const themes = [
        { name: 'Sarı', class: 'theme-yellow', color: '#facc15' },
        { name: 'Pembe', class: 'theme-pink', color: '#fbcfe8' },
        { name: 'Gri', class: 'theme-gray', color: '#d1d5db' },
        { name: 'Lacivert', class: 'theme-blue', color: '#b4c6fc' },
    ];
  
    onMount(() => {
        const darkMode = localStorage.getItem('dark-mode') === 'false';
        document.body.classList.toggle('dark', darkMode);
        isDarkMode.set(darkMode);
  
        loadSavedTheme();
  
        auth.onAuthStateChanged((u) => user.set(u));
    });
  
    function handleToggleDarkMode() {
        toggleDarkMode();
        isDarkMode.update(current => {
            const newMode = !current;
            if (typeof window !== 'undefined') {
                localStorage.setItem('dark-mode', newMode);
            }
            return newMode;
        });
    }
  
    function handleSignOutClick() {
        showModal.set(true);
    }
  
    async function handleSignOut() {
        try {
            await auth.signOut();
            user.set(null);
        } catch (error) {
            console.error("Oturum kapatma başarısız:", error);
        }
        showModal.set(false);
    }
  
    function closeSignOutModal() {
        showModal.set(false);
    }
  
    function selectTheme(theme) {
        setColorTheme(theme.class);
        showPalette.set(false);
    }
  
    function togglePalette() {
        showPalette.update(value => !value);
    }
</script>

<nav class="flex justify-between items-center p-4">
    <h1 class="text-xl font-bold">Kronometre</h1>
    <div class="flex items-center space-x-4">
        <button class="btn" on:click={handleToggleDarkMode}>
            {#if $isDarkMode}
                <Moon />
            {:else}
                <Sun />
            {/if}
        </button>

        <button class="btn" on:click={togglePalette}><Palette/></button>
        {#if $showPalette}
            <div class="palette-container">
                {#each themes as theme}
                    <button
                        class="color-button"
                        style="background-color: {theme.color}; border: 2px solid {theme.class === document.documentElement.classList.contains(theme.class) ? '#000' : 'transparent'};"
                        on:click={() => selectTheme(theme)}
                        aria-label={theme.name}>
                    </button>
                {/each}
            </div>
        {/if}
        

        {#if $user}
            <button class="btn" on:click={handleSignOutClick}><LogOut /></button>
            {#if $user.photoURL}
                <img src={$user.photoURL} alt="Profile" class="w-10 h-10 rounded-full border-2 border-white" />
            {:else}
                <User />
            {/if}
        {:else}
            <a href="/login" class="btn btn-primary border-white">Giriş Yap</a>
        {/if}
    </div>
</nav>

<Modal
    show={$showModal}
    message="Çıkış yapmak istediğinize emin misiniz?"
    onClose={closeSignOutModal}
    onConfirm={handleSignOut} />
