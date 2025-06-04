<script lang="ts">
	import { GeocodingService } from '$lib/services/geocoding';
	
	let address = $state('');
	let mapSrc = $state('');
	let isSearching = $state(false);
	let error = $state<string | null>(null);
	
	const geocodingService = GeocodingService.getInstance();
	
	async function searchAddress() {
		if (!address.trim()) {
			error = 'Please enter an address';
			return;
		}
		
		isSearching = true;
		error = null;
		
		try {
			const result = await geocodingService.geocodeAddress(address);
			
			if (result) {
				const delta = 0.005;
				mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${result.lon - delta}%2C${result.lat - delta}%2C${result.lon + delta}%2C${result.lat + delta}&layer=mapnik&marker=${result.lat},${result.lon}`;
			} else {
				error = 'Location not found. Please try a different address.';
				mapSrc = '';
			}
		} catch (err) {
			error = 'Failed to search address. Please try again.';
			mapSrc = '';
		} finally {
			isSearching = false;
		}
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !isSearching) {
			searchAddress();
		}
	}
</script>

<div class="space-y-4">
	<div class="form-control mx-auto w-full max-w-md">
		<label class="label" for="map-address">
			<span class="label-text">Address</span>
		</label>
		<input
			id="map-address"
			name="address"
			bind:value={address}
			onkeydown={handleKeydown}
			type="text"
			autocomplete="street-address"
			placeholder="Enter an address"
			class="input input-bordered focus:ring-primary focus:border-primary w-full focus:ring-2 focus:outline-none"
			disabled={isSearching}
		/>
		{#if error}
			<label class="label">
				<span class="label-text-alt text-error">{error}</span>
			</label>
		{/if}
	</div>

	<button 
		onclick={searchAddress} 
		class="btn btn-primary mx-auto w-full max-w-md"
		disabled={isSearching || !address.trim()}
	>
		{#if isSearching}
			<span class="loading loading-spinner"></span>
			Searching...
		{:else}
			Show on Map
		{/if}
	</button>
	
	<div class="h-72 w-full overflow-hidden rounded-xl bg-base-200 flex items-center justify-center">
		{#if mapSrc}
			<iframe 
				title="Location map for {address}" 
				class="h-full w-full border-0" 
				src={mapSrc}
			/>
		{:else}
			<span class="text-base-content/40">
				Enter an address and click "Show on Map"
			</span>
		{/if}
	</div>
</div>