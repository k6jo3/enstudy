// Noun subcategory classification for sentence template selection
// Used by sentence-generator.js to pick contextually appropriate dialogues
// Categories (most specific → least specific):
//   transport, activity, household, tech, time, academic, legal, shopping,
//   measurement, person, body, food, animal, nature, place, work, abstract, object

const PERSON_WORDS = new Set([
  // words1 - Family
  'family', 'mother', 'father', 'sister', 'brother', 'baby', 'son', 'daughter',
  'parent', 'child', 'husband', 'wife', 'grandma', 'grandpa', 'uncle', 'aunt',
  // words1 - People
  'people', 'man', 'woman', 'boy', 'girl', 'friend', 'student',
  'doctor', 'nurse', 'teacher', 'police', 'farmer', 'driver', 'king', 'queen', 'waiter',
  // words2 - Work roles
  'colleague', 'employer', 'accountant', 'consultant', 'executive', 'instructor',
  // words3 - People
  'adversary', 'advocate', 'protagonist', 'proponent', 'nominee', 'predecessor',
  'successor', 'alumnus', 'undergraduate',
  // words4a - HR / Meetings / Marketing / Customer Service
  'applicant', 'candidate', 'mentor', 'trainee', 'supervisor', 'subordinate',
  'personnel', 'workforce', 'contractor', 'chairperson', 'attendee',
  'participant', 'facilitator', 'moderator', 'delegate', 'representative',
  'vendor', 'supplier', 'distributor', 'consumer', 'clientele', 'shareholder',
  'stakeholder', 'entrepreneur',
  // words4b - Contracts / Corporate
  'plaintiff', 'defendant', 'signatory', 'counterpart', 'beneficiary',
  'creditor', 'debtor',
  // words5a - Real Estate / Manufacturing
  'tenant', 'landlord', 'realtor', 'broker', 'assessor', 'landowner', 'occupant',
  'subcontractor',
  // words5b - Healthcare / Media / Hospitality
  'teller', 'physician', 'therapist', 'surgeon', 'optician', 'outpatient', 'inpatient',
  'commuter', 'pedestrian', 'passenger', 'carrier',
  'journalist', 'correspondent', 'anchor', 'reporter', 'editor', 'publisher', 'viewer',
  'listener', 'sponsor',
  'concierge', 'bellboy', 'valet', 'bartender', 'sommelier', 'proprietor',
  // Expanded person words
  'doorman', 'intern', 'apprentice', 'secretary', 'headhunter', 'paralegal',
  'nomad', 'accomplice', 'envoy', 'constituent', 'descendant', 'refugee',
  'valedictorian', 'fellow', 'playwright', 'columnist', 'porter', 'chauffeur',
  'bridesmaid', 'groomsman', 'soulmate', 'bestie', 'frenemy', 'workmate',
  'adolescent', 'inhabitant', 'peer', 'neighbor', 'hero', 'chef',
  'custodian', 'plumber', 'locksmith', 'referee', 'spectator',
  'conductor', 'homeowner', 'hacker', 'influencer', 'workaholic', 'shopaholic',
  'bachelor', 'oracle',
  'postgraduate',
  // Additional people
  'receptionist', 'copywriter', 'bellhop', 'dermatologist',
]);

const BODY_WORDS = new Set([
  'head', 'eye', 'ear', 'nose', 'mouth', 'tooth', 'face', 'hair',
  'hand', 'finger', 'arm', 'leg', 'foot', 'body', 'heart', 'back', 'stomach',
  'pulse', 'scar',
  // Expanded body words
  'collarbone', 'tendon', 'cartilage', 'vertebra', 'abdomen', 'pelvis',
  'sternum', 'capillary', 'elbow', 'ankle', 'ligament',
  'backbone', 'nerve', 'skull', 'rib', 'wrist', 'shoulder', 'knee', 'hip',
  'spine', 'jaw', 'throat', 'lung', 'liver', 'kidney', 'brain',
  'adrenaline', 'cortisol', 'melatonin', 'cholesterol', 'antibody',
]);

const FOOD_WORDS = new Set([
  // words1 - Food / Meals / Drinks / Fruits / Vegetables
  'food', 'rice', 'bread', 'egg', 'meat', 'chicken', 'fish', 'soup',
  'cake', 'candy', 'cheese', 'butter', 'chocolate', 'noodle', 'sandwich',
  'pizza', 'snack', 'salt', 'sugar', 'ice cream', 'hamburger', 'cookie',
  'pie', 'salad',
  'breakfast', 'lunch', 'dinner', 'meal',
  'water', 'milk', 'tea', 'coffee', 'juice',
  'fruit', 'apple', 'banana', 'grape', 'lemon', 'mango', 'watermelon',
  'strawberry', 'pear', 'peach', 'cherry', 'pineapple', 'orange',
  'vegetable', 'tomato', 'potato', 'carrot', 'onion', 'corn', 'bean',
  // words2 - Cooking
  'recipe', 'dessert', 'ingredient',
  // words5b - Hospitality food
  'appetizer', 'entree', 'beverage', 'cuisine', 'gourmet', 'buffet',
  'broth', 'condiment', 'delicacy', 'pastry', 'nutrient',
  // Expanded food words
  'seasoning', 'marinade', 'umami', 'turmeric', 'basil', 'oregano',
  'chutney', 'tahini', 'vinaigrette', 'tempura', 'granola', 'saffron',
  'béchamel', 'risotto', 'wok', 'grease', 'aroma', 'palate',
  'gluten', 'fiber', 'probiotic', 'antioxidant',
  'casserole', 'grocery', 'diet',
  // Additional food
  'brunch', 'prosciutto', 'rind', 'gazpacho', 'zest',
]);

