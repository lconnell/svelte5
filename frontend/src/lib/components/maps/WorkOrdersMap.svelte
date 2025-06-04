<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { clientWrapper } from '$lib/api/client-wrapper';
	import { GeocodingService } from '$lib/services/geocoding';
	import { MAP_TILE_URL, MAP_ATTRIBUTION } from '$lib/constants';
	import type { WorkOrder, GeocodedLocation, WorkOrdersResponse } from '$lib/types/work-orders';
	
	let mapContainer = $state<HTMLDivElement | null>(null);
	let leafletMap: any = null;
	let leafletLib: any = null;
	let isMapReady = $state(false);
	
	const geocodingService = GeocodingService.getInstance();
	
	// Fetch work orders (using same key as main page to share cache)
	const workOrdersQuery = createQuery({
		queryKey: ['workOrders'],
		queryFn: async () => {
			const response = await clientWrapper<WorkOrdersResponse>({
				method: 'GET',
				url: '/api/v1/work-orders'
			});
			return response;
		}
	});
	
	// Process work orders for mapping
	const mappableWorkOrders = $derived(
		$workOrdersQuery.data?.data?.filter((wo: WorkOrder) => 
			(wo.status === 'Open' || wo.status === 'In Progress') && 
			wo.location?.address
		) || []
	);
	
	// Load Leaflet library
	async function loadLeaflet() {
		if (leafletLib) return leafletLib;
		
		// Check if already loaded
		if ((window as any).L) {
			leafletLib = (window as any).L;
			return leafletLib;
		}
		
		// Load CSS if not already loaded
		if (!document.querySelector('link[href*="leaflet"]')) {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			document.head.appendChild(link);
		}
		
		// Load JS
		await new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
		
		leafletLib = (window as any).L;
		return leafletLib;
	}
	
	// Geocode and display work orders
	async function displayWorkOrders() {
		if (!mappableWorkOrders.length || !mapContainer) return;
		
		try {
			// Load Leaflet if needed
			const L = await loadLeaflet();
			
			// Geocode unique addresses
			const uniqueAddresses = new Map<string, WorkOrder[]>();
			for (const wo of mappableWorkOrders) {
				const address = `${wo.location!.address}, ${wo.location!.city}, ${wo.location!.state_province} ${wo.location!.postal_code}`;
				if (!uniqueAddresses.has(address)) {
					uniqueAddresses.set(address, []);
				}
				uniqueAddresses.get(address)!.push(wo);
			}
			
			// Geocode all addresses
			const geocodedResults = await geocodingService.geocodeMultiple([...uniqueAddresses.keys()]);
			
			// Build geocoded locations array
			const geocodedLocations: GeocodedLocation[] = [];
			for (const [address, workOrders] of uniqueAddresses) {
				const result = geocodedResults.get(address);
				if (result) {
					geocodedLocations.push({
						...result,
						address,
						workOrderCount: workOrders.length,
						workOrders
					});
				}
			}
			
			if (geocodedLocations.length === 0) {
				console.warn('No locations could be geocoded');
				return;
			}
			
			// Clean up existing map
			if (leafletMap) {
				leafletMap.remove();
				leafletMap = null;
			}
			
			// Initialize new map
			const bounds = L.latLngBounds(
				geocodedLocations.map((loc: GeocodedLocation) => [loc.lat, loc.lon])
			);
			
			leafletMap = L.map(mapContainer).fitBounds(bounds, { padding: [50, 50] });
			
			// Add tile layer
			L.tileLayer(MAP_TILE_URL, {
				attribution: MAP_ATTRIBUTION
			}).addTo(leafletMap);
			
			// Add markers
			geocodedLocations.forEach((loc: GeocodedLocation) => {
				const popupContent = `
					<div class="p-2">
						<strong>${loc.workOrderCount} work order${loc.workOrderCount > 1 ? 's' : ''}</strong><br>
						<small>${loc.address}</small>
						<ul class="mt-2 text-xs">
							${loc.workOrders.slice(0, 3).map(wo => 
								`<li>• ${wo.title}</li>`
							).join('')}
							${loc.workOrders.length > 3 ? `<li class="opacity-60">+${loc.workOrders.length - 3} more</li>` : ''}
						</ul>
					</div>
				`;
				
				L.marker([loc.lat, loc.lon])
					.addTo(leafletMap)
					.bindPopup(popupContent);
			});
			
			isMapReady = true;
		} catch (error) {
			console.error('Failed to display work orders on map:', error);
		}
	}
	
	// Initialize map when container and data are both ready
	$effect(() => {
		if (mappableWorkOrders.length > 0 && mapContainer) {
			displayWorkOrders();
		}
	});
	
	onDestroy(() => {
		if (leafletMap) {
			leafletMap.remove();
			leafletMap = null;
		}
	});
</script>

<div class="space-y-4">
	{#if $workOrdersQuery.isLoading}
		<div class="text-center">
			<span class="loading loading-spinner loading-md"></span>
			<p class="text-sm opacity-70 mt-2">Loading work orders...</p>
		</div>
	{:else if $workOrdersQuery.error}
		<div class="alert alert-error">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span class="text-sm">Failed to load work orders</span>
		</div>
	{:else if mappableWorkOrders.length === 0}
		<div class="text-center text-base-content/60">
			<p>No active work orders with locations to display</p>
		</div>
	{:else}
		<div class="text-center">
			<p class="text-sm opacity-70">
				{mappableWorkOrders.length} active work order{mappableWorkOrders.length !== 1 ? 's' : ''} 
				{#if isMapReady}
					at {new Set(mappableWorkOrders.map(wo => wo.location?.address)).size} location{new Set(mappableWorkOrders.map(wo => wo.location?.address)).size !== 1 ? 's' : ''}
				{/if}
			</p>
		</div>
	{/if}
	
	<div class="h-72 w-full overflow-hidden rounded-xl bg-base-200 flex items-center justify-center">
		{#if mappableWorkOrders.length > 0}
			<div bind:this={mapContainer} class="h-full w-full" id="work-orders-map"></div>
		{:else if !$workOrdersQuery.isLoading}
			<span class="text-base-content/40">
				No active work orders with locations to display
			</span>
		{/if}
	</div>
</div>