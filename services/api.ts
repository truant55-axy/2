import { DashboardMetrics, WorkloadData, WorkloadDetailRecord, SearchResults, Hospital, ChartData, Patient, MapLocation } from '../types';

// API Configuration 
const API_BASE_URL = '/api'; 

/**
 * Tries to fetch from the real API first.
 * If it fails (network error, 404, 500), it returns the fallback demo data.
 */
async function fetchWithFallback<T>(endpoint: string, fallbackData: T, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  if (params) {
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.warn(`API ${endpoint} failed. Using fallback data.`, error.message || "Network Error");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fallbackData);
      }, 300); 
    });
  }
}

// --- CONSTANT DATA SOURCE ---

const HOSPITALS_LIST: Hospital[] = [
    { id: 1, name: '上海交通大学九院', location: '上海·黄浦', description: '口腔/骨科/整复外科特色' },
    { id: 2, name: '上海交通大学瑞金医院', location: '上海·黄浦', description: '综合性三甲医院' },
    { id: 3, name: '上海交通大学九院浦东', location: '上海·浦东', description: '高端康复医疗服务' },
    { id: 4, name: '日照市国际健康管理中心', location: '山东·日照', description: '健康体检与康复' },
    { id: 5, name: '深圳平乐中心', location: '广东·深圳', description: '中医骨伤专科' },
    { id: 6, name: '通用云健康科技(四川)', location: '四川·成都', description: '西南数据中心' },
    { id: 7, name: '青州益都中心医院', location: '山东·潍坊', description: '骨科3D打印实验' },
    { id: 8, name: '上海新华医院', location: '上海·杨浦', description: '儿科/骨科矫形' },
    { id: 9, name: '上海光华中西医结合医院', location: '上海·长宁', description: '关节病专科' },
];

const BASE_PATIENTS: Patient[] = [
    { id: '1', name: '王**', project: '生物医学工程', status: 'Completed', hospital: '上海交通大学九院' },
    { id: '2', name: '赵**', project: '生物医学工程', status: 'Sampling', hospital: '上海交通大学瑞金医院' },
    { id: '3', name: '李**', project: '骨科修复', status: 'Processing', hospital: '上海交通大学九院浦东' },
    { id: '4', name: '张**', project: '脊柱矫正', status: 'Completed', hospital: '上海新华医院' },
    { id: '5', name: '刘**', project: '术前模型', status: 'Processing', hospital: '深圳平乐中心' },
    { id: '6', name: '陈**', project: '康复辅具', status: 'Sampling', hospital: '日照市国际健康管理中心' },
    { id: '7', name: '周**', project: '3D导板', status: 'Production', hospital: '上海交通大学九院' },
    { id: '8', name: '吴**', project: '关节置换', status: 'Design', hospital: '上海光华中西医结合医院' },
];

const BASE_LOCATIONS: MapLocation[] = [
    { id: 1, x: 30, y: 40, lng: 121.336, lat: 31.197, label: '上海虹桥枢纽', type: 'transport', status: 'normal' },
    { id: 2, x: 55, y: 35, lng: 121.49, lat: 31.23, label: '上海交通大学九院', type: 'clinic', status: 'busy' },
    { id: 3, x: 45, y: 55, lng: 121.46, lat: 31.20, label: '瑞金医院', type: 'clinic', status: 'normal' },
    { id: 4, x: 65, y: 60, lng: 121.600, lat: 31.150, label: '九院浦东分院', type: 'clinic', status: 'normal' },
    { id: 5, x: 25, y: 25, lng: 104.06, lat: 30.67, label: '通用云健康(四川)', type: 'clinic', status: 'offline' },
    { id: 6, x: 75, y: 20, lng: 121.53, lat: 31.26, label: '新华医院', type: 'clinic', status: 'normal' },
];

// --- HELPER FUNCTIONS TO SIMULATE DB FILTERING ---