const ANIMAL_WORDS = new Set([
  'animal', 'dog', 'cat', 'bird', 'cow', 'pig', 'horse', 'sheep',
  'rabbit', 'mouse', 'duck', 'monkey', 'bear', 'lion', 'tiger',
  'elephant', 'snake', 'frog', 'butterfly', 'bee', 'predator',
  // Expanded animal words
  'pelican', 'hedgehog', 'chameleon', 'salamander', 'chrysalis',
  'cockatoo', 'cockroach', 'plumage', 'burrow', 'talon', 'antler',
  'molting', 'symbiosis', 'species',
]);

const PLACE_WORDS = new Set([
  // words1 - Places / House / Nature-as-places
  'place', 'city', 'country', 'park', 'store', 'market', 'hospital',
  'restaurant', 'library', 'school', 'church', 'zoo', 'pool', 'bank',
  'station', 'street', 'road', 'bridge', 'farm',
  'house', 'home', 'room', 'bedroom', 'bathroom', 'kitchen', 'garden',
  'mountain', 'river', 'sea', 'beach', 'island', 'lake', 'forest',
  'desert', 'field', 'world',
  // words2 - Travel / Places
  'destination', 'airport', 'hotel',
  // words4a - Places
  'boardroom', 'office', 'campus',
  // words5a - Real Estate places / Construction
  'warehouse', 'headquarters', 'condominium', 'penthouse', 'duplex',
  'townhouse', 'township', 'premises', 'factory', 'mill',
  // words5b - Healthcare / Transportation / Hospitality places
  'clinic', 'pharmacy', 'ward', 'laboratory',
  'terminal', 'dock', 'harbor', 'highway', 'subway', 'railway',
  'platform', 'runway', 'intersection', 'roundabout', 'overpass', 'tollbooth',
  'resort', 'spa', 'sauna', 'lobby', 'lounge', 'inn', 'motel', 'hostel', 'lodge',
  'suite', 'balcony', 'terrace', 'venue',
  // Expanded place words
  'cathedral', 'temple', 'palace', 'ruins', 'observatory', 'fortress',
  'lighthouse', 'pyramid', 'pagoda', 'shrine', 'chapel', 'cemetery',
  'mall', 'fountain', 'statue', 'viewpoint', 'overlook', 'trailhead',
  'cavern', 'showroom', 'foyer', 'mezzanine', 'vestibule', 'cellar',
  'attic', 'driveway', 'porch', 'corridor', 'staircase', 'gazebo', 'pergola',
  'pantry', 'gallery', 'suburb', 'neighborhood', 'precinct', 'district',
  'province', 'territory', 'colony', 'enclave', 'frontier',
  'expressway', 'freeway', 'crosswalk',
  'oasis', 'waterfall', 'waterfront',
  'stockroom', 'storeroom', 'mailroom', 'depository', 'cubicle', 'cubby',
  'cubbyhole', 'locker', 'ballroom', 'auditorium', 'dormitory',
  'hangar', 'anchorage',
  'walkway', 'labyrinth',
  // Additional places
  'bakery', 'alley', 'promenade',
]);

const NATURE_WORDS = new Set([
  // words1 - Weather
  'weather', 'sun', 'moon', 'star', 'rain', 'snow', 'wind', 'cloud', 'sky',
  'rainbow', 'season',
  // words1 - Nature elements
  'tree', 'flower', 'grass', 'leaf', 'rock', 'stone', 'sand', 'wave',
  'fire', 'ice', 'air', 'earth', 'ground', 'land', 'hill',
  'continent', 'glacier', 'volcano', 'reef', 'peninsula', 'wilderness',
  // words2/3 - Environment
  'atmosphere', 'drought', 'typhoon', 'tsunami', 'avalanche', 'precipitation',
  'flood', 'earthquake', 'lightning', 'thunder', 'fog', 'storm',
  'pollution', 'erosion', 'deforestation', 'ecosystem', 'habitat',
  'biodiversity', 'flora', 'fauna', 'vegetation', 'canopy', 'ozone',
  'fossil', 'mineral', 'clay', 'mud', 'dust', 'ash',
  // Expanded nature words
  'plateau', 'canyon', 'delta', 'cliff', 'gorge', 'tundra', 'basin',
  'marsh', 'swamp', 'fjord', 'bluff', 'knoll', 'isthmus', 'atoll',
  'geyser', 'highland', 'lowland', 'topography', 'tremor',
  'undergrowth', 'reservoir', 'aquifer', 'permafrost',
  'stalactite', 'stalagmite', 'topsoil', 'rhizome', 'fern', 'lichen',
  'marigold', 'pollen', 'sepal', 'vine',
  'heatwave', 'frost', 'climate', 'dew', 'cyclone',
  'ravine', 'slope', 'tributary', 'watershed',
  'barometer', 'thermometer', 'hemisphere', 'equator',
  'latitude', 'longitude', 'meridian', 'cartography',
  'compost', 'pollutant', 'pesticide', 'carbon footprint',
  'biome', 'microbe', 'mulch', 'horizon',
  'catastrophe',
  // Additional nature
  'windchill', 'icebreaker',
]);

