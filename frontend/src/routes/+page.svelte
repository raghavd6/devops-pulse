<script>
  import { onMount } from 'svelte';
  import { getHealth, listNotes, createNote } from '$lib/api.js';

  let health = null;
  let notes = [];
  let title = '';
  let body = '';
  let error = '';
  let loading = true;

  async function refresh() {
    loading = true;
    error = '';
    try {
      health = await getHealth();
      notes = await listNotes();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function submit() {
    error = '';
    try {
      await createNote(title, body);
      title = '';
      body = '';
      await refresh();
    } catch (e) {
      error = e.message;
    }
  }

  onMount(refresh);
</script>

<svelte:head>
  <title>DevOps Pulse</title>
</svelte:head>

<main class="container">
  <h1>DevOps Pulse</h1>
  <p class="subtitle">A tiny app to demonstrate CI/CD, health checks and automated testing.</p>

  {#if loading}
    <p>Loading…</p>
  {:else}
    {#if error}
      <div class="error">{error}</div>
    {/if}

    <section class="card">
      <h2>Service health</h2>
      {#if health}
        <pre>{JSON.stringify(health, null, 2)}</pre>
      {:else}
        <p>Health unavailable.</p>
      {/if}
      <button on:click={refresh}>Refresh</button>
    </section>

    <section class="card">
      <h2>Deployment notes</h2>
      <div class="form">
        <input placeholder="Title" bind:value={title} maxlength="80" />
        <textarea placeholder="What changed?" bind:value={body} maxlength="500"></textarea>
        <button disabled={!title || !body} on:click={submit}>Add note</button>
      </div>

      {#if notes.length === 0}
        <p>No notes yet.</p>
      {:else}
        <ul>
          {#each notes as n}
            <li>
              <div class="note-title">{n.title}</div>
              <div class="note-body">{n.body}</div>
              <div class="note-meta">{new Date(n.createdAt).toLocaleString()}</div>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  {/if}

  <footer>
    <small>Tip: demo pipeline: lint → tests → build containers → deploy → smoke test.</small>
  </footer>
</main>

<style>
  .container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: system-ui, sans-serif; }
  .subtitle { color: #555; margin-bottom: 1.5rem; }
  .card { border: 1px solid #eee; border-radius: 12px; padding: 1rem; margin-bottom: 1rem; }
  .error { background: #ffe7e7; border: 1px solid #ffb3b3; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; }
  button { background: #0067b8; color: white; border: 0; padding: 0.5rem 0.75rem; border-radius: 8px; cursor: pointer; }
  button:disabled { opacity: 0.6; cursor: not-allowed; }
  input, textarea { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 8px; }
  textarea { min-height: 90px; }
  .form { display: grid; gap: 0.5rem; margin-bottom: 1rem; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { border-top: 1px solid #eee; padding: 0.75rem 0; }
  .note-title { font-weight: 650; }
  .note-body { color: #333; margin-top: 0.25rem; }
  .note-meta { color: #777; font-size: 0.85rem; margin-top: 0.25rem; }
  pre { background: #0b0b0b; color: #d7ffd7; padding: 0.75rem; border-radius: 10px; overflow: auto; }
  footer { margin-top: 1.5rem; color: #666; }
</style>
