export const ptypes = {
	
	"age": [{
		type: "personal",
		category: "physical",
        subtype: "age",
        ordinal: "primary",
        accretion: false,
        description:"a user's age"
    }],
    "date_of_birth": [{
		type: "personal",
		category: "physical",
        subtype: "date_of_birth",
        ordinal: "primary",
        accretion: false,
        description:"a user's date of birth"
    }],
    "gender": [{
		type: "personal",
		category: "physical",
        subtype: "gender",
        ordinal: "primary",
        accretion: false,
        description:"a user's gender"
    }],
    "height": [{
		type: "personal",
		category: "physical",
        subtype: "height",
        ordinal: "primary",
        accretion: false,
        description:"a user's height"
    }],
    "weight": [{
		type: "personal",
		category: "physical",
        subtype: "weight",
        ordinal: "primary",
        accretion: false,
        description:"a user's weight"
    }],
    "tatoos": [{
		type: "personal",
		category: "physical",
        subtype: "tatoos",
        ordinal: "primary",
        accretion: false,
        description:"a user's tatoos"
    }],
    "piercings": [{
		type: "personal",
		category: "physical",
        subtype: "piercings",
        ordinal: "primary",
        accretion: false,
        description:"a user's piercings"
    }],
    "hair_colour": [{
		type: "personal",
		category: "physical",
        subtype: "hair_colour",
        ordinal: "primary",
        accretion: false,
        description:"a user's hair colour"
    }],
    "eye_colour": [{
		type: "personal",
		category: "physical",
        subtype: "eye_colour",
        ordinal: "primary",
        accretion: false,
        description:"a user's eye colour"
    }],
    "physical_traits": [{
		type: "personal",
		category: "physical",
        subtype: "physical_traits",
        ordinal: "primary",
        accretion: false,
        description:"a user's physical traits"
    }],
    "picture": [{
		type: "personal",
		category: "physical",
        subtype: "picture",
        ordinal: "primary",
        accretion: false,
        description:"a user's picture"
    }],

    "schools": [{
		type: "personal",
		category: "education",
        subtype: "schools",
        ordinal: "primary",
        accretion: false,
        description:"a history of schools attended"
    }],
    "universities": [{
		type: "personal",
		category: "education",
        subtype: "universities",
        ordinal: "primary",
        accretion: false,
        description:"a history of universities attended"
    }],
    "colleges": [{
		type: "personal",
		category: "education",
        subtype: "colleges",
        ordinal: "primary",
        accretion: false,
        description:"a history of colleges attended"
    }],
    "qualifications": [{
		type: "personal",
		category: "education",
        subtype: "qualifications",
        ordinal: "primary",
        accretion: false,
        description:"user's qualifications"
    }],


    "occupation": [{
		type: "personal",
		category: "professional",
        subtype: "occupation",
        ordinal: "primary",
        accretion: false,
        description:"user's occupation"
    }],
    "workplace": [{
		type: "personal",
		category: "professional",
        subtype: "workplace",
        ordinal: "primary",
        accretion: false,
        description:"user's workplace"
    }],
    "employment_status": [{
		type: "personal",
		category: "professional",
        subtype: "employment_status",
        ordinal: "primary",
        accretion: false,
        description:"user's employment status"
    }],
    "contract": [{
		type: "personal",
		category: "professional",
        subtype: "contract",
        ordinal: "primary",
        accretion: false,
        description:"user's contract"
    }],
    "income": [{
		type: "personal",
		category: "professional",
        subtype: "income",
        ordinal: "primary",
        accretion: false,
        description:"user's income"
    }],
    "references": [{
		type: "personal",
		category: "professional",
        subtype: "references",
        ordinal: "primary",
        accretion: false,
        description:"user's references"
    }],
    "disciplinaries": [{
		type: "personal",
		category: "professional",
        subtype: "disciplinaries",
        ordinal: "primary",
        accretion: false,
        description:"disciplinaries user has been subject to" 
    }],
    "employment_history": [{
		type: "personal",
		category: "professional",
        subtype: "employment_history",
        ordinal: "primary",
        accretion: false,
        description:"user's employment history"
    }],
    "evaluations": [{
		type: "personal",
		category: "professional",
        subtype: "evaluations",
        ordinal: "primary",
        accretion: false,
        description:"user's evaluations"
    }],
    "certifications": [{
		type: "personal",
		category: "professional",
        subtype: "certifications",
        ordinal: "primary",
        accretion: false,
        description:"user's certifications"
    }],
    "absences": [{
		type: "personal",
		category: "professional",
        subtype: "absences",
        ordinal: "primary",
        accretion: false,
        description:"user's absences"
    }],
    "payroll_number": [{
		type: "personal",
		category: "professional",
        subtype: "payroll_number",
        ordinal: "primary",
        accretion: false,
        description:"user's payroll number"
    }],

    "national_insurance": [
     		{
				type: "personal",
				category: "state",
        		subtype: "national_insurance",
        		ordinal: "primary",
        		accretion: false,
        		description:"user's national insurance number"
    		},
    		{
    			type: "identifier",
				ordinal: "primary",
        		accretion: false,
        		description:"user's national insurance number can unambiguously identify them"
        	}
    ],
     "tax_code": [
     		{
				type: "personal",
				category: "state",
        		subtype: "tax_code",
        		ordinal: "primary",
        		accretion: false,
        		description:"user's tax code"
    		},
    		{
    			type: "identifier",
				ordinal: "primary",
        		accretion: false,
        		description:"user's tax code can unambiguously identify them"
        	}
    ],
    "car_registration": [
     		{
				type: "personal",
				category: "state",
        		subtype: "car_registration",
        		ordinal: "primary",
        		accretion: false,
        		description:"user's car registration"
    		},
    		{
    			type: "identifier",
				ordinal: "primary",
        		accretion: false,
        		description:"user's car registration can unambiguously identify them"
        	}
    ],
    "passport_number": [
     		{
				type: "personal",
				category: "state",
        		subtype: "passport_number",
        		ordinal: "primary",
        		accretion: false,
        		description:"user's passport number"
    		},
    		{
    			type: "identifier",
				ordinal: "primary",
        		accretion: false,
        		description:"user's passport number can unambiguously identify them"
        	}
    ],
    "nhs_number": [
     		{
				type: "personal",
				category: "state",
        		subtype: "nhs_number",
        		ordinal: "primary",
        		accretion: false,
        		description:"user's nhs number number"
    		},
    		{
    			type: "identifier",
				ordinal: "primary",
        		accretion: false,
        		description:"user's nhs number can unambiguously identify them"
        	}
    ],

	"address": [{
		type: "personal",
		category: "household",
        subtype: "address",
        ordinal: "primary",
        accretion: false,
        description:"user's home address"
    }],
	"postcode": [{
		type: "personal",
		category: "household",
        subtype: "postcode",
        ordinal: "primary",
        accretion: false,
        description:"user's home postcode"
    }],
    "household_composition": [{
		type: "personal",
		category: "household",
        subtype: "household_composition",
        ordinal: "primary",
        accretion: false,
        description:"who else lives in this user's property"
    }],
    "accommodation_type": [{
		type: "personal",
		category: "household",
        subtype: "accommodation_type",
        ordinal: "primary",
        accretion: false,
        description:"user's accommodation_type"
    }],
    "tenancy": [{
		type: "personal",
		category: "household",
        subtype: "tenancy",
        ordinal: "primary",
        accretion: false,
        description:"user's tenancy"
    }],
    "rooms": [{
		type: "personal",
		category: "household",
        subtype: "rooms",
        ordinal: "primary",
        accretion: false,
        description:"rooms in a user's property"
    }],
    "occupancy_duration": [{
		type: "personal",
		category: "household",
        subtype: "occupancy_duration",
        ordinal: "primary",
        accretion: false,
        description:"how long a user has lived at their property"
    }],

   	"email": [{
		type: "personal",
		category: "contact",
        subtype: "email",
        ordinal: "primary",
        accretion: false,
        description:"user's primary email address"
    }],
    "landline": [{
		type: "personal",
		category: "contact",
        subtype: "landline",
        ordinal: "primary",
        accretion: false,
        description:"user's primary email address"
    }],
    "mobile": [{
		type: "personal",
		category: "contact",
        subtype: "mobile",
        ordinal: "primary",
        accretion: false,
        description:"user's primary email address"
    }],
    "work": [{
		type: "personal",
		category: "contact",
        subtype: "work",
        ordinal: "primary",
        accretion: false,
        description:"user's primary email address"
    }],


   	"marital_status": [{
		type: "personal",
		category: "family",
        subtype: "marital_status",
        ordinal: "primary",
        accretion: false,
        description:"user's marital status"
    }],
    "dependent_children": [{
		type: "personal",
		category: "family",
        subtype: "dependent_children",
        ordinal: "primary",
        accretion: false,
        description:"number of dependent children"
    }],
    "divorces": [{
		type: "personal",
		category: "family",
        subtype: "divorces",
        ordinal: "primary",
        accretion: false,
        description:"number of previous marriages"
    }],
    "siblings": [{
		type: "personal",
		category: "family",
        subtype: "siblings",
        ordinal: "primary",
        accretion: false,
        description:"number of siblings"
    }],
    "family_tree": [{
		type: "personal",
		category: "family",
        subtype: "family_tree",
        ordinal: "primary",
        accretion: false,
        description:"structure of family_tree"
    }],

    "cars": [{
		type: "personal",
		category: "ownership",
        subtype: "cars",
        ordinal: "primary",
        accretion: false,
        description:"number of cars"
    }],
    "properties": [{
		type: "personal",
		category: "ownership",
        subtype: "properties",
        ordinal: "primary",
        accretion: false,
        description:"number of properties"
    }],
    "possessions": [{
		type: "personal",
		category: "ownership",
        subtype: "possessions",
        ordinal: "primary",
        accretion: false,
        description:"list of possessions"
    }],

    "income": [{
		type: "personal",
		category: "finances",
        subtype: "income",
        ordinal: "primary",
        accretion: false,
        description:"user's income"
    }],
    "bank": [{
		type: "personal",
		category: "finances",
        subtype: "bank",
        ordinal: "primary",
        accretion: false,
        description:"user's main bank account"
    }],
    "cards": [{
		type: "personal",
		category: "finances",
        subtype: "cards",
        ordinal: "primary",
        accretion: false,
        description:"list of user's credit and debit cards"
    }],
    "mortgage": [{
		type: "personal",
		category: "finances",
        subtype: "mortgage",
        ordinal: "primary",
        accretion: false,
        description:"user's mortgage details"
    }],
    "overdraft": [{
		type: "personal",
		category: "finances",
        subtype: "overdrafts",
        ordinal: "primary",
        accretion: false,
        description:"user's overdraft details"
    }],
    "outgoings": [{
		type: "personal",
		category: "finances",
        subtype: "outgoings",
        ordinal: "primary",
        accretion: false,
        description:"user's monthly outgoings"
    }],
    "taxes": [{
		type: "personal",
		category: "finances",
        subtype: "taxes",
        ordinal: "primary",
        accretion: false,
        description:"user's tax submissions"
    }],
    "credit_score": [{
		type: "personal",
		category: "finances",
        subtype: "credit_score",
        ordinal: "primary",
        accretion: false,
        description:"user's credit score"
    }],
    "insurance": [{
		type: "personal",
		category: "finances",
        subtype: "insurance",
        ordinal: "primary",
        accretion: false,
        description:"user's insurance details"
    }],

    "alcohol": [{
		type: "personal",
		category: "consumption",
        subtype: "alcohol",
        ordinal: "primary",
        accretion: false,
        description:"average weekly units consumed"
    }],
    "cigarettes": [{
		type: "personal",
		category: "consumption",
        subtype: "cigarettes",
        ordinal: "primary",
        accretion: false,
        description:"number of cigarettes smoked daily"
    }],
    "calories": [{
		type: "personal",
		category: "consumption",
        subtype: "calories",
        ordinal: "primary",
        accretion: false,
        description:"average number of calories consumed daily"
    }],
    "spending_habits": [{
		type: "personal",
		category: "consumption",
        subtype: "spending_habits",
        ordinal: "primary",
        accretion: false,
        description:"user's spending habits"
    }],

    "memberships": [{
		type: "personal",
		category: "behaviour",
        subtype: "memberships",
        ordinal: "primary",
        accretion: false,
        description:"user's club memberships (e.g. gym)"
    }],
    "browsing": [{
		type: "personal",
		category: "behaviour",
        subtype: "browsing",
        ordinal: "primary",
        accretion: false,
        description:"user's web browsing data"
    }],
    "social_media": [{
		type: "personal",
		category: "behaviour",
        subtype: "social_media",
        ordinal: "primary",
        accretion: false,
        description:"user's social media usage"
    }],
    "routines": [{
		type: "personal",
		category: "behaviour",
        subtype: "routines",
        ordinal: "primary",
        accretion: false,
        description:"user's routines"
    }],

    "friends": [{
		type: "personal",
		category: "social",
        subtype: "friends",
        ordinal: "primary",
        accretion: false,
        description:"user's friends"
    }],
	"acquaintances": [{
		type: "personal",
		category: "social",
        subtype: "acquaintances",
        ordinal: "primary",
        accretion: false,
        description:"user's acquaintances"
    }],


    "clubs_and_societies": [{
		type: "personal",
		category: "preferences",
        subtype: "clubs_and_societies",
        ordinal: "primary",
        accretion: false,
        description:"clubs and societies user is a member of"
    }],
    "hobbies": [{
		type: "personal",
		category: "preferences",
        subtype: "hobbies",
        ordinal: "primary",
        accretion: false,
        description:"user hobbies"
    }],
     "interests": [{
		type: "personal",
		category: "preferences",
        subtype: "interests",
        ordinal: "primary",
        accretion: false,
        description:"user hobbies"
    }],
     "favourite_foods": [{
		type: "personal",
		category: "preferences",
        subtype: "favourite_foods",
        ordinal: "primary",
        accretion: false,
        description:"user favourite foods"
    }],
     "food_abstinence": [{
		type: "personal",
		category: "preferences",
        subtype: "food_abstinence",
        ordinal: "primary",
        accretion: false,
        description:"foods the user will not eat (i.e. vegetarian/vegan)"
    }],
     "music": [{
		type: "personal",
		category: "preferences",
        subtype: "music",
        ordinal: "primary",
        accretion: false,
        description:"user music preferences"
    }],
    "media": [{
		type: "personal",
		category: "preferences",
        subtype: "media",
        ordinal: "primary",
        accretion: false,
        description:"user media consumption"
    }],
    "colours": [{
		type: "personal",
		category: "preferences",
        subtype: "colours",
        ordinal: "primary",
        accretion: false,
        description:"user favourite colours"
    }],
    
    "cell_tower_logs": [{
		type: "personal",
		category: "tracking",
        subtype: "cell_tower",
        ordinal: "primary",
        accretion: false,
        description:"user cell tower logs"
    }],
     "gps_logs": [{
		type: "personal",
		category: "tracking",
        subtype: "gps_logs",
        ordinal: "primary",
        accretion: false,
        description:"user gps logs logs"
    }],
    "checkins": [{
		type: "personal",
		category: "tracking",
        subtype: "checkins",
        ordinal: "primary",
        accretion: false,
        description:"social media checkins"
    }],
    "email": [{
		type: "personal",
		category: "tracking",
        subtype: "email",
        ordinal: "primary",
        accretion: false,
        description:"email logs"
    }],
   
    "doctor": [{
		type: "personal",
		category: "health",
        subtype: "doctor",
        ordinal: "primary",
        accretion: false,
        description:"user's doctor"
    }],

};