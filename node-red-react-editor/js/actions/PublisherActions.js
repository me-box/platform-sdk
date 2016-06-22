import { PUBLISHER_PACKAGE_SELECTED,PUBLISHER_APP_NAME_CHANGED,PUBLISHER_APP_DESCRIPTION_CHANGED,PUBLISHER_PACKAGE_DESCRIPTION_CHANGED,PUBLISHER_PACKAGE_INSTALL_CHANGED,PUBLISHER_PACKAGE_BENEFITS_CHANGED,PUBLISHER_TOGGLE_GRID } from '../constants/ActionTypes';

export function packageSelected(pkg){
	return {
		type: PUBLISHER_PACKAGE_SELECTED;
		pkg
	}
}

export function updateAppName(pkg){
	return {
		type: PUBLISHER_APP_NAME_CHANGED,
		pkg
	}
} 

export function updateAppDescription(pkg){
	return {
		type: PUBLISHER_APP_DESCRIPTION_CHANGED,
		pkg
	}
}

export function updatePackageDescription(description){
	return {
		type: PUBLISHER_PACKAGE_DESCRIPTION_CHANGED,
		description,
	}
}
export function updatePackageInstall(install){
	return {
		type: PUBLISHER_PACKAGE_INSTALL_CHANGED,
		install
	}
}

export function updatePackageBenefits(pkg){
	return {
		type: PUBLISHER_PACKAGE_BENEFITS_CHANGED,
		pkg
	}
}

export function toggleGrid(pkga, pkgb){
	
	return {
		type: PUBLISHER_TOGGLE_GRID,
		pkga,
		pkgb,
	}
}