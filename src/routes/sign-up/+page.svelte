<script lang="ts">
  import SignUp from 'clerk-sveltekit/client/SignUp.svelte';
</script>

<div class="bg-base-200 flex min-h-screen items-center justify-center">
  <SignUp appearance={{
    variables: {
      colorPrimary: '#570df8', // Using example primary color
      colorBackground: '#ffffff', // Assuming base-100 is white
    },
    elements: {
      card: 'bg-base-100 shadow-lg',
      formButtonPrimary: 'btn btn-primary',
    }
  }} />
</div>