function generateMockPatients(hospitalId: number, count: number, lang: 'zh' | 'en'): Patient[] {
    const hospital = HOSPITALS_LIST.find(h => h.id === hospitalId);
    const hospitalName = hospital?.name || 'Unknown';
    const statuses: Patient['status'][] = ['Completed', 'Sampling', 'Processing', 'Production', 'Design'];
    const projectsZh = ['脊柱侧弯矫正器', '术前骨骼模型', '膝关节固定器', '颈椎康复枕', '3D打印鞋垫', '髋关节植入物', '手术导板', '康复外骨骼', '颌面修复体', '颅骨修补网'];
    const projectsEn = ['Scoliosis Orthosis', 'Bone Model', 'Knee Fixator', 'Cervical Pillow', '3D Insole', 'Hip Implant', 'Surgical Guide', 'Exoskeleton', 'Maxillofacial', 'Cranial Mesh'];
    const familyNames = ['张', '王', '李', '赵', '陈', '刘', '周', '吴', '郑', '孙', '杨', '徐', '朱', '秦', '尤', '许', '何'];

    const results: Patient[] = [];
    for(let i=0; i<count; i++) {
        const pIndex = Math.floor(Math.random() * (lang === 'en' ? projectsEn.length : projectsZh.length));
        const sIndex = Math.floor(Math.random() * statuses.length);
        const name = lang === 'en' ? `Patient ${String.fromCharCode(65+i)}${i}` : `${familyNames[Math.floor(Math.random() * familyNames.length)]}**`;
        
        results.push({
            id: `H${hospitalId}-${1000+i}`,
            name: name,
            project: lang === 'en' ? projectsEn[pIndex] : projectsZh[pIndex],
            status: statuses[sIndex],
            hospital: hospitalName
        });
    }
    return results;
}

function getWorkloadRate(hospitalId: number | null): number {
    if (!hospitalId) return 92;
    // Deterministic random based on ID
    const base = 60;
    const variation = (hospitalId * 17) % 35; 
    return base + variation; // 60 - 95
}

function getFilteredData(lang: 'zh' | 'en', hospitalId: number | null): DashboardMetrics {
    const isEn = lang === 'en';
    
    // 1. Patients Logic: Global vs Specific
    let patients: Patient[] = [];
    if (hospitalId) {
        // Generate more detailed mock data for specific hospital
        // Increased count to 30 as requested
        patients = generateMockPatients(hospitalId, 30, lang);
    } else {
        // Global view: use base list + some randoms
        patients = [...BASE_PATIENTS];
    }

    // 2. Total Orders (ALWAYS GLOBAL)
    // The user requested: "Total orders always display the overall data"
    const totalOrders = 32890;

    // 3. Adjust Map Locations (Simulate DB Geo Query)
    let mapLocations = [...BASE_LOCATIONS];
    if (hospitalId) {
        const target = mapLocations.find(l => l.label.includes(HOSPITALS_LIST.find(h => h.id === hospitalId)?.name.substring(0, 2) || 'X'));
        if (target) {
            mapLocations = [target];
        } else {
            mapLocations = [{ id: 99, x: 50, y: 50, lng: 0, lat: 0, label: HOSPITALS_LIST.find(h => h.id === hospitalId)?.name || 'Hospital', type: 'clinic', status: 'normal' }];
        }
    }

    // 4. Product Distribution
    const productNames = isEn 
        ? ['Scoliosis Orthosis', 'Pre-op Bone Model', 'Knee Fixator', 'Cervical Pillow', '3D Printed Insole', 'Hip Implant']
        : ['脊柱侧弯矫正器', '术前骨骼模型', '膝关节固定器', '颈椎康复枕', '3D打印鞋垫', '髋关节植入物'];
    
    const seed = hospitalId || 1;
    const productDistribution: ChartData[] = productNames.map((name, idx) => ({
        name,
        value: Math.floor(Math.random() * 50) + 20 + seed,
        progress: Math.floor(Math.random() * 40) + 50,
        statusLabel: isEn ? (idx % 2 === 0 ? 'Production' : 'QC') : (idx % 2 === 0 ? '生产中' : '质检中'),
        isLagging: idx === 0 || idx === 4 
    }));

    // 5. Workload
    const workloadRate = getWorkloadRate(hospitalId);
    
    // Vary breakdown slightly based on hospital
    const designTime = 2.5 + (hospitalId ? (hospitalId % 3) * 0.5 : 0);
    const prodTime = 4.0 + (hospitalId ? (hospitalId % 2) : 0);
    
    const workloadBreakdown = isEn 
        ? [{ role: 'Design', time: designTime, unit: 'h' }, { role: 'Prod', time: prodTime, unit: 'h' }, { role: 'QC', time: 1.2, unit: 'h' }, { role: 'Logistics', time: 0.8, unit: 'h' }]
        : [{ role: '设计岗', time: designTime, unit: 'h/项' }, { role: '生产岗', time: prodTime, unit: 'h/项' }, { role: '质检岗', time: 1.2, unit: 'h/项' }, { role: '物流岗', time: 0.8, unit: 'h/项' }];

    return {
        totalOrders,
        avgWorkload: 8.5,
        workloadRate,
        workloadBreakdown,
        productDistribution,
        statusDistribution: [
            { name: isEn ? 'Completed' : '已完成', value: 15, count: 6, color: '#10b981' },
            { name: isEn ? 'In Production' : '生产中', value: 25, count: 10, color: '#fbbf24' },
            { name: isEn ? 'Designing' : '设计中', value: 35, count: 14, color: '#ef4444' },
            { name: isEn ? 'Mailing' : '邮寄中', value: 25, count: 10, color: '#6366f1' },
        ],
        mapLocations,
        hospitals: HOSPITALS_LIST, 
        patients
    };
}


