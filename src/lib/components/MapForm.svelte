<script lang="ts">
	let address = '';
	let mapSrc = '';

	async function updateMap() {
		if (!address) return;

		const res = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
		);
		const results = await res.json();

		if (results.length) {
			// Parse lat/lon as floats to ensure valid arithmetic for map bounds
			const lat = parseFloat(results[0].lat);
			const lon = parseFloat(results[0].lon);
			const delta = 0.005;
			mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - delta}%2C${lat - delta}%2C${lon + delta}%2C${lat + delta}&layer=mapnik&marker=${lat},${lon}`;
		} else {
			mapSrc = '';
			alert('Location not found');
		}
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body space-y-4">
		<h2 class="card-title">Find a Location</h2>

		<div class="form-control mx-auto w-full max-w-md">
			<label class="label" for="map-address">
				<span class="label-text">Address</span>
			</label>
			<input
				id="map-address"
				name="address"
				bind:value={address}
				type="text"
				autocomplete="street-address"
				placeholder="Enter an address"
				class="input input-bordered focus:ring-primary focus:border-primary w-full focus:ring-2 focus:outline-none"
			/>
		</div>

		<button onclick={updateMap} class="btn btn-primary mx-auto w-full max-w-md">Show on Map</button>

		<div class="h-72 w-full overflow-hidden rounded-xl bg-base-200 flex items-center justify-center aspect-[4/3]">
			{#if mapSrc}
				<iframe title="Location" class="h-full w-full border-0" src={mapSrc}></iframe>
			{:else}
				<span class="text-base-content/40">Map preview</span>
			{/if}
		</div>
	</div>
</div>
