<script>
    export let show = false;
    export let message = '';
    export let onClose;
    export let onConfirm;
  
    function handleClose() {
      onClose();
    }
  
    function handleConfirm() {
      onConfirm();
    }
  </script>
  
  {#if show}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-lg text-black max-w-sm w-full flex flex-col">
        <div class="flex-1">
          <p>{message}</p>
        </div>
        <div class="flex justify-end space-x-4 mt-4">
          <button class="btn btn-outline" on:click={handleClose}>İptal</button>
          <button class="btn btn-primary" on:click={handleConfirm}>Tamam</button>
        </div>
      </div>
    </div>
  {/if}
  