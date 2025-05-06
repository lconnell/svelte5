<script lang="ts">
	// For icons
	// DaisyUI 5 supports Material Symbols Outlined with the right font loaded.
	// If not present, add this to your app.html: <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

	import { onMount } from 'svelte';
	import { api } from '$lib/api/client-wrapper';
	import { extractApiError } from '$lib/api/error';
	import type { ItemPublic } from '$lib/api/client';
	import { getAccessToken } from '$lib/auth';
	// Workaround: Using axios for DELETE due to Zodios path interpolation bug
	import axios from 'axios';

	let items = $state<ItemPublic[]>([]);
	let itemError = $state<string | null>(null);
	let loading = $state<boolean>(false);
	let creating = $state<boolean>(false);
	let newTitle = $state<string>('');
	let newDescription = $state<string>('');
	let showModal = $state<boolean>(false);
	let deletingId = $state<string | null>(null);
	let viewingItem = $state<ItemPublic | null>(null);

	/**
	 * Fetch all items from the API and update state.
	 */
	async function fetchItems() {
		loading = true;
		itemError = null;
		try {
			const res = await api['items-read_items']();
			items = res.data;
		} catch (e: unknown) {
			itemError = extractApiError(e, 'Failed to fetch items.');
		} finally {
			loading = false;
		}
	}

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		newTitle = '';
		newDescription = '';
	}

	function handleView(item: ItemPublic) {
		viewingItem = item;
	}

	function closeView() {
		viewingItem = null;
	}

	/**
	 * Delete an item by ID using axios (Zodios path interpolation workaround)
	 * @param id Item UUID
	 * TODO: Remove this workaround when Zodios path interpolation is fixed
	 */
	async function deleteItemById(id: string) {
		const token = getAccessToken();
		if (!token) return;
		await axios.delete(`http://localhost:8000/api/v1/items/${id}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
	}

	/**
	 * Delete handler for UI (calls axios-based workaround)
	 */
	async function handleDelete(id: string) {
		deletingId = id;
		itemError = null;
		try {
			await deleteItemById(id);
			items = items.filter((i) => i.id !== id);
		} catch (e: unknown) {
			itemError = extractApiError(e, 'Failed to delete item.');
		} finally {
			deletingId = null;
		}
	}

	async function createItem() {
		if (!newTitle.trim()) return;
		creating = true;
		itemError = null;
		try {
			const created = await api['items-create_item']({
				title: newTitle,
				description: newDescription || undefined
			});
			items = [created, ...items];
			newTitle = '';
			newDescription = '';
		} catch (e: unknown) {
			itemError = extractApiError(e, 'Failed to create item.');
		} finally {
			creating = false;
		}
	}

	onMount(fetchItems);
</script>

<div class="flex flex-col items-center gap-8 py-8">
	<h2 class="text-2xl font-bold">Manage Items</h2>

	<!-- Add Item Button -->
	<button class="btn btn-primary w-full max-w-md" onclick={openModal}>
		<span class="material-symbols-outlined mr-2 align-middle">add</span>
		Add Item
	</button>

	<!-- Modal for Adding Item -->
	{#if showModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div
				class="bg-base-100 relative flex w-full max-w-sm flex-col gap-6 rounded-lg p-8 shadow-lg"
			>
				<button
					class="btn btn-sm btn-circle absolute top-3 right-3"
					aria-label="Close"
					onclick={closeModal}
					type="button"
				>
					<span class="material-symbols-outlined text-2xl leading-none">close</span>
				</button>
				<h3 class="text-center text-xl font-bold">Add New Item</h3>
				<form
					class="flex flex-col gap-4"
					onsubmit={(e) => {
						e.preventDefault();
						createItem();
						closeModal();
					}}
					aria-label="Add new item"
				>
					<div class="form-control">
						<label class="label" for="item-title">
							<span class="label-text">Title</span>
						</label>
						<input
							id="item-title"
							type="text"
							class="input input-bordered focus:ring-primary focus:border-primary focus:ring-2 focus:outline-none"
							bind:value={newTitle}
							required
							autocomplete="off"
							placeholder="Enter item title"
						/>
					</div>
					<div class="form-control">
						<label class="label" for="item-description">
							<span class="label-text">Description (optional)</span>
						</label>
						<textarea
							id="item-description"
							class="textarea textarea-bordered focus:ring-primary focus:border-primary focus:ring-2 focus:outline-none"
							placeholder="Enter item description (optional)"
							bind:value={newDescription}
							autocomplete="off"
						></textarea>
					</div>
					<button class="btn btn-primary w-full" type="submit" disabled={creating}>
						{creating ? 'Creating...' : 'Add Item'}
					</button>
				</form>
			</div>
		</div>
	{/if}

	{#if loading}
		<p>Loading items...</p>
	{:else if itemError}
		<p class="text-error">{itemError}</p>
	{:else if items.length === 0}
		<p>No items found.</p>
	{:else}
		<ul class="flex w-full max-w-2xl flex-col gap-4">
			{#each items as item (item.id)}
				<li class="card bg-base-100 flex flex-col gap-2 p-4 shadow">
					<div class="flex items-center justify-between">
						<span class="font-semibold">{item.title}</span>
						<span class="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</span>
					</div>
					{#if item.description}
						<p class="text-gray-700">{item.description}</p>
					{/if}
					<div class="mt-2 flex justify-end gap-2">
						<button
							class="btn btn-sm btn-outline btn-error"
							title="Delete"
							onclick={() => handleDelete(item.id)}
							disabled={deletingId === item.id}
						>
							<span class="material-symbols-outlined">delete</span>
						</button>
						<button class="btn btn-sm btn-outline" title="View" onclick={() => handleView(item)}>
							<span class="material-symbols-outlined">visibility</span>
						</button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}

	<!-- Modal for Viewing Item -->
	{#if viewingItem}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div
				class="bg-base-100 relative flex w-full max-w-sm flex-col gap-6 rounded-lg p-8 shadow-lg"
			>
				<button
					class="btn btn-sm btn-circle absolute top-3 right-3"
					aria-label="Close"
					onclick={closeView}
					type="button"
				>
					<span class="material-symbols-outlined text-2xl leading-none">close</span>
				</button>
				<h3 class="text-center text-xl font-bold">Item Details</h3>
				<div class="flex flex-col gap-2">
					<div><span class="font-semibold">Title:</span> {viewingItem.title}</div>
					{#if viewingItem.description}
						<div><span class="font-semibold">Description:</span> {viewingItem.description}</div>
					{/if}
					<div>
						<span class="font-semibold">Created:</span>
						{new Date(viewingItem.created_at).toLocaleString()}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
