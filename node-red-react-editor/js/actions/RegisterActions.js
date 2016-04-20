import { REGISTER_TYPE } from '../constants/ActionTypes';

export function registerType(name, def, reducer){
    return {
      type: REGISTER_TYPE,
      name,
      def,
      reducer: reducer || null,
    }
}