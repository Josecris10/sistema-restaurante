export enum KitchenState {
  RECEIVED = 'RECEIVED',
  COOKING = 'COOKING',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED',
}

export const KITCHEN_WORKFLOW: Record<KitchenState, KitchenState[]> = {
  [KitchenState.RECEIVED]: [KitchenState.COOKING, KitchenState.CANCELLED],
  [KitchenState.COOKING]: [KitchenState.READY, KitchenState.CANCELLED],
  [KitchenState.READY]: [KitchenState.SERVED, KitchenState.CANCELLED],
  [KitchenState.SERVED]: [],
  [KitchenState.CANCELLED]: [],
};
