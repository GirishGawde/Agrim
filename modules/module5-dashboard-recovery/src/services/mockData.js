// Synthetic mock data — 100% fabricated; no real people, addresses or phone numbers.
// Keep consistent with data/synthetic/ CSVs (same IDs referenced there).

export const MOCK_VOLUNTEERS = [
  { id: 'v001', name: 'Arjun Naik', area: 'Patto', skills: 'first_aid,boat', vehicle: 'boat', availability: true, lat: 15.4989, lng: 73.8278 },
  { id: 'v002', name: 'Sunita Dessai', area: 'Panaji', skills: 'first_aid', vehicle: 'motorcycle', availability: true, lat: 15.4909, lng: 73.8278 },
  { id: 'v003', name: 'Ramesh Gaonkar', area: 'Ribandar', skills: 'boat,rescue', vehicle: 'boat', availability: false, lat: 15.5021, lng: 73.8431 },
  { id: 'v004', name: 'Priya Parsekar', area: 'Taleigao', skills: 'medical,first_aid', vehicle: 'car', availability: true, lat: 15.4761, lng: 73.8513 },
  { id: 'v005', name: 'Kiran Chari', area: 'Bambolim', skills: 'rescue', vehicle: 'none', availability: true, lat: 15.4641, lng: 73.8622 },
];

export const MOCK_REPORTS = [
  {
    id: 'rep-001', area: 'Patto', lat: 15.4989, lng: 73.8278,
    hazard_type: 'flood', severity: 'high', description: 'Lane near the market completely submerged. Water ~1 m deep.',
    status: 'open', reported_by: 'citizen-a1', created_at: '2026-10-01T06:12:00Z', updated_at: '2026-10-01T06:12:00Z',
    assigned_volunteer: null, photo_url: null, verified: true,
  },
  {
    id: 'rep-002', area: 'Ribandar', lat: 15.5021, lng: 73.8431,
    hazard_type: 'landslide', severity: 'medium', description: 'Mudslide blocking the road near the bridge. One side passable.',
    status: 'assigned', reported_by: 'citizen-b2', created_at: '2026-10-01T05:44:00Z', updated_at: '2026-10-01T07:00:00Z',
    assigned_volunteer: 'v003', photo_url: null, verified: true,
  },
  {
    id: 'rep-003', area: 'Panaji', lat: 15.4909, lng: 73.8278,
    hazard_type: 'flood', severity: 'low', description: 'Minor waterlogging near the bus stand, draining slowly.',
    status: 'resolved', reported_by: 'citizen-c3', created_at: '2026-10-01T04:30:00Z', updated_at: '2026-10-01T08:15:00Z',
    assigned_volunteer: 'v002', photo_url: null, verified: true,
  },
  {
    id: 'rep-004', area: 'Taleigao', lat: 15.4761, lng: 73.8513,
    hazard_type: 'fire', severity: 'high', description: 'Scrub fire spotted near the hill. Wind pushing toward houses.',
    status: 'open', reported_by: 'citizen-d4', created_at: '2026-10-01T07:55:00Z', updated_at: '2026-10-01T07:55:00Z',
    assigned_volunteer: null, photo_url: null, verified: false,
  },
  {
    id: 'rep-005', area: 'Bambolim', lat: 15.4641, lng: 73.8622,
    hazard_type: 'flood', severity: 'medium', description: 'Paddy fields waterlogged. Farmer reports standing water for 2 days.',
    status: 'open', reported_by: 'citizen-e5', created_at: '2026-09-30T18:20:00Z', updated_at: '2026-09-30T18:20:00Z',
    assigned_volunteer: null, photo_url: null, verified: true,
  },
];

