<script>
    import { auth, db, collection, doc, getDoc, setDoc, query, where, getDocs } from '../lib/firebase.js';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import Modal from '../components/Modal.svelte';
    import { Shrink, Expand, Timer, Save, TimerOff, TimerReset } from 'lucide-svelte';

    let time = 0;
    let milliseconds = 0;
    let interval;
    let running = false;
    let workHours = writable([]);
    let user = writable(null);
    let showModal = false;
    let modalMessage = '';
    let expanded = false;

    onMount(() => {
        const storedTime = localStorage.getItem('time');
        const storedMilliseconds = localStorage.getItem('milliseconds');
        if (storedTime) {
            time = parseInt(storedTime);
            milliseconds = parseInt(storedMilliseconds);
            if (running) {
                start(); 
            }
        }

        auth.onAuthStateChanged(u => {
            user.set(u);
            if (u) fetchWorkHours(u.uid);
        });
    });

    async function fetchWorkHours(uid) {
        try {
            const q = query(collection(db, 'work_hours'), where('uid', '==', uid));
            const querySnapshot = await getDocs(q);
            workHours.set(querySnapshot.docs.map(doc => doc.data()));
        } catch (e) {
            console.error('Çalışma saatleri getirilemedi:', e);
        }
    }

    function start() {
        if (!running) {
            running = true;
            interval = setInterval(() => {
                milliseconds += 100;
                time = Math.floor(milliseconds / 1000);
                localStorage.setItem('time', time);
                localStorage.setItem('milliseconds', milliseconds);
            }, 100);
        }
    }

    async function stop() {
        if (running) {
            running = false;
            clearInterval(interval);
            localStorage.setItem('time', time);
            localStorage.setItem('milliseconds', milliseconds);
        }
    }

    function reset() {
        time = 0;
        milliseconds = 0;
        running = false;
        clearInterval(interval);
        localStorage.removeItem('time');
        localStorage.removeItem('milliseconds');
    }

    async function save() {
        if (auth.currentUser) {
            const seconds = time;
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            const today = new Date().toISOString().slice(0, 10);
            const { uid } = auth.currentUser;
            const docRef = doc(db, 'work_hours', `${uid}_${today}`);

            try {
                const docSnap = await getDoc(docRef);
                let totalHours = 0;
                let totalMinutes = 0;
                let totalSeconds = 0;

                if (docSnap.exists()) {
                    totalHours = parseInt(docSnap.data().hours) || 0;
                    totalMinutes = parseInt(docSnap.data().minutes) || 0;
                    totalSeconds = parseInt(docSnap.data().seconds) || 0;
                }

                totalSeconds += secs;
                totalMinutes += minutes + Math.floor(totalSeconds / 60);
                totalHours += hours + Math.floor(totalMinutes / 60);

                await setDoc(docRef, { 
                    uid, 
                    date: today, 
                    hours: totalHours, 
                    minutes: totalMinutes % 60, 
                    seconds: totalSeconds % 60 
                });
                
                await fetchWorkHours(uid);
                reset();
            } catch (e) {
                console.error('Çalışma saati kaydedilemedi:', e);
            }
        } else {
            modalMessage = 'Çalışma Saatlerinizi Kaydetmek İçin Giriş Yapın';
            showModal = true;
        }
    }

    function closeModal() {
        showModal = false;
    }

    function toggleExpand() {
        expanded = !expanded;
    }

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function formatMilliseconds(milliseconds) {
        const secs = Math.floor(milliseconds / 1000);
        const milliSecs = milliseconds % 1000;
        return `${formatTime(secs)}.${milliSecs.toString().padStart(3, '0')}`;
    }
</script>

<div class="flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-2">
    <div class="relative flex-1 p-4 md:p-6 rounded-lg shadow-2xl flex flex-col items-center justify-center">
        <button class="absolute top-2 right-2 text-xl" on:click={toggleExpand}>
            {#if expanded}
                <Shrink />
            {:else}
                <Expand />
            {/if}
        </button>
    
        <div class="text-4xl md:text-7xl sm:text-4xl font-mono mb-2">{formatMilliseconds(milliseconds)}</div>
    
        <div class="flex flex-row space-x-2 w-2/4">
            {#if !running}
                <button class="btn btn-icon py-2 px-3 text-base md:text-lg flex-1" on:click={start}> <Timer /> Başlat </button>
            {:else}
                <button class="btn btn-icon py-2 px-3 text-base md:text-lg flex-1" on:click={stop}> <TimerOff /> Durdur </button>
            {/if}
            
            <button class="btn btn-icon py-2 px-3 text-base md:text-lg flex-1" on:click={reset}><TimerReset /> Sıfırla</button>
            <button class="btn btn-icon py-2 px-3 text-base md:text-lg flex-1" on:click={save}> <Save /> Kaydet</button>
        </div>
    </div>
    
    
    
    

    {#if $user && !expanded}
    <div class="flex-1 max-w-full md:max-w-md mt-4 md:mt-0 p-4 rounded-lg shadow-2xl overflow-y-auto">
        <table class="w-full table-auto text-sm">
            <thead>
                <tr>
                    <th class="p-2 text-left">Tarih</th>
                    <th class="p-2 text-left">Süre</th>
                </tr>
            </thead>
            <tbody>
                {#each $workHours as hour}
                <tr>
                    <td class="p-2">{hour.date}</td>
                    <td class="p-2">{formatTime(hour.hours * 3600 + hour.minutes * 60 + hour.seconds)}</td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
    {/if}
</div>

<Modal show={showModal} message={modalMessage} onClose={closeModal} onConfirm={closeModal} />
