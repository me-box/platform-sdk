import { REGISTER_TYPE } from '../constants/ActionTypes';

export function registerType(name, def){
    return {
      type: REGISTER_TYPE,
      name,
      def,
    }
}