// --- EXPORTED FUNCTIONS ---

export const fetchHospitalList = async (lang: 'zh' | 'en'): Promise<Hospital[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(HOSPITALS_LIST), 100);
    });
};

export const fetchDashboardData = async (lang: 'zh' | 'en' = 'zh', hospitalId: number | null = null): Promise<DashboardMetrics> => {
  const fallback = getFilteredData(lang, hospitalId);
  const params: Record<string, string> = { lang };
  if (hospitalId) params.hospitalId = hospitalId.toString();

  return fetchWithFallback('/dashboard/overview', fallback, params);
};

export const fetchWorkloadData = async (period: 'week' | 'month' | 'cycle', lang: 'zh' | 'en', hospitalId: number | null): Promise<WorkloadData> => {
  // Base rates modified by period
  let rate = getWorkloadRate(hospitalId);
  
  // Adjust rate based on period to simulate realistic data changes
  if (period === 'month') rate = Math.max(10, rate - 15);
  if (period === 'cycle') rate = Math.max(5, rate - 30);

  const breakdownBase = [
      { role: lang==='en'?'Design':'设计', time: 2.5, unit: 'h' },
      { role: lang==='en'?'Prod':'生产', time: 4.0, unit: 'h' },
      { role: lang==='en'?'QC':'质检', time: 1.2, unit: 'h' },
      { role: lang==='en'?'Logistics':'物流', time: 0.8, unit: 'h' }
  ];

  // Scale times based on period
  const multiplier = period === 'week' ? 1 : (period === 'month' ? 4 : 12);
  const breakdown = breakdownBase.map(b => ({
      ...b,
      time: parseFloat((b.time * multiplier).toFixed(1))
  }));

  return fetchWithFallback(`/workload/stats`, {
      rate,
      breakdown
  }, { period, lang, hospitalId: hospitalId ? hospitalId.toString() : '' });
};

export const fetchWorkloadDetails = async (lang: 'zh' | 'en'): Promise<WorkloadDetailRecord[]> => {
  return fetchWithFallback('/workload/details', [], { lang });
};

export const searchGlobalData = async (query: string, lang: 'zh' | 'en'): Promise<SearchResults> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { products: [], hospitals: [], patients: [], locations: [] }; 
};