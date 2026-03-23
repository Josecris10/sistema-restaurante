import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsEither(
  relatedProperty: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEither',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [relatedProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return !!value || !!relatedValue;
        },

        defaultMessage(args: ValidationArguments) {
          return `Debe proporcionar al menos ${args.property} o ${args.constraints[0]}`;
        },
      },
    });
  };
}
