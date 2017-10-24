export const REPEAT_UNITS_CHANGED = 'UNITS_CHANGED';
//export const REPEAT_INCREMENT = 'REPEAT_INCREMENT';
export const SET_REPEAT = 'SET_REPEAT';
export const REPEAT_OPTION_CHANGED = 'REPEAT_OPTION_CHANGED';

export const INTERVAL_FREQUENCY = 'INTERVAL_FREQUENCY'
export const INTERVAL_START = 'INTERVAL_START';
export const INTERVAL_END = 'INTERVAL_END';
export const INTERVAL_ON = 'INTERVAL_ON';

export const ONCE='ONCE';

export const SPECIFIC_TIME = 'SPECIFIC_TIME';
export const SPECIFIC_TIME_ON = 'SPECIFIC_TIME_ON';

export const TOGGLE_PAYLOAD_MENU = 'TOGGLE_PAYLOAD_MENU';
export const TOGGLE_BOOL_MENU = 'TOGGLE_BOOL_MENU';
export const PAYLOAD_TYPE_SELECTED = 'PAYLOAD_TYPE_SELECTED';
export const PAYLOAD = 'PAYLOAD';
export const BOOL_SELECTED = 'BOOL_SELECTED';



export const REPEAT_OPTIONS =  [
									{name:'none', value:'none'},
                			   		{name: 'interval', value:'interval'},
                			   		{name: 'interval between specific times', value:'interval-time'},
                			   		//{name: 'at a specific time', value:'time'}
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
		'none':				{once: false, repeat:"", crontab:""},
		'interval':			{once: false, repeat:1,  crontab:""},
		'interval-time':	{once: false, repeat:"", crontab: "0 0 0 0 1"},
		'time':				{once: false, repeat:"", crontab: "1 0 0 0 1"},
};