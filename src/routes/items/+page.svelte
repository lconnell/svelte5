<script lang="ts">
	// For icons
	// DaisyUI 5 supports Material Symbols Outlined with the right font loaded.
	// If not present, add this to your app.html: <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

	import {
		createItemsReadItems,
		createItemsCreateItem,
		createItemsDeleteItem
	} from '$lib/api/client';
	import { queryClient } from '$lib/queryClient'; // Use the shared QueryClient instance
	import { getItemsReadItemsQueryKey } from '$lib/api/client';
	import type { ItemPublic } from '$lib/api/schemas';
	import { extractApiError } from '$lib/api/error';

	// Modal/input/view state
	let newTitle: string = '';
	let newDescription: string = '';
	let showModal: boolean = false;
	let viewingItem: ItemPublic | null = null;

	// Modal handlers
	/**
	 * Opens the modal for adding a new item.
	 */
	function openModal() {
		showModal = true;
	}

	/**
	 * Closes the modal for adding a new item and resets the input fields.
	 */
	function closeModal() {
		showModal = false;
		newTitle = '';
		newDescription = '';
	}

	/**
	 * Sets the viewing item to the provided item.
	 * @param item The item to view.
	 */
	function handleView(item: ItemPublic) {
		viewingItem = item;
	}

	/**
	 * Closes the viewing item modal.
	 */
	function closeView() {
		viewingItem = null;
	}

	// Query: fetch all items
	const itemsQuery = createItemsReadItems();

	// Use the Orval-generated query key for best practice
	// Use the global queryClient for invalidation

	// Mutation: create item
	const createItemMutation = createItemsCreateItem({
		mutation: {
			onSuccess: () => {
				// Invalidate the items list using the Orval-generated query key
				queryClient.invalidateQueries({ queryKey: getItemsReadItemsQueryKey() });
			}
		}
	});

	// Mutation: delete item
	const deleteItemMutation = createItemsDeleteItem({
		mutation: {
			onSuccess: () => {
				// Invalidate the items list using the Orval-generated query key after deletion
				queryClient.invalidateQueries({ queryKey: getItemsReadItemsQueryKey() });
			}
		}
	});

	// Handler for deleting an item by ID using tanstack-query mutation
	async function handleDelete(id: string) {
		await $deleteItemMutation.mutateAsync({ id });
	}

	// Handler for creating a new item using tanstack-query mutation
	/**
	 * Handles form submission for creating a new item.
	 * Sends the correct payload shape required by the Orval tanstack-query mutation ({ data: ItemCreate }).
	 * Adds error handling and prevents default form submission behavior.
	 */
	// Store the last API error for display (type-safe, fixes lint error)
	let lastApiError: unknown = null;

	async function handleCreateItem(event: Event) {
		event.preventDefault(); // Prevent native form submission
		if (!newTitle.trim()) return;
		const payload = { title: newTitle, description: newDescription || undefined };
		try {
			await $createItemMutation.mutateAsync({ data: payload });
			newTitle = '';
			newDescription = '';
			showModal = false;
			lastApiError = null;
		} catch (error) {
			lastApiError = error;
		}
	}

	// No need for onMount; tanstack-query auto-fetches.
</script>

<div class="flex flex-col items-center gap-8 py-8">
	<h2 class="text-2xl font-bold">Manage Items</h2>

	<!-- Add Item Button -->
	<!-- Button to open the Add Item modal -->
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
				<form class="flex flex-col gap-4" onsubmit={handleCreateItem} aria-label="Add new item">
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
					<button
						class="btn btn-primary w-full"
						type="submit"
						disabled={$createItemMutation.isPending}
					>
						{$createItemMutation.isPending ? 'Creating...' : 'Add Item'}
					</button>
					{#if $createItemMutation.error}
						<p class="text-error">
							{extractApiError($createItemMutation.error, 'Failed to create item.')}
						</p>
					{/if}
					{#if lastApiError}
						<p class="text-error">
							API Error: {typeof lastApiError === 'object'
								? JSON.stringify(lastApiError)
								: String(lastApiError)}
						</p>
					{/if}
				</form>
			</div>
		</div>
	{/if}

	{#if $itemsQuery.isPending}
		<p>Loading items...</p>
	{:else if $itemsQuery.error}
		<p class="text-error">{extractApiError($itemsQuery.error, 'Failed to fetch items.')}</p>
	{:else if !$itemsQuery.data || $itemsQuery.data.data.length === 0}
		<p>No items found.</p>
	{:else}
		<ul class="flex w-full max-w-2xl flex-col gap-4">
			{#each $itemsQuery.data.data as item (item.id)}
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
							disabled={$deleteItemMutation.isPending}
						>
							<span class="material-symbols-outlined">delete</span>
						</button>
						{#if $deleteItemMutation.error}
							<p class="text-error">
								{extractApiError($deleteItemMutation.error, 'Failed to delete item.')}
							</p>
						{/if}
						<button class="btn btn-sm btn-outline" title="View" onclick={() => handleView(item)}>
							<span class="material-symbols-outlined">view</span>
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
					<div><span class="font-semibold">Title:</span> {viewingItem?.title ?? ''}</div>
					{#if viewingItem?.description}
						<div><span class="font-semibold">Description:</span> {viewingItem.description}</div>
					{/if}
					<div>
						<span class="font-semibold">Created:</span>
						{viewingItem?.created_at ? new Date(viewingItem.created_at).toLocaleString() : ''}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