const WORK_WORDS = new Set([
  // words2 - Work nouns
  'deadline', 'salary', 'qualification', 'conference', 'department',
  'appointment', 'certificate', 'contract', 'interview', 'overtime',
  'proposal', 'revenue', 'occupation', 'inventory', 'budget', 'profession',
  'enterprise',
  // words4a - Office
  'agenda', 'memorandum', 'stationery', 'extension', 'briefcase',
  'filing', 'photocopy', 'paperwork', 'bulletin', 'invoice', 'receipt',
  'correspondence', 'postage', 'envelope', 'folder', 'cabinet', 'drawer',
  'spreadsheet', 'database', 'schedule', 'reminder', 'notification',
  'procedure', 'protocol', 'regulation', 'compliance', 'policy', 'guideline',
  'directory', 'logistics', 'scanner', 'printer', 'ledger',
  // words4a - HR
  'resume', 'probation', 'payroll', 'benefits', 'vacancy', 'orientation',
  'seniority', 'promotion', 'demotion', 'transfer', 'pension', 'compensation',
  'bonus', 'incentive', 'appraisal', 'evaluation', 'grievance', 'harassment',
  'discrimination', 'absenteeism', 'turnover', 'retention', 'flextime',
  'resignation', 'dismissal', 'severance', 'layoff', 'credential', 'stipend',
  // words4a - Marketing
  'campaign', 'brochure', 'advertisement', 'survey', 'target', 'brand',
  'slogan', 'endorsement', 'sponsorship', 'billboard', 'flyer', 'catalog',
  'testimonial', 'profit', 'margin', 'forecast', 'trend', 'benchmark',
  'competitor', 'strategy', 'outlet', 'retail', 'wholesale', 'merchandise',
  'franchise', 'trademark', 'patent', 'copyright', 'royalty', 'quota',
  'commission', 'discount', 'coupon', 'rebate', 'subscription', 'portfolio',
  // words4a - Customer Service
  'complaint', 'refund', 'warranty', 'satisfaction', 'inquiry', 'feedback',
  'dispute', 'priority', 'assurance', 'guarantee', 'voucher', 'loyalty',
  'patronage', 'rapport', 'hospitality', 'etiquette', 'malfunction',
  // words4a - Meetings
  'minutes', 'consensus', 'motion', 'resolution', 'amendment', 'committee',
  'quorum', 'keynote', 'presentation', 'projector', 'handout', 'workshop',
  'seminar', 'symposium', 'teleconference', 'itinerary', 'deliberation',
  // words4a - Business & Finance
  'audit', 'expenditure', 'liability', 'asset', 'equity', 'dividend',
  'merger', 'acquisition', 'bankruptcy', 'collateral', 'depreciation',
  'procurement', 'clause', 'arbitration', 'mediation', 'litigation',
  'nondisclosure', 'initiative', 'feasibility', 'overhead', 'downsizing',
  'subsidiary', 'conglomerate', 'prospectus', 'consortium', 'remittance',
  'lien', 'tenure', 'proxy', 'leverage',
  // words4b - Finance
  'accrual', 'liquidity', 'solvency', 'receivable', 'valuation',
  'withholding', 'inflation', 'amortization',
  // words4b - Negotiation
  'compromise', 'counteroffer', 'concession', 'deadlock', 'impasse', 'stalemate',
  // words4b - Contracts
  'provision', 'breach', 'renewal', 'disclosure', 'confidentiality',
  'jurisdiction', 'penalty', 'covenant', 'addendum', 'statute',
  'settlement', 'waiver',
  // words4b - Shipping / Logistics
  'freight', 'customs', 'tariff', 'consignment', 'shipment', 'distribution',
  'manifest', 'cargo', 'container', 'transit', 'clearance', 'embargo',
  'surcharge', 'fulfillment',
  // words4b - Corporate
  'accountability', 'transparency',
  // words4b - Additional Finance / Business
  'yield', 'annuity', 'premium', 'deductible', 'escrow', 'commodity',
  'monopoly', 'lease', 'remuneration', 'gratuity', 'retainer', 'quotation',
  'tender', 'bid', 'safeguard', 'demographics',
  // words5a - Manufacturing
  'defect', 'inspection', 'machinery', 'prototype', 'blueprint', 'forklift',
  'conveyor', 'output', 'batch', 'specification', 'component', 'productivity',
  'automation', 'assembly line', 'tolerance', 'downtime', 'throughput',
  'turnaround', 'bottleneck', 'shutdown', 'emission', 'gauge',
  'consumable', 'throttle', 'lubricant', 'polymer', 'soldering', 'workstation',
  'raw material', 'surplus',
  // words5a - Real Estate (business terms, not places)
  'mortgage', 'property', 'zoning', 'occupancy', 'deed', 'listing',
  'closing', 'down payment', 'utilities', 'compliance code', 'maintenance fee',
  'square footage', 'easement', 'foreclosure', 'title',
  // words5a - Technology (work-related)
  'software', 'bandwidth', 'interface', 'server', 'malware', 'firewall',
  'backup', 'peripheral', 'cloud computing', 'lag', 'integration', 'glitch',
  'algorithm', 'patch', 'rendering', 'router', 'latency', 'repository',
  'analytics', 'cybersecurity', 'firmware', 'virtualization', 'cache', 'pixel',
  'domain', 'outage', 'workflow', 'metadata', 'encryption',
  'mainframe', 'debugger', 'broadband', 'uplink', 'middleware', 'thumbnail',
  'phishing',
  // words5a - Construction
  'scaffold', 'foundation', 'plumbing', 'insulation', 'concrete', 'crane',
  'permit', 'beam', 'grading', 'renovation', 'ventilation', 'drainage',
  'wiring', 'zoning ordinance', 'reinforcement', 'elevation', 'slab',
  'drywall', 'rebar', 'facade', 'duct', 'paving', 'roofing', 'debris',
  'retrofit', 'cladding', 'trench', 'girder', 'masonry', 'landscaping',
  'hardhat', 'partition', 'waterproofing', 'commissioning', 'framing',
  'setback', 'terrain', 'retaining wall', 'joinery', 'compactor',
  'specification sheet', 'occupancy permit', 'grout', 'curbing', 'awning',
  'stucco', 'pillar', 'mortar', 'joist', 'conduit', 'trestle', 'backhoe', 'lintel',
  'prerequisite',
  // words5b - Banking
  'transaction', 'deposit', 'savings', 'statement', 'overdraft',
  'loan', 'credit', 'debit', 'balance', 'account', 'currency', 'fee',
  'installment', 'principal', 'bond', 'stock', 'investment', 'fund',
  'insurance', 'debt', 'finance', 'treasury', 'vault',
  // words5b - Healthcare (non-place, non-person terms)
  'prescription', 'symptom', 'diagnosis', 'dosage', 'allergy',
  'vaccination', 'immunization', 'rehabilitation', 'therapy', 'consultation',
  'examination', 'treatment', 'medication', 'tablet', 'capsule', 'ointment',
  'bandage', 'stethoscope', 'anesthesia', 'radiology', 'ultrasound',
  'specimen', 'biopsy', 'referral', 'prognosis', 'epidemic', 'hygiene',
  'nutrition', 'supplement', 'wellness', 'ambulance', 'emergency',
  // words5b - Transportation (non-place terms)
  'fare', 'congestion', 'detour', 'boarding', 'departure', 'arrival',
  'luggage', 'delay', 'cancellation', 'route', 'passport', 'visa',
  'connection', 'excursion', 'mileage', 'aviation', 'turbulence',
  'altitude', 'navigation', 'immigration',
  // words5b - Media (non-person terms)
  'editorial', 'circulation', 'headline', 'column', 'tabloid', 'segment',
  'manuscript', 'article', 'feature', 'press', 'coverage', 'documentary',
  'rating', 'network', 'satellite', 'antenna', 'podcast', 'blog',
  'newsletter', 'magazine', 'journal', 'periodical', 'review', 'critique',
  'commentary', 'byline', 'source', 'quote', 'caption', 'illustration',
  'graphic', 'print',
  // words5b - Hospitality (non-place, non-person, non-food terms)
  'banquet', 'catering', 'reservation', 'accommodation', 'checkout',
  'housekeeping', 'reception', 'menu', 'tip', 'linen', 'pillow',
  'mattress', 'minibar', 'laundry',
  // words6+ - Office / Work expanded
  'workspace', 'switchboard', 'whiteboard', 'toner', 'cartridge', 'copier',
  'voicemail', 'intercom', 'workload', 'roster', 'dossier', 'podium',
  'badge', 'inbox', 'outbox', 'fax', 'timesheet', 'nameplate', 'memo',
  'notepad', 'logbook', 'backlog', 'workday', 'timeclock',
  'briefing', 'roundtable', 'webinar', 'overview', 'rundown',
  'gavel', 'lectern', 'huddle', 'caucus', 'breakout', 'followup',
  'kickoff', 'townhall', 'slideshow', 'flipchart', 'rehearsal',
  'takeaway', 'format', 'thread', 'disclaimer', 'footer',
  'spellcheck', 'alert', 'login', 'logout', 'passcode', 'toolbar',
  'popup', 'timestamp', 'forwarding',
  'synergy', 'pipeline', 'breakeven', 'affiliate', 'downturn', 'upturn',
  'scope', 'timeline', 'criterion', 'baseline', 'charter', 'mockup',
  'blocker', 'constraint', 'tradeoff', 'handoff', 'fallback', 'buffer',
  'input', 'release', 'retrospective', 'postmortem', 'subtask',
  'workstream', 'spec', 'oversight', 'diagram', 'checkpoint',
  'handover', 'cutover',
  'stapler', 'clipboard', 'binder', 'shredder', 'photocopier',
  'memoranda', 'furlough', 'maternity leave', 'paternity leave',
  'burnout', 'overtime pay', 'multitasking', 'attrition rate',
  'carpooling', 'filing cabinet', 'retainer fee', 'pink slip',
  'letterbox', 'signage', 'fixture',
  // words7+ - Marketing / Business expanded
  'jingle', 'flagship product', 'buyout', 'cold call', 'loyalty program',
  'revenue stream', 'guerrilla marketing', 'impressions', 'ROI',
  'focus group', 'rollout', 'viral marketing', 'clickbait', 'A/B testing',
  'giveaway', 'affiliate marketing', 'infographic', 'tagline',
  'property tax', 'curb appeal', 'sublease', 'commercial property',
  'plot', 'walkthrough', 'floorplan', 'leasehold', 'skylight',
  'kickback', 'markup', 'venture capital', 'gross margin', 'per diem',
  'escrow account', 'benchmark rate', 'arrears',
  // Finance expanded
  'underwriting', 'salvage', 'securities', 'derivative', 'arbitrage',
  'compounding', 'tranche', 'syndicate', 'surtax', 'usury', 'bullion',
  'damages', 'brokerage', 'interest',
  'inspection report', 'commercial', 'check-in counter', 'departure gate',
  'amenities package', 'courtesy shuttle', 'excursion guide',
  'itinerary change', 'observation deck', 'postcard',
  "traveler's check", 'maiden voyage', 'customs duty', 'port of entry',
  'exchange rate',
  // Additional work terms
  'standup', 'bill', 'tab',
]);