export const MOCK_INCIDENTS = [
  {
    id: 'inc-001', area: 'Patto', date: '2024-07-15', hazard_type: 'flood',
    what_flooded: 'Commercial street and parking area, ~300 m stretch', damage_level: 'severe',
    what_worked: 'Early door-to-door warnings by local volunteers', what_failed: 'Road barriers not deployed in time',
    affected_households: 42, status: 'closed', notes: 'IMD had issued orange alert 12 h prior.',
  },
  {
    id: 'inc-002', area: 'Ribandar', date: '2023-08-03', hazard_type: 'landslide',
    what_flooded: 'N/A — slope collapse near coastal road', damage_level: 'moderate',
    what_worked: 'Neighbouring village alerted quickly; no casualties',
    what_failed: 'Alternative route not pre-identified; traffic chaos for 4 h',
    affected_households: 8, status: 'closed', notes: 'Heavy rain 6 h before event.',
  },
  {
    id: 'inc-003', area: 'Bambolim', date: '2024-06-28', hazard_type: 'flood',
    what_flooded: 'Low-lying paddy fields and 2 ground-floor homes', damage_level: 'moderate',
    what_worked: 'Boats deployed from community resource pool', what_failed: 'No advance crop advisory issued',
    affected_households: 12, status: 'closed', notes: 'Fishermen provided boats voluntarily.',
  },
  {
    id: 'inc-004', area: 'Taleigao', date: '2025-03-12', hazard_type: 'fire',
    what_flooded: 'N/A — scrub fire, ~5 acres', damage_level: 'minor',
    what_worked: 'Forest dept arrived within 40 min', what_failed: 'Evacuation route unclear for hill-side residents',
    affected_households: 3, status: 'closed', notes: 'Dry March conditions; no prior alert issued.',
  },
  {
    id: 'inc-005', area: 'Panaji', date: '2023-10-01', hazard_type: 'flood',
    what_flooded: 'Near bridge: 2 streets, market stalls', damage_level: 'severe',
    what_worked: 'Authority response rapid; shelters opened in 2 h', what_failed: 'Alert reached only 60% of residents',
    affected_households: 78, status: 'closed', notes: 'Cyclone-induced surge.',
  },
];

export const MOCK_RESOURCES = [
  { id: 'res-001', type: 'boat', owner_id: 'v001', capacity: 8, lat: 15.4989, lng: 73.8278, available: true, area: 'Patto', contact_note: 'Call coord centre' },
  { id: 'res-002', type: 'boat', owner_id: 'v003', capacity: 6, lat: 15.5021, lng: 73.8431, available: false, area: 'Ribandar', contact_note: 'Deployed at Ribandar' },
  { id: 'res-003', type: 'vehicle', owner_id: 'v004', capacity: 5, lat: 15.4761, lng: 73.8513, available: true, area: 'Taleigao', contact_note: 'Car, 4WD' },
  { id: 'res-004', type: 'water_tank', owner_id: 'comm-01', capacity: 2000, lat: 15.4909, lng: 73.8278, available: true, area: 'Panaji', contact_note: '2 000 L potable water' },
  { id: 'res-005', type: 'spare_room', owner_id: 'hh-012', capacity: 4, lat: 15.4641, lng: 73.8622, available: true, area: 'Bambolim', contact_note: 'Ground floor, dry' },
  { id: 'res-006', type: 'first_aid', owner_id: 'v002', capacity: 1, lat: 15.4909, lng: 73.8278, available: true, area: 'Panaji', contact_note: 'Trained nurse; mobile kit' },
  { id: 'res-007', type: 'boat', owner_id: 'comm-02', capacity: 10, lat: 15.5010, lng: 73.8400, available: true, area: 'Ribandar', contact_note: 'Community boat, engine ok' },
  { id: 'res-008', type: 'vehicle', owner_id: 'v005', capacity: 3, lat: 15.4641, lng: 73.8622, available: false, area: 'Bambolim', contact_note: 'On route to Taleigao' },
];

export const MOCK_SHELTERS = [
  { id: 'sh-001', name: 'Patto Community Hall', area: 'Patto', lat: 15.4992, lng: 73.8290, capacity: 120, occupancy: 45, facilities: 'water,toilets,generator' },
  { id: 'sh-002', name: 'Panaji Primary School', area: 'Panaji', lat: 15.4915, lng: 73.8265, capacity: 200, occupancy: 12, facilities: 'water,toilets' },
  { id: 'sh-003', name: 'Ribandar Church Hall', area: 'Ribandar', lat: 15.5018, lng: 73.8440, capacity: 80, occupancy: 0, facilities: 'water' },
  { id: 'sh-004', name: 'Bambolim Health Centre', area: 'Bambolim', lat: 15.4645, lng: 73.8630, capacity: 60, occupancy: 20, facilities: 'medical,water,toilets' },
];

export const MOCK_HOUSEHOLDS = [
  { id: 'hh-001', area: 'Patto', lat: 15.4985, lng: 73.8275, household_type: 'low-lying home', language: 'kok', floor_level: 0, vulnerable_members: true },
  { id: 'hh-002', area: 'Panaji', lat: 15.4912, lng: 73.8270, household_type: 'shop', language: 'en', floor_level: 1, vulnerable_members: false },
  { id: 'hh-003', area: 'Bambolim', lat: 15.4638, lng: 73.8618, household_type: 'farmer', language: 'mr', floor_level: 0, vulnerable_members: true },
  { id: 'hh-004', area: 'Ribandar', lat: 15.5015, lng: 73.8428, household_type: 'fisherman', language: 'kok', floor_level: 0, vulnerable_members: false },
  { id: 'hh-005', area: 'Taleigao', lat: 15.4758, lng: 73.8510, household_type: 'tourist', language: 'en', floor_level: 2, vulnerable_members: false },
];

