import { TOGGLE_DEPLOY_MENU, DEPLOY_CLICKED } from '../constants/ActionTypes';

export function toggleDeployMenu(){
    return {
      type: TOGGLE_DEPLOY_MENU,
    }
}

export function deploy(){
    return {
      type: DEPLOY_CLICKED,
    }
}