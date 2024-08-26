<script>
    import { auth, db, collection, query, where, getDocs } from '../lib/firebase.js';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import Stopwatch from '../components/Stopwatch.svelte';
  import Navbar from '../components/Navbar.svelte';
  
    let workHours = writable([]);
    let user = writable(null);
  
    onMount(async () => {
      auth.onAuthStateChanged(async (u) => {
        user.set(u);
        if (u) {
          try {
            const q = query(collection(db, 'work_hours'), where('uid', '==', u.uid));
            const querySnapshot = await getDocs(q);
            let hoursData = querySnapshot.docs.map(doc => doc.data());
            workHours.set(hoursData);
          } catch (e) {
            console.error('Çalışma saatleri getirilemedi:', e);
          }
        }
      });
    });
  </script>
<main class="h-screen w-full overflow-hidden flex flex-col">
    <Navbar />
    <Stopwatch />
</main>