// ===== NEW CATEGORIES =====

const TRANSPORT_WORDS = new Set([
  // Vehicles
  'taxi', 'cab', 'ferry', 'yacht', 'canoe', 'sedan', 'convertible', 'minivan',
  'bus', 'car', 'boat', 'airplane', 'monorail', 'hovercraft', 'gondola',
  'tram', 'rickshaw', 'locomotive', 'limousine', 'taxicab', 'shuttle',
  'vehicle', 'cruise',
  // Vehicle parts
  'seatbelt', 'dashboard', 'bumper', 'fuselage', 'cockpit', 'tarmac',
  'propeller', 'exhaust', 'diesel', 'trunk', 'brake', 'headlight',
  'windshield', 'engine', 'fuel', 'stoplight',
  // Roads / Infrastructure
  'ramp', 'boulevard', 'underpass', 'bypass', 'interchange', 'lane',
  'divider', 'taxiway',
  // Services
  'rideshare', 'chauffeur', 'porter', 'escalator', 'conveyor belt',
  // Maritime
  'berth', 'porthole', 'galley', 'mooring', 'buoy', 'lifeboat', 'beacon',
  'anchorage',
  // Sleeping / Travel gear
  'futon', 'sleeper', 'baggage', 'rucksack', 'knapsack', 'duffel',
  'carry-on', 'luggage',
  // Travel-related
  'layover', 'stopover', 'jetlag', 'jet lag', 'detour', 'carousel',
  'aisle', 'toll', 'boarding pass', 'check-in', 'rental car',
  'souvenir', 'sightseeing', 'backpacking', 'getaway',
  'overbooking', 'front desk', 'wake-up call',
]);

