// Noun subcategory classification for sentence template selection
// Used by sentence-generator.js to pick contextually appropriate dialogues

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
  'colleague', 'personnel', 'workforce', 'contractor', 'chairperson', 'attendee',
  'participant', 'facilitator', 'moderator', 'delegate', 'representative',
  'vendor', 'supplier', 'distributor', 'consumer', 'clientele', 'shareholder',
  'stakeholder', 'entrepreneur',
  // words4b - Contracts / Corporate
  'plaintiff', 'defendant', 'signatory', 'counterpart', 'beneficiary',
  'creditor', 'debtor', 'consultant', 'contractor',
  // words5a - Real Estate / Manufacturing
  'tenant', 'landlord', 'realtor', 'broker', 'assessor', 'landowner', 'occupant',
  'subcontractor',
  // words5b - Healthcare / Media / Hospitality
  'teller', 'physician', 'therapist', 'surgeon', 'optician', 'outpatient', 'inpatient',
  'commuter', 'pedestrian', 'passenger', 'carrier',
  'journalist', 'correspondent', 'anchor', 'reporter', 'editor', 'publisher', 'viewer',
  'listener', 'sponsor',
  'concierge', 'bellboy', 'valet', 'bartender', 'sommelier', 'proprietor',
]);

const BODY_WORDS = new Set([
  'head', 'eye', 'ear', 'nose', 'mouth', 'tooth', 'face', 'hair',
  'hand', 'finger', 'arm', 'leg', 'foot', 'body', 'heart', 'back', 'stomach',
  'pulse', 'scar',
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
]);

const ANIMAL_WORDS = new Set([
  'animal', 'dog', 'cat', 'bird', 'cow', 'pig', 'horse', 'sheep',
  'rabbit', 'mouse', 'duck', 'monkey', 'bear', 'lion', 'tiger',
  'elephant', 'snake', 'frog', 'butterfly', 'bee', 'predator',
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
]);

const WORK_WORDS = new Set([
  // words2 - Work nouns
  'deadline', 'salary', 'qualification', 'conference', 'department',
  'appointment', 'certificate', 'contract', 'interview', 'overtime',
  'proposal', 'revenue', 'occupation', 'inventory', 'budget', 'profession',
  'enterprise',
  // words4a - Office
  'agenda', 'memorandum', 'stationery', 'cubicle', 'extension', 'briefcase',
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
  'settlement', 'waiver', 'verdict',
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
  // words5a - Technology
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
  'luggage', 'delay', 'cancellation', 'route', 'schedule', 'passport', 'visa',
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
]);

// Chinese meaning patterns as fallback
const MEANING_PATTERNS = {
  person: /[人員師者夫母父兄弟姊妹親妻兒女孩客士官長叔姑嬸舅]/,
  body:   /頭|眼睛|耳朵|鼻子|嘴巴|手指|手臂|手|腳|身體|臉|心臟|背部|胃|肚|指|腿|牙齒|頭髮/,
  food:   /食物|餐|飯|麵|肉|菜|果|蛋|茶|咖啡|奶|湯|糖|鹽|酒|汁|甜點|披薩|三明治|巧克力|蛋糕|糖果/,
  animal: /狗|貓|鳥|馬|牛|豬|魚|蛇|蛙|蝶|蜂|象|虎|獅|熊|猴|羊|兔|鼠|鴨|動物/,
  nature: /風|雨|雪|雲|天空|太陽|月亮|星|冰|火|空氣|地球|草|花|樹|葉|石頭|沙|波浪|天氣|季節|暴風|霧|雷|閃電|洪水|地震|火山|海嘯/,
  place:  /園|院|館|站|店|場|室|市|城|國|島|路|街|橋|倉庫|所|廠|局|山|湖|河|海|港|碼頭/,
};

// English suffix heuristic for abstract concepts
const ABSTRACT_SUFFIXES = /(?:tion|sion|ment|ness|ity|ism|ance|ence|ology|ure|cy|dom|ship)$/i;

function classifyNoun(word, meaning) {
  const w = (word || '').toLowerCase();
  const m = meaning || '';

  // Layer 1: Explicit word sets (highest confidence)
  if (PERSON_WORDS.has(w)) return 'person';
  if (BODY_WORDS.has(w))   return 'body';
  if (FOOD_WORDS.has(w))   return 'food';
  if (ANIMAL_WORDS.has(w)) return 'animal';
  if (NATURE_WORDS.has(w)) return 'nature';
  if (PLACE_WORDS.has(w))  return 'place';
  if (WORK_WORDS.has(w))   return 'work';

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
