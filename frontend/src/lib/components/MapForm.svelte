<script lang="ts">
	import AddressSearch from './maps/AddressSearch.svelte';
	import WorkOrdersMap from './maps/WorkOrdersMap.svelte';
	
	type MapMode = 'search' | 'workOrders';
	
	let mode = $state<MapMode>('search');
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body space-y-4">
		<div class="flex justify-between items-center">
			<h2 class="card-title">Location Map</h2>
			<div class="flex gap-2" role="tablist">
				<button 
					role="tab"
					aria-selected={mode === 'search'}
					class="btn btn-sm {mode === 'search' ? 'btn-primary' : 'btn-outline'}" 
					onclick={() => mode = 'search'}
				>
					Search
				</button>
				<button 
					role="tab"
					aria-selected={mode === 'workOrders'}
					class="btn btn-sm {mode === 'workOrders' ? 'btn-primary' : 'btn-outline'}" 
					onclick={() => mode = 'workOrders'}
				>
					Work Orders
				</button>
			</div>
		</div>
		
		<div role="tabpanel">
			{#if mode === 'search'}
				<AddressSearch />
			{:else}
				<WorkOrdersMap />
			{/if}
		</div>
	</div>
</div>