const ACTIVITY_WORDS = new Set([
  // Sports
  'snorkeling', 'surfing', 'scuba', 'camping', 'hiking', 'kayaking',
  'paragliding', 'zipline', 'bungee', 'yoga', 'jogging', 'workout',
  'aerobics', 'gymnastics', 'archery', 'fencing', 'triathlon', 'relay',
  'marathon', 'warmup', 'athletics', 'kayak',
  // Games / Hobbies
  'billiards', 'badminton', 'croquet', 'juggling', 'origami', 'embroidery',
  'decoupage', 'macramé', 'cosplay', 'karaoke', 'binge-watching', 'stand-up',
  'foosball', 'calligraphy', 'pottery', 'pastime',
  // Performance / Arts activities
  'choreography', 'ballet', 'opera', 'stunt', 'trapeze', 'pantomime',
  'vaudeville', 'skincare',
  // Entertainment
  'game', 'music', 'song', 'story',
  // Media / Entertainment items
  'spoiler', 'sequel', 'prequel', 'trailer', 'premiere', 'soundtrack',
  'livestream', 'live stream', 'subplot', 'sitcom', 'blockbuster', 'remake',
  'reboot', 'spin-off', 'streaming', 'playlist', 'reality show', 'ratings',
  'debut', 'encore', 'comeback', 'scandal', 'recap', 'teaser', 'blooper',
  'talk show', 'red carpet', 'box office', 'documentary',
  // Music
  'cello', 'oboe', 'tambourine', 'harmonica', 'concerto', 'sonata',
  'fugue', 'prelude', 'jukebox', 'discography', 'crescendo',
  'symphony', 'orchestra', 'ensemble',
  // Arts
  'exhibit', 'mural', 'canvas', 'palette', 'genre', 'prose', 'verse',
  'memoir', 'biography', 'screenplay', 'cinematography', 'watercolor',
  'sketch', 'masterpiece', 'monologue', 'fresco', 'libretto',
  'curtain call', 'troupe', 'memorabilia',
]);

const HOUSEHOLD_WORDS = new Set([
  // Basics
  'towel', 'blanket', 'bathrobe', 'microwave', 'broom', 'bucket',
  'scissors', 'screwdriver', 'kettle', 'oven', 'stove', 'ladder',
  'mop', 'rake', 'hose', 'jar', 'jug', 'candle', 'carpet', 'curtain',
  'cushion', 'lock', 'sink', 'shower', 'stool', 'tray', 'hanger',
  'vacuum', 'dishwasher', 'thermostat', 'dryer', 'dustpan', 'freezer',
  'funnel', 'saucer', 'socket', 'sprinkler', 'tile', 'tissue', 'toolbox',
  'valve', 'pliers', 'switch', 'lid', 'latch', 'nozzle', 'pail', 'rug',
  'chimney', 'fireplace', 'garage', 'gate',
  'clothespin', 'doorbell', 'mailbox', 'doorknob',
  // Kitchen tools
  'corkscrew', 'colander', 'spatula', 'grater', 'sieve', 'skillet',
  'saucepan', 'tablecloth', 'platter',
  // Home items
  'lampshade', 'coaster', 'bleach', 'cardboard', 'peg', 'hinge',
  'doorstep', 'clothesline', 'corkboard', 'dustbin', 'floorboard',
  'windowsill', 'stepladder', 'clotheshorse', 'wastebasket', 'peephole',
  'ashtray', 'flatiron', 'dishcloth', 'bedspread', 'comforter',
  // Furniture
  'bed', 'table', 'chair', 'desk', 'bookshelf', 'recliner',
  'mantelpiece', 'chandelier', 'countertop', 'pantry shelf',
  'armoire', 'wardrobe', 'closet', 'swivel chair',
  // Home structure
  'floor', 'wall', 'roof', 'lamp', 'door', 'window',
  'eaves', 'gutter', 'trellis', 'linoleum',
  'drainpipe', 'caulk', 'deadbolt', 'spackle', 'trowel',
  'wainscoting', 'dado', 'finial', 'squeegee', 'pelmet',
  'transom', 'molding', 'hassock', 'duvet', 'sconce',
  // Home general
  'chore', 'household', 'detergent',
  'receptacle',
  // Additional household items
  'hammock', 'flashlight', 'faucet',
]);

const TECH_WORDS = new Set([
  // General tech
  'browser', 'blockchain', 'GPS', 'streaming', 'screenshot', 'hashtag',
  'emoji', 'selfie', 'processor', 'motherboard', 'sensor', 'gadget',
  'charger', 'adapter', 'earbuds', 'touchscreen', 'gigabyte', 'barcode',
  // Programming
  'backend', 'frontend', 'syntax', 'boolean', 'variable', 'parameter',
  'loop', 'array', 'framework', 'dropdown', 'tooltip', 'modal', 'navbar',
  'snippet', 'sprint', 'scrum', 'endpoint', 'payload', 'schema',
  'telemetry', 'hotfix', 'changelog', 'leaderboard', 'avatar',
  'biometrics', 'captcha', 'integer',
  // Tech items
  'gateway', 'kernel', 'node', 'query', 'uptime', 'wireframe', 'token',
  'runtime', 'stack', 'rollback', 'microservice', 'caching', 'parsing',
  'callback', 'linting', 'dataset',
  // Digital / Web
  'bookmark', 'tab', 'plugin', 'widget', 'template', 'traffic',
  'SEO', 'machine learning', 'e-commerce', 'forum',
  'spam', 'ransomware', 'antivirus', 'hosting', 'bluetooth', 'hotspot',
  'bug', 'buffer', 'freemium', 'tutorial', 'content',
  'DM', 'filter', 'hyperlink', 'paywall',
  // Hardware
  'hardware', 'storage', 'wearable', 'startup', 'semiconductor',
  'data mining', 'crowdsourcing', '3D printing', 'beta',
  // Devices / Office tech
  'phone', 'computer', 'camera',
]);

