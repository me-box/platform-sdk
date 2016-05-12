export const INTERVAL_CHANGED = 'INTERVAL_CHANGED';
export const TOGGLE_PAYLOAD_MENU = 'TOGGLE_PAYLOAD_MENU';
export const TOGGLE_BOOL_MENU = 'TOGGLE_BOOL_MENU';
export const PAYLOAD_SELECTED = 'PAYLOAD_SELECTED';
export const BOOL_SELECTED = 'BOOL_SELECTED';
export const INCREMENT_INTERVAL = 'INCREMENT_INTERVAL';

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

export const TIMEINTERVAL_OPTIONS = [
					                {name: '00:00', value: '0'},
					                {name: '01:00', value: '1'},
					                {name: '02.00', value: '2'},
					                {name: '03.00', value: '3'},
					                {name: '04.00', value: '4'},
					                {name: '05.00', value: '5'},
					                {name: '06.00', value: '6'},
					                {name: '07.00', value: '7'},
					                {name: '08.00', value: '8'},
					                {name: '09.00', value: '9'},
					                {name: '10.00', value: '10'},
					                {name: '11.00', value: '11'},
					                {name: '12.00', value: '12'},
					                {name: '13.00', value: '13'},
					                {name: '14.00', value: '14'},
					                {name: '15.00', value: '15'},
					                {name: '16.00', value: '16'},
					                {name: '17.00', value: '17'},
					                {name: '18.00', value: '18'},
					                {name: '19.00', value: '19'},
					                {name: '20.00', value: '20'},
					                {name: '21.00', value: '21'},
					                {name: '22.00', value: '22'},
					                {name: '23.00', value: '23'}
					            ];

export const REPEAT_DEFAULT_OBJECTS = {
		'none':				{type:'none', atstart:false},
		'interval':			{type: 'interval', frequency:1, units: 's', atstart:false},
		'interval-time':	{type: 'interval-time', frequency:1, start: 0, end: 0, on:[]},
		'time':				{type:'time', at:'12:00', on:[1,2,4], timeInterval: 0},
};