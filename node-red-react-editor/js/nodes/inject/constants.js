export const INTERVAL_CHANGED = 'INTERVAL_CHANGED';
export const UNITS_CHANGED = 'UNITS_CHANGED';
export const TIMEINTERVAL_UNITS_CHANGED = 'TIMEINTERVAL_UNITS_CHANGED';
export const TOGGLE_PAYLOAD_MENU = 'TOGGLE_PAYLOAD_MENU';
export const TOGGLE_BOOL_MENU = 'TOGGLE_BOOL_MENU';
export const PAYLOAD_SELECTED = 'PAYLOAD_SELECTED';
export const BOOL_SELECTED = 'BOOL_SELECTED';

export const REPEAT_OPTIONS =  [
									{name:'none', value:'none'},
                			   		{name: 'interval', value:'interval'},
                			   		{name: 'interval between specific times', value:'interval-time'},
                			   		{name: 'at a specific time', value:'time'}
                			   	];

export const INTERVAL_OPTIONS = [
					                {name: 'seconds', value: 's'},
					                {name: 'minutes', value: 'm'},
					                {name: 'hours', value: 'h'},
					            ];

export const TIMEUNIT_OPTIONS = [
					                {name: '1', value: '1'},
					                {name: '2', value: '2'},
					                {name: '3', value: '3'},
					                {name: '4', value: '4'},
					                {name: '5', value: '5'},
					                {name: '6', value: '6'},
					                {name: '10', value: '10'},
					                {name: '12', value: '12'},
					                {name: '15', value: '15'},
					                {name: '20', value: '20'},
					                {name: '30', value: '30'},
					                {name: '60', value: '0'},
					            ];