const TIME_WORDS = new Set([
  // Basic time
  'morning', 'afternoon', 'evening', 'night', 'day', 'month', 'year',
  'hour', 'minute', 'clock', 'time',
  // Specific times
  'dawn', 'dusk', 'midnight', 'noon', 'twilight',
  // Periods
  'decade', 'century', 'millennium', 'era', 'epoch', 'fortnight',
  'semester', 'trimester',
  // Events
  'anniversary', 'interval', 'weekday', 'countdown',
  'solstice', 'equinox', 'hiatus', 'lapse',
  // Calendar months
  'january', 'february', 'march', 'april', 'august',
  'september', 'october', 'november', 'december',
  // Other time words
  'workday', 'period', 'cycle', 'shift', 'timezone', 'stopwatch',
  'prime time', 'peak season',
]);

const ACADEMIC_WORDS = new Set([
  // Education terms
  'curriculum', 'thesis', 'syllabus', 'diploma', 'elective',
  'hypothesis', 'textbook', 'vocabulary', 'lesson', 'homework', 'class',
  'test', 'rubric', 'transcript', 'fieldwork', 'tutoring',
  'alumni', 'valedictorian', 'postgraduate', 'recess',
  'bibliography', 'pedagogy', 'aptitude', 'discourse', 'almanac',
  'rhetoric', 'criteria', 'criterion', 'discipline',
  // School supplies
  'book', 'pen', 'pencil', 'paper', 'ruler', 'eraser', 'board', 'page',
  'word', 'English',
  // Science
  'photosynthesis', 'molecule', 'catalyst', 'nucleus', 'genome', 'enzyme',
  'microscope', 'telescope', 'apparatus', 'electrode', 'beaker', 'flask',
  'solvent', 'alloy', 'isotope', 'amplitude', 'spectrum', 'synthesis',
  'carbon', 'compound', 'chromosome', 'genetics', 'bacteria', 'virus',
  'vaccine', 'astronomy', 'thermodynamics', 'anatomy', 'psychiatry',
  'pathogen', 'pandemic', 'placebo', 'antibiotic', 'transplant',
  'entropy', 'trajectory', 'magnitude',
  // Research / Study
  'research', 'discovery', 'knowledge',
  'paradigm', 'analogy', 'excerpt', 'doctrine',
  'yearbook',
  // Medical/science tools
  'scalpel', 'triage', 'stethoscope', 'specimen', 'biopsy',
]);

const LEGAL_WORDS = new Set([
  // Criminal law
  'subpoena', 'affidavit', 'perjury', 'acquittal', 'tort', 'decree',
  'bail', 'parole', 'felony', 'misdemeanor', 'larceny', 'fraud', 'libel',
  'malpractice', 'probate', 'bequest', 'plea', 'summons',
  // Government / Politics
  'ballot', 'suffrage', 'treaty', 'accord', 'veto', 'asylum',
  'constitution', 'sovereignty', 'referendum', 'monarchy', 'welfare',
  'liberty', 'anarchy', 'regime', 'curfew', 'propaganda',
  'subsidy', 'pact', 'electorate', 'stimulus', 'autonomy',
  // Legal expanded
  'recourse', 'redress', 'duress', 'estoppel', 'codicil', 'docket',
  'writ', 'proviso', 'quid pro quo', 'caveat', 'bribery', 'cartel',
  'trespass', 'deterrent', 'impropriety', 'preamble',
  'tribunal', 'tyranny', 'amnesty', 'siege', 'hegemony',
  'genocide', 'espionage', 'quarantine',
  'mandate', 'moratorium', 'precedent', 'prejudice', 'prerogative',
  'testimony', 'excise',
  // Additional legal/gov
  'respondent', 'embezzlement', 'verdict',
]);

const SHOPPING_WORDS = new Set([
  // Retail
  'cart', 'shelf', 'rack', 'accessory', 'fabric', 'textile',
  'apparel', 'footwear', 'cosmetics', 'jewelry', 'electronics', 'sticker',
  'markdown', 'delivery', 'tracking', 'parcel', 'package', 'layaway',
  'cashback', 'sale', 'price', 'cost', 'charge', 'promo',
  'showroom', 'overstock', 'resale', 'trinket',
  // Fabrics / Fashion
  'corduroy', 'polyester', 'velvet', 'suede', 'lapel', 'zipper', 'lace',
  'attire',
  // Clothing items
  'clothes', 'shirt', 'pants', 'dress', 'shoe', 'hat', 'coat', 'jacket',
  'sock', 'skirt', 'glasses',
  // Shopping misc
  'sample', 'exchange', 'luxury', 'shipping', 'purchase', 'bulk',
  'bargain', 'expense', 'import', 'export', 'commerce',
  'gift', 'toy', 'mirror', 'ticket', 'binoculars',
  'showcase', 'fortune',
  // Personal care
  'moisturizer', 'sunscreen', 'haircut', 'detox',
  // Consumer items
  'box', 'cup', 'plate', 'bottle', 'knife', 'fork',
  'bag', 'key', 'map', 'letter', 'money',
  'wishlist',
  // Home appliance shopping
  'preservative', 'additive', 'expiry',
]);

