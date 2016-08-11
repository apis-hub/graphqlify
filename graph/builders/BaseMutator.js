import buildRelationshipsField from './concerns/buildRelationshipsField';
import buildAttributesField from './concerns/buildAttributesField';
import buildIdInputField from './concerns/buildIdInputField';
import buildResourceOutputField from './concerns/buildResourceOutputField';
import resolveMaybeThunk from '../helpers/resolveMaybeThunk';
import types from '../types/standard';

function buildDeletedIdField({ type }) {
  let outputFields = {};
  outputFields[`deleted${type.name}Id`] = {
    type: new types.GraphQLNonNull(types.GraphQLID),
    resolve: ({ deletedId }) => deletedId
  };
  return outputFields;
}

class BaseMutator {
  constructor(options) {
    this.config = Object.freeze({ options });
  }

  defGetter(name, fn) {
    Object.defineProperty(this, name, { get: fn, enumerable: true });
  }

  get options() {
    return {
      attributes: {},
      createAttributes: {},
      updateAttributes: {},
      relatesToOne: [],
      createRelatesToOne: [],
      updateRelatesToOne: [],
      relatesToMany: [],
      createRelatesToMany: [],
      updateRelatesToMany: [],
      inputFields: {},
      outputFields: {},
      createInputFields: {},
      createOutputFields: {},
      deleteInputFields: {},
      deleteOutputFields: {},
      updateInputFields: {},
      updateOutputFields: {},
      ...resolveMaybeThunk(this.config.options)
    };
  }

  get attributes() {
    return resolveMaybeThunk(this.options.attributes);
  }

  get createAttributes() {
    return {
      ...this.attributes,
      ...resolveMaybeThunk(this.options.createAttributes)
    };
  }

  get name() {
    return this.type.name;
  }

  get relatesToOne() {
    return resolveMaybeThunk(this.options.relatesToOne);
  }

  get createRelatesToOne() {
    return [
      ...this.relatesToOne,
      ...resolveMaybeThunk(this.options.createRelatesToOne)
    ];
  }

  get updateRelatesToOne() {
    return [
      ...this.relatesToOne,
      ...resolveMaybeThunk(this.options.updateRelatesToOne)
    ];
  }

  get relatesToMany() {
    return resolveMaybeThunk(this.options.relatesToMany);
  }

  get createRelatesToMany() {
    return [
      ...this.relatesToMany,
      ...resolveMaybeThunk(this.options.createRelatesToMany)
    ];
  }

  get updateRelatesToMany() {
    return [
      ...this.relatesToMany,
      ...resolveMaybeThunk(this.options.updateRelatesToMany)
    ];
  }

  get inputFields() {
    return resolveMaybeThunk(this.options.inputFields);
  }

  get outputFields() {
    return resolveMaybeThunk(this.options.outputFields);
  }

  get createInputFields() {
    return {
      ...this.inputFields,
      ...resolveMaybeThunk(this.options.createInputFields),
      ...buildAttributesField(this.name, 'create', this.createAttributes),
      ...buildRelationshipsField(this.name, 'create', this.createRelatesToOne, this.createRelatesToMany)
    };
  }

  get createOutputFields() {
    return {
      ...this.outputFields,
      ...resolveMaybeThunk(this.options.createOutputFields),
      ...buildResourceOutputField(this, 'created')
    };
  }

  get updateAttributes() {
    return {
      ...this.attributes,
      ...resolveMaybeThunk(this.options.updateAttributes)
    };
  }

  get updateInputFields() {
    return {
      ...this.inputFields,
      ...resolveMaybeThunk(this.options.updateInputFields),
      ...buildIdInputField(),
      ...buildAttributesField(this.name, 'update', this.updateAttributes),
      ...buildRelationshipsField(this.name, 'update', this.createRelatesToOne, this.createRelatesToMany)
    };
  }

  get updateOutputFields() {
    return {
      ...this.outputFields,
      ...resolveMaybeThunk(this.options.updateOutputFields),
      ...buildResourceOutputField(this, 'updated')
    };
  }

  get deleteInputFields() {
    return {
      ...this.inputFields,
      ...resolveMaybeThunk(this.options.deleteInputFields),
      ...buildIdInputField(),
    };
  }

  get deleteOutputFields() {
    return {
      ...this.outputFields,
      ...resolveMaybeThunk(this.options.deleteOutputFields),
      ...buildDeletedIdField(this),
      ...buildResourceOutputField(this, 'deleted'),
    };
  }

  get resource() {
    return resolveMaybeThunk(this.options.type).resource;
  }

  get type() {
    return resolveMaybeThunk(this.options.type).type;
  }

}

export default BaseMutator;
