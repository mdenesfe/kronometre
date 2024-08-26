<script>
  import { auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../../lib/firebase.js';
  import { goto } from '$app/navigation';
  
  let email = '';
  let password = '';
  let newEmail = '';
  let newPassword = '';
  let isRegister = false;

  async function googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      goto('/');
    } catch (error) {
      console.error("Google login failed:", error);
    }
  }

  async function emailLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      goto('/');
    } catch (error) {
      console.error("Email login failed:", error);
    }
  }

  async function register() {
    try {
      await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      goto('/');
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  async function googleRegister() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      goto('/');
    } catch (error) {
      console.error("Google registration failed:", error);
    }
  }
</script>

<div class="flex flex-col items-center justify-center h-screen p-6">
  {#if !isRegister}
    <div class="w-full max-w-sm p-6 rounded-lg shadow-md">
      <h1 class="text-4xl text-center font-bold mb-6">Giriş Yap</h1>
      <input 
        type="email" 
        placeholder="Email" 
        bind:value={email} 
        class="input w-full mb-4"
      />
      <input 
        type="password" 
        placeholder="Şifre" 
        bind:value={password} 
        class="input w-full mb-6"
      />
      <button class="btn btn-primary w-full mb-4" on:click={emailLogin}>Giriş Yap</button>
      <button class="btn w-full mb-4 bg-[#EA4335] text-white hover:bg-[#d62d20]" on:click={googleLogin}>Google ile Giriş Yap</button>

      <p class="mt-4 text-center">
        Hesabınız yok mu? <a href="/login" class="text-blue-500 hover:underline" on:click={() => isRegister = true}>Kayıt Ol</a>
      </p>
    </div>
  {/if}

  {#if isRegister}
    <div class="w-full max-w-sm p-6  rounded-lg shadow-md">
      <h1 class="text-4xl text-center font-bold mb-6">Kayıt Ol</h1>
      <input 
        type="email" 
        placeholder="Email" 
        bind:value={newEmail} 
        class="input w-full mb-4"
      />
      <input 
        type="password" 
        placeholder="Şifre" 
        bind:value={newPassword} 
        class="input w-full mb-6"
      />
      <button class="btn btn-primary w-full mb-4" on:click={register}>Kayıt Ol</button>
      <button class="btn w-full mb-4 bg-[#EA4335] text-white hover:bg-[#d62d20]" on:click={googleRegister}>
        Google ile Kayıt Ol
      </button>
            <p class="mt-4 text-center">
        Zaten hesabınız var mı? <a href="/login" class="text-blue-500 hover:underline" on:click={() => isRegister = false}>Giriş Yap</a>
      </p>
    </div>
  {/if}
</div>
