import { PUBLISHER_PACKAGE_SELECTED,PUBLISHER_APP_NAME_CHANGED,PUBLISHER_APP_DESCRIPTION_CHANGED,PUBLISHER_APP_TAGS_CHANGED,PUBLISHER_PACKAGE_DESCRIPTION_CHANGED,PUBLISHER_PACKAGE_INSTALL_CHANGED,PUBLISHER_PACKAGE_BENEFITS_CHANGED,PUBLISHER_TOGGLE_GRID } from '../constants/ActionTypes';

export function packageSelected(id){
	return {
		type: PUBLISHER_PACKAGE_SELECTED,
		id
	}
}

export function updateAppName(name){
	return {
		type: PUBLISHER_APP_NAME_CHANGED,
		name
	}
} 

export function updateAppDescription(description){
	return {
		type: PUBLISHER_APP_DESCRIPTION_CHANGED,
		description
	}
}

export function updateAppTags(tags){
	return {
		type: PUBLISHER_APP_TAGS_CHANGED,
		tags
	}
}

export function updatePackageDescription(description){
	return {
		type: PUBLISHER_PACKAGE_DESCRIPTION_CHANGED,
		description,
	}
}
export function installSelected(install){
	return {
		type: PUBLISHER_PACKAGE_INSTALL_CHANGED,
		install
	}
}

export function updatePackageBenefits(benefits){
	return {
		type: PUBLISHER_PACKAGE_BENEFITS_CHANGED,
		benefits
	}
}

export function toggleGrid(pkga, pkgb){
	
	return {
		type: PUBLISHER_TOGGLE_GRID,
		pkga,
		pkgb,
	}
}