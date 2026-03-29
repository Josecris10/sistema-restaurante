export enum OrderState {
  RECEIVED = 'RECEIVED',
  COOKING = 'COOKING',
  CANCELLED = 'CANCELLED',
  READY = 'READY',
  PAID = 'PAID',
  CLOSED = 'CLOSED',
}

export const ORDER_WORKFLOW: Record<OrderState, OrderState[]> = {
  [OrderState.RECEIVED]: [OrderState.COOKING, OrderState.CANCELLED],
  [OrderState.COOKING]: [OrderState.READY, OrderState.CANCELLED],
  [OrderState.READY]: [OrderState.PAID, OrderState.CANCELLED],
  [OrderState.PAID]: [OrderState.CLOSED],
  [OrderState.CANCELLED]: [],
  [OrderState.CLOSED]: [],
};