const MEASUREMENT_WORDS = new Set([
  // Numbers
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'zero', 'hundred', 'thousand', 'million', 'billion', 'trillion', 'dozen',
  'quarter', 'half',
  // Units
  'percentage', 'diameter', 'radius', 'acre', 'hectare', 'gallon', 'ounce',
  'kilogram', 'liter', 'ratio', 'median', 'average', 'tally',
  'deficit', 'threshold', 'remainder', 'integer', 'volume', 'symmetry',
  'celsius', 'fahrenheit', 'centimeter', 'millimeter', 'carat', 'tonne',
  'fathom', 'knot', 'caliber', 'logarithm', 'arithmetic',
  // Math / Statistics
  'formula', 'statistics', 'graph', 'chart', 'sum', 'total', 'aggregate',
  'data', 'area', 'maximum', 'minimum', 'color',
]);

// Chinese meaning patterns as fallback
// MEANING_PATTERNS — Layer 2 fallback for words not in explicit Sets
// IMPORTANT: patterns must be specific to avoid false positives
// e.g., 頭 alone matches 水龍頭/碼頭, so use compound patterns only
// Order matches Layer 1 priority (most specific → least specific)
const MEANING_PATTERNS = {
  transport: /計程車|公車|巴士|火車|捷運|高鐵|飛機|船舶|渡輪|遊艇|轎車|卡車|貨車|機車|腳踏車|纜車|直升機|地鐵|單軌|氣墊船|獨木舟|敞篷車|廂型車|保險桿|擋風玻璃|儀表板|安全帶|排氣管|方向盤|引擎|匝道|交通|航班|航線|搭乘|駕駛|行李轉盤|登機/,
  activity:  /運動|游泳|跑步|滑雪|攀岩|健身|瑜伽|射箭|擊劍|體操|有氧|接力|馬拉松|浮潛|衝浪|露營|健行|划船|跳傘|攀登|高空|彈跳|潛水|慢跑|棒球|籃球|排球|足球|羽球|桌球|網球|桌遊|摺紙|刺繡|雜耍|編織|手工藝|歌劇|芭蕾|管弦|交響|合唱|演奏|獨奏|電影攝影|獨白|串流|直播|點唱|劇本|編舞|特技|彩排/,
  household: /水龍頭|抹刀|開瓶器|濾網|鍋鏟|研磨器|菜刀|平底鍋|湯鍋|水壺|烤箱|微波爐|電鍋|冰箱|洗碗機|吸塵器|熨斗|掃把|拖把|水桶|抹布|垃圾桶|衣架|曬衣架|梯子|工具箱|螺絲起子|老虎鉗|鑰匙|門鎖|門鈴|防盜鎖|窗簾|地毯|靠墊|坐墊|毛毯|棉被|枕頭|浴袍|毛巾|面紙|磁磚|水槽|蓮蓬頭|馬桶|插座|開關|閥門|噴頭|花瓶|蠟燭|燈罩|杯墊|托盤|紙板|晾衣|漏斗|噴灑|剪刀|恆溫器|乾衣機|門把|窺視孔|踏墊/,
  tech:      /程式|軟體|硬體|伺服器|資料庫|資料集|演算法|瀏覽器|區塊鏈|人工智慧|機器學習|串流|截圖|表情符號|觸控螢幕|處理器|主機板|感測器|晶片|頻寬|快取|像素|延遲|韌體|虛擬化|儲存庫|中介軟體|閘道器|令牌|遙測|前端|後端|框架|端點|排程|模組|參數|變數|函式|陣列|迴圈|整數|布林|語法|除錯|部署|加密|解密|編譯|最佳化|網路釣魚|垃圾訊息|勒索軟體|防毒|惡意軟體|免費增值|藍芽|熱點|無線|頻寬|外掛|小工具/,
  time:      /黎明|破曉|黃昏|午夜|正午|日出|日落|早晨|上午|下午|傍晚|夜晚|清晨|凌晨|世紀|年代|十年|千年|紀元|時代|學期|季度|雙週|工作日|倒數計時|春分|秋分|夏至|冬至|鐘錶|手錶|鬧鐘|星期|週末|一月|二月|三月|四月|五月|六月|七月|八月|九月|十月|十一月|十二月|春天|夏天|秋天|冬天/,
  academic:  /課程|學期|論文|學位|畢業|選修|必修|學分|成績單|實習|校友|博士|碩士|大學|學士|教授|講師|實驗室|研究所|假說|課綱|大綱|教科書|參考書目|獎學金|入學|教學法|範例|考試|測驗|顯微鏡|望遠鏡|細菌|病毒|疫苗|酵素|染色體|基因|分子|原子|同位素|合金|化合物|光譜|合成|熱力學|半導體|電極/,
  legal:     /法律|法規|法院|法官|律師|法庭|犯罪|罪行|重罪|輕罪|竊盜|詐欺|誹謗|醫療疏失|遺囑認證|遺贈|答辯|傳票|選票|投票|條約|協定|否決|庇護|主權|公投|憲法|議會|假釋|保釋|判決|起訴|訴訟|裁決|仲裁|管轄權|侵權|偽證|無罪|赦免|無政府|君主|福利|宵禁|政權|制裁|外交|大使|立法|行政/,
  shopping:  /購物|購買|商店|百貨|價格|打折|折扣|優惠券|特價|降價|現金回饋|條碼|配送|包裹|快遞|追蹤|退貨|退款|布料|紡織|服飾|鞋類|化妝品|珠寶|首飾|電子產品|衣服|褲子|裙子|帽子|襪子|外套|夾克|背心|領帶|拉鏈|蕾絲|絲絨|麂皮|燈芯絨|聚酯|手提包|配件|展示間|庫存過剩|轉售|二手/,
  measurement: /百分比|直徑|半徑|英畝|公頃|加侖|盎司|公斤|公升|比率|比例|中位數|平均數|統計|公式|圖表|總和|總計|一打|十億|兆|攝氏|華氏|公分|毫米|克拉|噸|英尋|口徑|對數|算術|面積|體積|容量|整數|小數|餘數|中值/,
  person:    /醫師|護士|老師|教師|律師|工程師|會計師|經理|主管|員工|同事|秘書|實習生|學徒|志工|偵探|記者|主播|編輯|作家|演員|導演|廚師|服務生|警察|軍人|農夫|司機|飛行員|船長|管理員|清潔工|水電工|鎖匠|裁縫|理髮師|建築師|攝影師|設計師|翻譯|顧問|經紀人|仲介|房東|房客|債權人|債務人|原告|被告|證人|陪審|候選人|選民|外交官|難民|朝聖者|校友|策展人|伴郎|伴娘|閨蜜/,
  body:      /眼睛|耳朵|鼻子|嘴巴|嘴唇|手指|手臂|手腕|手肘|手掌|腳趾|腳踝|大腿|小腿|膝蓋|肩膀|脖子|下巴|額頭|臉頰|眉毛|睫毛|牙齒|舌頭|頭髮|頭皮|心臟|肝臟|肺|腎臟|胃|腸|脾臟|膀胱|鎖骨|肌腱|軟骨|脊椎|腹部|骨盆|胸骨|微血管|肋骨|韌帶|肌肉|骨頭|皮膚|血管|神經|關節|腺體|腎上腺素|褪黑激素|皮質醇|抗氧化劑/,
  food:      /食物|食品|早餐|午餐|晚餐|點心|零食|甜點|主菜|前菜|開胃菜|飲料|米飯|麵包|麵條|肉類|雞肉|豬肉|牛肉|海鮮|蔬菜|水果|蛋糕|餅乾|披薩|三明治|漢堡|沙拉|湯品|巧克力|糖果|冰淇淋|奶油|起司|調味料|醃料|鮮味|薑黃|羅勒|奧勒岡|酸辣醬|芝麻醬|油醋醬|天婦羅|燕麥|番紅花|義大利燉飯|冷湯|火腿|果皮|益生菌|麩質|素食|雜貨/,
  animal:    /動物|寵物|野生動|哺乳類|爬蟲類|兩棲|鳥類|昆蟲|小狗|小貓|兔子|老鼠|駱駝|大象|老虎|獅子|熊|猴子|小鹿|狐狸|老鷹|鴿子|鸚鵡|海豚|鯊魚|蜥蜴|烏龜|刺蝟|變色龍|蠑螈|蝴蝶|蜜蜂|螞蟻|蛹|鵜鶘|草食動物|肉食動物|有袋動物|羽毛|爪子|鱗片|巢穴/,
  nature:    /天氣|氣候|氣溫|降雨|降雪|颱風|颶風|龍捲風|海嘯|地震|火山|洪水|乾旱|暴風|閃電|打雷|冰雹|霜|露|薄霧|濃霧|彩虹|天空|雲層|陽光|月光|高原|峽谷|三角洲|懸崖|峽|凍原|沼澤|盆地|峽灣|間歇泉|地衣|蕨類|苔蘚|花粉|根莖|表土|鐘乳石|石筍|水庫|含水層|永凍土|侵蝕|沉積|生態|棲地|森林|草原|荒野|珊瑚|冰川|河流|瀑布|湖泊|溪流|山脈|丘陵/,
  place:     /公園|醫院|學校|教堂|圖書館|博物館|美術館|體育場|機場|車站|火車站|港口|碼頭|市場|商場|百貨公司|飯店|旅館|餐廳|咖啡廳|銀行|郵局|警察局|消防局|法院|監獄|劇院|電影院|遊樂園|動物園|植物園|游泳池|停車場|加油站|倉庫|工廠|辦公室|教室|宿舍|禮堂|實驗室|藥局|診所|病房|寺廟|宮殿|城堡|堡壘|燈塔|金字塔|寶塔|神社|墓地|紀念碑|噴泉|雕像|天文台|觀景台|大廳|走廊|門廊|陽台|露台|地下室|閣樓|車道|玄關|涼亭|花架|郊區|市中心|城鎮|鄉村/,
};

