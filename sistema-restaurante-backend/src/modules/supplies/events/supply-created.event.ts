export class SupplyCreatedEvent {
  constructor(
    public readonly supplyId: number,
    public readonly supplyName: string,
  ) {}
}