export const MOCK_ALERTS = [
  {
    id: 'alt-001',
    hazard_type: 'flood',
    area: 'Patto',
    risk_level: 'high',
    status: 'pending',
    generated_at: '2026-10-01T06:00:00Z',
    generated_by: 'Module 4 AI',
    translations: {
      en: 'HIGH FLOOD RISK in Patto ward. Water expected to rise by 09:00. Move vehicles to upper floors. Nearest shelter: Patto Community Hall (0.3 km).',
      kok: 'पट्टो वॉर्डांत उच्च पूर इशारो. सकाळी 9 वरां मेरेन उदक वाडटलें. वाहनां वयल्या मजल्याक हाडात. नजीकचो आश्रय: पट्टो कम्युनिटी हॉल.',
      mr: 'पट्टो वॉर्डात उच्च पूर धोका. वाहने वरच्या मजल्यावर हलवा. जवळचे निवारा: पट्टो कम्युनिटी हॉल.',
      hi: 'पट्टो वार्ड में उच्च बाढ़ जोखिम। सुबह 9 बजे तक पानी बढ़ने की संभावना। वाहनों को ऊपरी मंजिल पर ले जाएं।',
    },
    approved_by: null, approved_at: null, reject_reason: null,
  },
  {
    id: 'alt-002',
    hazard_type: 'landslide',
    area: 'Ribandar',
    risk_level: 'medium',
    status: 'pending',
    generated_at: '2026-10-01T05:30:00Z',
    generated_by: 'Module 4 AI',
    translations: {
      en: 'MEDIUM LANDSLIDE RISK in Ribandar. Avoid roads near the hill slopes. Alternate route via NH-66 available.',
      kok: 'रिबंदर भागांत मध्यम दर्शणी इशारो. डोंगर उतरण्याचे रस्ते टाळा. NH-66 वरवी पर्यायी रस्तो उपलब्ध आसा.',
      mr: 'रिबंदरमध्ये मध्यम दरड कोसळण्याचा धोका. डोंगर उतार रस्ते टाळा.',
      hi: 'रिबंदर में मध्यम भूस्खलन जोखिम। पहाड़ी ढलान वाले रास्तों से बचें।',
    },
    approved_by: null, approved_at: null, reject_reason: null,
  },
  {
    id: 'alt-003',
    hazard_type: 'flood',
    area: 'Bambolim',
    risk_level: 'low',
    status: 'approved',
    generated_at: '2026-09-30T18:00:00Z',
    generated_by: 'Module 4 AI',
    translations: {
      en: 'LOW FLOOD RISK in Bambolim. Monitor conditions. Farmers: secure crops and livestock if rain intensifies.',
      kok: 'बांबोळींत कमी पूर इशारो. शेतकार्यांनी वाढत्या पावसात पिकां व जनावरां सांबाळा.',
      mr: 'बांबोळी येथे कमी पूर धोका. शेतकऱ्यांनी पीक आणि जनावरे सुरक्षित करावी.',
      hi: 'बांबोलिम में कम बाढ़ जोखिम। किसान: बारिश बढ़ने पर फसल और पशुधन सुरक्षित करें।',
    },
    approved_by: 'Authority Sharma',
    approved_at: '2026-09-30T18:45:00Z',
    reject_reason: null,
  },
];

export const MOCK_RECOVERY_TASKS = [
  { id: 'rt-001', household_id: 'hh-001', area: 'Patto', category: 'rescue', severity: 'critical', description: 'Elderly resident stranded on ground floor. Needs boat evacuation.', status: 'open', matched_resource: 'res-001', created_at: '2026-10-01T07:00:00Z', logged_at: '2026-10-01T07:00:00Z', assigned_to: null },
  { id: 'rt-002', household_id: 'hh-003', area: 'Bambolim', category: 'food_water', severity: 'high', description: 'Family of 5 without potable water for 24 h.', status: 'assigned', matched_resource: 'res-004', created_at: '2026-10-01T06:30:00Z', logged_at: '2026-10-01T06:30:00Z', assigned_to: 'v005' },
  { id: 'rt-003', household_id: 'hh-002', area: 'Panaji', category: 'shelter', severity: 'medium', description: 'Shop owner ground floor flooded; needs temporary storage.', status: 'open', matched_resource: 'res-005', created_at: '2026-10-01T08:00:00Z', logged_at: '2026-10-01T08:00:00Z', assigned_to: null },
];