// English suffix heuristic for abstract concepts
const ABSTRACT_SUFFIXES = /(?:tion|sion|ment|ness|ity|ism|ance|ence|ology|ure|cy|dom|ship)$/i;

function classifyNoun(word, meaning) {
  const w = (word || '').toLowerCase();
  const m = meaning || '';

  // Layer 1: Explicit word sets (most specific → least specific)
  if (TRANSPORT_WORDS.has(w))   return 'transport';
  if (ACTIVITY_WORDS.has(w))    return 'activity';
  if (HOUSEHOLD_WORDS.has(w))   return 'household';
  if (TECH_WORDS.has(w))        return 'tech';
  if (TIME_WORDS.has(w))        return 'time';
  if (ACADEMIC_WORDS.has(w))    return 'academic';
  if (LEGAL_WORDS.has(w))       return 'legal';
  if (SHOPPING_WORDS.has(w))    return 'shopping';
  if (MEASUREMENT_WORDS.has(w)) return 'measurement';
  if (PERSON_WORDS.has(w))      return 'person';
  if (BODY_WORDS.has(w))        return 'body';
  if (FOOD_WORDS.has(w))        return 'food';
  if (ANIMAL_WORDS.has(w))      return 'animal';
  if (NATURE_WORDS.has(w))      return 'nature';
  if (PLACE_WORDS.has(w))       return 'place';
  if (WORK_WORDS.has(w))        return 'work';

  // Layer 2: Chinese meaning patterns
  for (const [cat, re] of Object.entries(MEANING_PATTERNS)) {
    if (re.test(m)) return cat;
  }

  // Layer 3: English suffix heuristic
  if (ABSTRACT_SUFFIXES.test(w)) return 'abstract';

  // Default: physical objects (original templates work well)
  return 'object';
}

module.exports = { classifyNoun };
