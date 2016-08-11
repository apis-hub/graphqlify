import { GraphQLID, GraphQLList } from '../../types/standard';
import Relationships from '../../types/Relationships';

function buildRelationshipsField(name, type, relatesToOne = [], relatesToMany = []) {
  if (relatesToOne.length === 0 && relatesToMany.length === 0) {
    return {};
  }

  const relatesToOneFields = relatesToOne.reduce((obj, relName) => {
    obj[relName] = {
      type: GraphQLID
    };
    return obj;
  }, {});

  const relatesToManyFields = relatesToMany.reduce((obj, relName) => {
    obj[relName] = {
      type: new GraphQLList(GraphQLID)
    };
    return obj;
  }, {});

  return {
    relationships: {
      type: new Relationships(name, type, { ...relatesToOneFields, ...relatesToManyFields })
    }
  };
}

export default buildRelationshipsField;
