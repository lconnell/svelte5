<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import { clientWrapper } from '$lib/api/client-wrapper';
  import { STATUS_COLORS, PRIORITY_COLORS, API_ENDPOINTS } from '$lib/constants';
  import type { WorkOrdersResponse } from '$lib/types/work-orders';
  
  const workOrdersQuery = createQuery({
    queryKey: ['workOrders'],
    queryFn: async () => {
      const response = await clientWrapper<WorkOrdersResponse>({
        method: 'GET',
        url: API_ENDPOINTS.WORK_ORDERS
      });
      return response;
    }
  });

  function getStatusColor(status: string): string {
    return STATUS_COLORS[status.toLowerCase() as keyof typeof STATUS_COLORS] || 'neutral';
  }
  
  function getPriorityColor(priority: string): string {
    return PRIORITY_COLORS[priority.toLowerCase() as keyof typeof PRIORITY_COLORS] || 'neutral';
  }
</script>

<div class="container mx-auto p-6">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Work Orders</h1>
    <button class="btn btn-primary">
      New Work Order
    </button>
  </div>

  {#if $workOrdersQuery.isLoading}
    <div class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if $workOrdersQuery.error}
    <div class="alert alert-error">
      <span>Error loading work orders: {$workOrdersQuery.error.message}</span>
    </div>
  {:else if $workOrdersQuery.data}
    <div class="mb-4">
      <p class="text-sm opacity-70">Found {$workOrdersQuery.data.count || 0} work orders</p>
    </div>
    
    {#if $workOrdersQuery.data.data && $workOrdersQuery.data.data.length > 0}
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each $workOrdersQuery.data.data as workOrder}
            <tr class="hover">
              <td>
                <div class="font-bold">{workOrder.title}</div>
                {#if workOrder.description}
                  <div class="text-sm opacity-50">{workOrder.description}</div>
                {/if}
              </td>
              <td>
                <div class="badge badge-{getStatusColor(workOrder.status)}">
                  {workOrder.status}
                </div>
              </td>
              <td>
                <div class="badge badge-{getPriorityColor(workOrder.priority)}">
                  {workOrder.priority}
                </div>
              </td>
              <td>
                {workOrder.assigned_to_user_id || 'Unassigned'}
              </td>
              <td>
                {new Date(workOrder.created_at).toLocaleDateString()}
              </td>
              <td>
                <div class="flex gap-2">
                  <button class="btn btn-sm btn-ghost">View</button>
                  <button class="btn btn-sm btn-ghost">Edit</button>
                </div>
              </td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="alert alert-info">
        <span>No work orders found. Create your first work order to get started!</span>
      </div>
    {/if}
  {/if}
</div>