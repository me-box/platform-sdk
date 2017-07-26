import { createStructuredSelector } from 'reselect';

export const NAME = 'driver';

const ADD_SCHEMA = 'iot.red/driver/ADD_SCHEMA';
const EDIT_SCHEMA = 'iot.red/driver/EDIT_SCHEMA';
const SET_OVERVIEW = 'iot.red/driver/SET_OVERVIEW';
const SET_AUTHOR = 'iot.red/driver/SET_AUTHOR';


const _uniqueid = (schema)=>{
	if (schema.length <= 0){
		return 0;
	}
	return schema.reduce((acc, item)=>{
		return Math.max(item.id+1, acc)
	},0);
}

const initialState = {

	dataTypes : ["boolean","number","string","custom list","date","binomial distribution","blank","hex colour"],
	
	dataTypesById: {
		
		boolean:{
			name: "boolean",
			description: "a true or false value",
			example:["true","false"],
			options:[],
		},
		
		number:{
			name: "number",
			description: "a number",
			example:["1.2","3.5","7.8"],
			options:[
				{
					name: "type",
					description: "number type",
					type: "set",
					values: ["float", "integer"],	
				},
				{
					name: "range", 
					description: "min max range of number",
					type: "range",
					from: 0,
					to: 100000,
				}
			],
		},

		string:{
			name: "string",
			description: "a random phrase",
			example:["maecenas tristique","est et tempus","semper est"],
			options:[
				{
					name: "words",
					description: "number of words",
					type: "range",
					from: 0,
					to: 5,
				}
			],
		},

		"custom list":{
			name:"custom list",
			description: "a custom set of values",
			example:["one","two","three"],
			options:[],
		},

		date:{
			name: "date",
			description: "a date",
			example:["5th March 1987", "22-02-17", "09 Mar 1987 12:34"],
			options:[
				{
					name:"format",
					description: "format of date, e.g. dd:mm:yy hh:mm",
					type: "string",
					default: "dd:mm:yy hh:mm:ss"
				},
				{
					name: "from",
					description: "earliest date (use now for anytime after now)",
					type: "string",
					default: "now"
				},
				{
					name: "to",
					description: "latest date",
					type: "string",
					default: "now"
				}
			],
		},

		"binomial distribution":{
			name: "binomial distribution",
			description: "0 or 1 based on a success probability",
			example:["0","1","1","0"],
			options:[
				{
					name : "probability",
					description: "probability of success (between 0 and 1)",
					type: "number",
				}
			],
		},
		
		"hex colour":{
			name: "hex colour",
			description: "a hex value",
			example:["#333", "#ffcc00", "#eeffdd"],
			options:[],
		}
	},

	overview: "",
	author : {},
	hardware: {},
	resources: [],
	schema: [],
}
 
export default function reducer(state = initialState, action) {
  	
  	switch (action.type) {

	  case  ADD_SCHEMA:
	  	const id 	= _uniqueid(state.schema);
	  	const schema 	= {
	  							id, 
	  							schema: {...state.dataTypesById[action.id]}
	  					  };

	    return {
	    	...state, 
	    	schema: [...state.schema, schema]
	   	}

	  case  EDIT_SCHEMA:
	    return state;

	  default:
	    return state;
	}
}

function addSchema(id){
	


	return {
		type: ADD_SCHEMA,
		id,
	}
}

function editSchema(schema, options){
	return {
		type: EDIT_SCHEMA,
		schema,
		options,
	}
}

const driver = (state) => state[NAME];

const type = (state, props) => {
	if (props.id){
		return state[NAME].dataTypesById[props.id];
	}
	return null;
}

export const selector = createStructuredSelector({
	driver,
	type,
});

export const actionCreators = {
	addSchema,
	editSchema
}