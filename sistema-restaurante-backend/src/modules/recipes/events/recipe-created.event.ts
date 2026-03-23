export class RecipeCreatedEvent {
  constructor(
    public readonly recipeId: number,
    public readonly recipeName: string,
  ) {}
}
