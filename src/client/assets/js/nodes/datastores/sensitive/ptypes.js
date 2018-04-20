export const ptypes = {
	
	"password": [{
		type: "sensitive",
		category: "credentials",
        subtype: "password",
        ordinal: "primary",
        accretion: true,
        description:""
    }],
	"PIN": [{
		type: "sensitive",
		category: "credentials",
        subtype: "PIN",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"card_number": [{
		type: "sensitive",
		category: "credentials",
        subtype: "card_number",
        ordinal: "primary",
        accretion: true,
		description:""
	}],

	"conviction" : [{
		type: "sensitive",
		category: "criminal",
        subtype: "conviction",
        ordinal: "primary",
        accretion: true,
		description:""
	}],
	"charge":[{
		type: "sensitive",
		category: "criminal",
        subtype: "charge",
        ordinal: "primary",
        accretion: true,
		description:""
	}],
	"pardon":[{
		type: "sensitive",
		category: "criminal",
        subtype: "pardon",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"birthplace":[{
		type: "sensitive",
		category: "ethnicity",
        subtype: "birthplace",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"nationality":[{
		type: "sensitive",
		category: "ethnicity",
        subtype: "nationality",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"race":[{
		type: "sensitive",
		category: "ethnicity",
        subtype: "race",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"skin_tone":[{
		type: "sensitive",
		category: "ethnicity",
        subtype: "skin_tone",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"language":[{
		type: "sensitive",
		category: "ethnicity",
        subtype: "languages",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"dialect":[{
		type: "sensitive",
		category: "ethnicity",
        subtype: "dialects",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"ancestral_origin":[{
		type: "sensitive",
		category: "ethnicity",
        subtype: "ancestral_origin",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"religion":[{
		type: "sensitive",
		category: "religion",
        subtype: "religion",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"place_of_worship":[{
		type: "sensitive",
		category: "religion",
        subtype: "place_of_worship",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"devoutness":[{
		type: "sensitive",
		category: "religion",
        subtype: "devoutness",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"belief":[{
		type: "sensitive",
		category: "religion",
        subtype: "belief",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	
	"political_affiliation":[{
		type: "sensitive",
		category: "politics",
        subtype: "political_affiliation",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"voting_history":[{
		type: "sensitive",
		category: "politics",
        subtype: "voting_history",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"union_membership":[{
		type: "sensitive",
		category: "politics",
        subtype: "union_membership",
        ordinal: "primary",
        accretion: true,
        description:""
	}],

	"sexuality":[{
		type: "sensitive",
		category: "sexual",
        subtype: "sexuality",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"gender_identity":[{
		type: "sensitive",
		category: "sexual",
        subtype: "gender_identity",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"sexual_preferences":[{
		type: "sensitive",
		category: "sexual",
        subtype: "sexual_preferences",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"sexual_proclivities":[{
		type: "sensitive",
		category: "sexual",
        subtype: "sexual_proclivities",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"sexual_fetishes":[{
		type: "sensitive",
		category: "sexual",
        subtype: "sexual_fetishes",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"sexual_history":[{
		type: "sensitive",
		category: "sexual",
        subtype: "sexual_history",
        ordinal: "primary",
        accretion: true,
        description:""
	}],

	"chronic_illness":[{
		type: "sensitive",
		category: "health",
        subtype: "chronic_illness",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"pregnant":[{
		type: "sensitive",
		category: "health",
        subtype: "pregnant",
        ordinal: "primary",
        accretion: true,
        description:"whether a user is pregnant"
	}],
	"blood_type":[{
		type: "sensitive",
		category: "health",
        subtype: "blood_type",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"prescriptions":[{
		type: "sensitive",
		category: "health",
        subtype: "prescriptions",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"disability":[{
		type: "sensitive",
		category: "health",
        subtype: "disability",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"allergen":[{
		type: "sensitive",
		category: "health",
        subtype: "allergen",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"intolerance":[{
		type: "sensitive",
		category: "health",
        subtype: "intolerance",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"eyesight":[{
		type: "sensitive",
		category: "health",
        subtype: "vision",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"hearing":[{
		type: "sensitive",
		category: "health",
        subtype: "vision",
        ordinal: "primary",
        accretion: false,
        description:""
	}],
	"family_health":[{
		type: "sensitive",
		category: "health",
        subtype: "family_health",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	"health_history":[{
		type: "sensitive",
		category: "health",
        subtype: "health_history",
        ordinal: "primary",
        accretion: true,
        description:""
	}],
	
	"DNA_code":[
		{
			type: "sensitive",
			category: "biometric",
        	subtype: "DNA_code",
        	ordinal: "primary",
        	accretion: false,
        	description:""
		},
		{
			type: "identifier",
			category: "biometric",
        	subtype: "DNA_code",
        	ordinal: "primary",
        	description:""
		}
	],

	"fingerprint":[
		{
			type: "sensitive",
			category: "biometric",
        	subtype: "fingerprint",
        	ordinal: "primary",
        	accretion: false,
        	description:""
		},
		{
			type: "identifier",
			category: "biometric",
        	subtype: "fingerprint",
        	ordinal: "primary",
        	description:""
		}
	],

	"retinal_scan":[
		{
			type: "sensitive",
			category: "biometric",
        	subtype: "retinal_scan",
        	ordinal: "primary",
        	accretion: false,
        	description:""
		},
		{
			type: "identifier",
			category: "biometric",
        	subtype: "retinal_scan",
        	ordinal: "primary",
        	description:""
		}
	],

	"iris_scan":[
		{
			type: "sensitive",
			category: "biometric",
        	subtype: "iris_scan",
        	ordinal: "primary",
        	accretion: false,
        	description:""
		},
		{
			type: "identifier",
			category: "biometric",
        	subtype: "iris_scan",
        	ordinal: "primary",
        	description:""
		}
	],

	"facial_profile":[
		{
			type: "sensitive",
			category: "biometric",
        	subtype: "facial_profile",
        	ordinal: "primary",
        	accretion: false,
        	description:""
		},
		{
			type: "identifier",
			category: "biometric",
        	subtype: "facial_profile",
        	ordinal: "primary",
        	description:""
		}
	],

	"significant_events":[{
		type: "sensitive",
		category: "personal_history",
        subtype: "personal_history",
        ordinal: "primary",
        accretion: true,
        description:""
	}],


	"childhood":[{
		type: "sensitive",
		category: "personal_history",
        subtype: "childhood",
        ordinal: "primary",
        accretion: true,
        description:""
	}]
};