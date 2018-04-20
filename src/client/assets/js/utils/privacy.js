const {resolveConditions} = ConfigNode;  //retrieved from node lib - ser server/lib/node

export const privacy_template =  {
    identifiers: { 
        primary: [],
        secondary: [],
    },
    
    personal: {
        primary: [],
        secondary: [],
    },
    
    sensitive: {
        primary: [],
        secondary:[],
    }
};

export const resolveconditions = resolveConditions;