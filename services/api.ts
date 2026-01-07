import { DashboardMetrics, WorkloadData, WorkloadDetailRecord } from '../types';

// API Configuration 
const API_BASE_URL = '/api'; 

/**
 * Tries to fetch from the real API first.
 * If it fails (network error, 404, 500), it returns the fallback demo data.
 */
async function fetchWithFallback<T>(endpoint: string, fallbackData: T, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
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
      // Throw error to trigger catch block and use fallback
      throw new Error(`API request failed with status ${response.status}: ${response.statusText || 'Unknown Error'}`);
    }

    return await response.json();
  } catch (error: any) {
    
    // Log warning to console (will appear in browser console / dev tools "Dismiss all" area)
    console.warn("Backend API connection failed. Using fallback DEMO data for display.", error.message || "Network Error");

    // Simulate network delay for realistic fallback experience
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fallbackData);
      }, 400); // 400ms simulated latency
    });
  }
}

// Demo Data 

// Chinese Dashboard Data
const DEMO_DATA_ZH: DashboardMetrics = {
  totalOrders: 32890,
  avgWorkload: 8.5,
  workloadRate: 92,
  workloadBreakdown: [
    { role: '设计岗', time: 2.5, unit: 'h/项' },
    { role: '生产岗', time: 4.0, unit: 'h/项' },
    { role: '质检岗', time: 1.2, unit: 'h/项' },
    { role: '物流岗', time: 0.8, unit: 'h/项' },
  ],
  productDistribution: [
    { name: '脊柱侧弯矫正器', value: 30, progress: 30, statusLabel: '设计修正', isLagging: true },
    { name: '术前骨骼模型', value: 70, progress: 70, statusLabel: '生产中', isLagging: false },
    { name: '膝关节固定器', value: 45, progress: 45, statusLabel: '待排产', isLagging: false },
    { name: '颈椎康复枕', value: 90, progress: 90, statusLabel: '质检中', isLagging: false },
    { name: '3D打印鞋垫', value: 15, progress: 15, statusLabel: '数据处理', isLagging: true },
    { name: '髋关节植入物', value: 60, progress: 60, statusLabel: '后处理', isLagging: false },
  ],
  statusDistribution: [
    { 
      name: '已完成', 
      value: 15, 
      count: 6,
      color: '#10b981', 
      avgTime: '48h',
      projectList: ['全周期交付-李**', '全周期交付-王**']
    },
    { 
      name: '生产中', 
      value: 25, 
      count: 10,
      color: '#fbbf24', 
      avgTime: '5.0h',
      projectList: ['术前模型A01', '膝关节支架P2']
    },
    { 
      name: '设计中', 
      value: 35, 
      count: 14,
      color: '#ef4444', 
      avgTime: '2.5h',
      projectList: ['脊柱矫正案03', '颈椎枕模型B', '鞋垫定制C1'] 
    },
    { 
      name: '邮寄中', 
      value: 25, 
      count: 10,
      color: '#6366f1', 
      avgTime: '24h',
      projectList: ['订单#9921', '订单#9922']
    },
  ],
  mapLocations: [
    { id: 1, x: 30, y: 40, lng: 121.336, lat: 31.197, label: '上海虹桥国际机场', type: 'transport', status: 'normal' },
    { id: 2, x: 55, y: 35, lng: 121.526, lat: 31.297, label: '杨浦区', type: 'clinic', status: 'busy' },
    { id: 3, x: 45, y: 55, lng: 121.436, lat: 31.170, label: '徐汇区', type: 'clinic', status: 'normal' },
    { id: 4, x: 65, y: 60, lng: 121.600, lat: 31.150, label: '浦东新区', type: 'clinic', status: 'normal' },
    { id: 5, x: 25, y: 25, lng: 121.250, lat: 31.350, label: '嘉定区', type: 'clinic', status: 'offline' },
    { id: 6, x: 75, y: 20, lng: 121.700, lat: 31.350, label: '五洲大道', type: 'transport', status: 'normal' },
  ],
  hospitals: [
    { 
      id: 1, 
      name: '上海交通大学九院',
      description: '上海交通大学医学院附属第九人民医院的前身“伯特利医院”创建于1920年。九院是一所学科特色鲜明、具备深厚临床基础和科研实力的三级甲等综合性医院。在口腔医学、整复外科、骨科等领域享有国际声誉。作为数字化医疗的先行者，九院与上交启源平台深度合作，开展个性化3D打印植入物及康复辅具的临床应用。'
    },
    { 
      id: 2, 
      name: '上海交通大学瑞金医院',
      description: '上海交通大学医学院附属瑞金医院建于1907年，原名广慈医院。瑞金医院是上海市乃至全国领先的综合性医院之一，拥有多个国家级重点学科。在智能制造领域，瑞金医院积极探索术前规划模型与手术导板的临床转化，大幅提高了复杂手术的成功率与效率。'
    },
    { 
      id: 3, 
      name: '上海交通大学九院浦东',
      description: '作为九院的分院区，浦东院区延续了总院在口腔、骨科等优势学科的实力，并重点布局了高端康复医疗服务。该中心配备了先进的数字化扫描与制造设备，是区域内重要的个性化医疗器械临床示范基地。'
    },
    { 
      id: 4, 
      name: '日照市国际健康管理中心',
      description: '日照市国际健康管理中心是一家集健康体检、健康管理、康复理疗为一体的现代化健康服务机构。引入上交启源云平台后，中心实现了远程定制化矫形支具的快速交付，服务范围辐射周边城市。'
    },
    { 
      id: 5, 
      name: '深圳平乐中心',
      description: '深圳平乐骨伤科医院（深圳市坪山区中医院）是一所集医疗、教学、科研、康复、保健为一体的三级甲等中医骨伤专科医院。中心结合传统中医骨伤手法与现代3D打印技术，为患者提供更为精准的康复辅具解决方案。'
    },
    { 
      id: 6, 
      name: '通用云健康科技(四川)有限公司',
      description: '通用云健康专注于医疗健康大数据的挖掘与应用。作为平台的西南地区重要合作伙伴，主要负责医疗3D打印数据的云端处理与区域化生产调度，推动了智能制造技术在西南地区的普及。'
    },
    { 
      id: 7, 
      name: '青州益都中心医院3D打印中心',
      description: '该中心依托青州益都中心医院雄厚的骨科临床资源，建立了完备的医疗3D打印实验室。能够独立开展从CT数据重建到模型打印的全流程服务，尤其在复杂骨折的手术规划模型制作方面积累了丰富经验。'
    },
    { 
      id: 8, 
      name: '上海交通大学医学院附属新华医院',
      description: '新华医院是上海市一所学科门类齐全、特色鲜明的三级甲等综合性医院。儿科是其传统优势学科。在小儿骨科矫形领域，新华医院利用云平台定制了大量儿童脊柱侧弯矫正器及足踝矫形器，取得了显著的临床效果。'
    },
    { 
      id: 9, 
      name: '上海市光华中西医结合医院',
      description: '上海市光华中西医结合医院以关节病的中西医结合诊治为特色。医院利用3D打印技术辅助人工关节置换手术，并开发了个性化的术后康复护具，有效缩短了患者的康复周期。'
    },
  ],
  patients: [
    { id: '1', name: '王**', project: '生物医学工程', status: 'Completed', hospital: '医疗器械研究所' },
    { id: '2', name: '赵**', project: '生物医学工程', status: 'Sampling', hospital: '医疗器械研究所' },
    { id: '3', name: '李**', project: '骨科修复', status: 'Processing', hospital: '瑞金医院' },
    { id: '4', name: '张**', project: '脊柱矫正', status: 'Completed', hospital: '九院' },
    { id: '5', name: '刘**', project: '术前模型', status: 'Processing', hospital: '新华医院' },
    { id: '6', name: '陈**', project: '康复辅具', status: 'Sampling', hospital: '瑞金医院' },
  ]
};

// English Dashboard Data
const DEMO_DATA_EN: DashboardMetrics = {
  totalOrders: 32890,
  avgWorkload: 8.5,
  workloadRate: 92,
  workloadBreakdown: [
    { role: 'Design', time: 2.5, unit: 'h/item' },
    { role: 'Prod', time: 4.0, unit: 'h/item' },
    { role: 'QC', time: 1.2, unit: 'h/item' },
    { role: 'Logistics', time: 0.8, unit: 'h/item' },
  ],
  productDistribution: [
    { name: 'Scoliosis Orthosis', value: 30, progress: 30, statusLabel: 'Design Rev', isLagging: true },
    { name: 'Pre-op Bone Model', value: 70, progress: 70, statusLabel: 'In Prod', isLagging: false },
    { name: 'Knee Fixator', value: 45, progress: 45, statusLabel: 'Pending', isLagging: false },
    { name: 'Cervical Pillow', value: 90, progress: 90, statusLabel: 'In QC', isLagging: false },
    { name: '3D Printed Insole', value: 15, progress: 15, statusLabel: 'Data Proc', isLagging: true },
    { name: 'Hip Implant', value: 60, progress: 60, statusLabel: 'Post Proc', isLagging: false },
  ],
  statusDistribution: [
    { 
      name: 'Completed', 
      value: 15, 
      count: 6,
      color: '#10b981', 
      avgTime: '48h',
      projectList: ['Full Cycle-Li**', 'Full Cycle-Wang**']
    },
    { 
      name: 'In Production', 
      value: 25, 
      count: 10,
      color: '#fbbf24', 
      avgTime: '5.0h',
      projectList: ['Pre-op Model A01', 'Knee Brace P2']
    },
    { 
      name: 'Designing', 
      value: 35, 
      count: 14,
      color: '#ef4444', 
      avgTime: '2.5h',
      projectList: ['Scoliosis Case 03', 'Pillow Model B', 'Insole Custom C1'] 
    },
    { 
      name: 'Mailing', 
      value: 25, 
      count: 10,
      color: '#6366f1', 
      avgTime: '24h',
      projectList: ['Order #9921', 'Order #9922']
    },
  ],
  mapLocations: [
    { id: 1, x: 30, y: 40, lng: 121.336, lat: 31.197, label: 'Shanghai Hongqiao Airport', type: 'transport', status: 'normal' },
    { id: 2, x: 55, y: 35, lng: 121.526, lat: 31.297, label: 'Yangpu District', type: 'clinic', status: 'busy' },
    { id: 3, x: 45, y: 55, lng: 121.436, lat: 31.170, label: 'Xuhui District', type: 'clinic', status: 'normal' },
    { id: 4, x: 65, y: 60, lng: 121.600, lat: 31.150, label: 'Pudong New Area', type: 'clinic', status: 'normal' },
    { id: 5, x: 25, y: 25, lng: 121.250, lat: 31.350, label: 'Jiading District', type: 'clinic', status: 'offline' },
    { id: 6, x: 75, y: 20, lng: 121.700, lat: 31.350, label: 'Wuzhou Avenue', type: 'transport', status: 'normal' },
  ],
  hospitals: [
    { 
      id: 1, 
      name: 'SJTU Ninth People\'s Hospital',
      description: 'The Ninth People\'s Hospital affiliated to Shanghai Jiao Tong University School of Medicine. It is a grade A tertiary comprehensive hospital with distinct discipline characteristics. It enjoys international reputation in stomatology, plastic surgery, orthopedics and other fields. As a pioneer of digital medical treatment, it cooperates deeply with SJTU Qiyuan platform.'
    },
    { 
      id: 2, 
      name: 'SJTU Ruijin Hospital',
      description: 'Ruijin Hospital affiliated to Shanghai Jiao Tong University School of Medicine was founded in 1907. Ruijin Hospital is one of the leading comprehensive hospitals in Shanghai and China. In the field of intelligent manufacturing, Ruijin Hospital actively explores the clinical transformation of preoperative planning models and surgical guides.'
    },
    { 
      id: 3, 
      name: 'SJTU Ninth People\'s Hospital (Pudong)',
      description: 'As a branch of the Ninth People\'s Hospital, Pudong Campus continues the strength of the general hospital in stomatology, orthopedics and other advantageous disciplines, and focuses on high-end rehabilitation medical services.'
    },
    { 
      id: 4, 
      name: 'Rizhao International Health Center',
      description: 'Rizhao International Health Management Center is a modern health service institution integrating physical examination, health management and rehabilitation physiotherapy. After introducing the cloud platform, it realized rapid delivery of remote customized orthoses.'
    },
    { 
      id: 5, 
      name: 'Shenzhen Pingle Center',
      description: 'Shenzhen Pingle Orthopedics Hospital is a grade A tertiary TCM orthopedics hospital integrating medical treatment, teaching, scientific research, rehabilitation and health care. The center combines traditional TCM orthopedic manipulation with modern 3D printing technology.'
    },
    { 
      id: 6, 
      name: 'General Cloud Health Tech (Sichuan)',
      description: 'Focuses on the mining and application of medical and health big data. As an important partner in Southwest China, it is mainly responsible for cloud processing of medical 3D printing data and regional production scheduling.'
    },
    { 
      id: 7, 
      name: 'Qingzhou Yidu Central Hospital 3D Center',
      description: 'Relying on the strong orthopedic clinical resources of Qingzhou Yidu Central Hospital, this center has established a complete medical 3D printing laboratory.'
    },
    { 
      id: 8, 
      name: 'SJTU Xinhua Hospital',
      description: 'Xinhua Hospital is a grade A tertiary comprehensive hospital in Shanghai. Pediatrics is its traditional advantageous discipline. In the field of pediatric orthopedics, Xinhua Hospital has customized a large number of children\'s scoliosis orthoses and ankle foot orthoses using the cloud platform.'
    },
    { 
      id: 9, 
      name: 'Shanghai Guanghua Hospital',
      description: 'Shanghai Guanghua Hospital of Integrated Traditional Chinese and Western Medicine features the diagnosis and treatment of arthropathy. The hospital uses 3D printing technology to assist artificial joint replacement surgery.'
    },
  ],
  patients: [
    { id: '1', name: 'Wang**', project: 'Biomedical Eng', status: 'Completed', hospital: 'Med Device Inst' },
    { id: '2', name: 'Zhao**', project: 'Biomedical Eng', status: 'Sampling', hospital: 'Med Device Inst' },
    { id: '3', name: 'Li**', project: 'Orthopedic Repair', status: 'Processing', hospital: 'Ruijin Hospital' },
    { id: '4', name: 'Zhang**', project: 'Spine Correction', status: 'Completed', hospital: 'Ninth Hospital' },
    { id: '5', name: 'Liu**', project: 'Pre-op Model', status: 'Processing', hospital: 'Xinhua Hospital' },
    { id: '6', name: 'Chen**', project: 'Rehab Aid', status: 'Sampling', hospital: 'Ruijin Hospital' },
  ]
};

// --- Mock Database for Workload ---

const WORKLOAD_DB: Record<string, Record<'zh'|'en', WorkloadData>> = {
  week: {
    zh: {
      rate: 92,
      breakdown: [
        { role: '设计岗', time: 2.5, unit: 'h/项' },
        { role: '生产岗', time: 4.0, unit: 'h/项' },
        { role: '质检岗', time: 1.2, unit: 'h/项' },
        { role: '物流岗', time: 0.8, unit: 'h/项' },
      ]
    },
    en: {
      rate: 92,
      breakdown: [
        { role: 'Design', time: 2.5, unit: 'h/item' },
        { role: 'Prod', time: 4.0, unit: 'h/item' },
        { role: 'QC', time: 1.2, unit: 'h/item' },
        { role: 'Logistics', time: 0.8, unit: 'h/item' },
      ]
    }
  },
  month: {
    zh: {
      rate: 78,
      breakdown: [
        { role: '设计岗', time: 12.0, unit: 'h/项' },
        { role: '生产岗', time: 28.5, unit: 'h/项' },
        { role: '质检岗', time: 5.5, unit: 'h/项' },
        { role: '物流岗', time: 3.2, unit: 'h/项' },
      ]
    },
    en: {
      rate: 78,
      breakdown: [
        { role: 'Design', time: 12.0, unit: 'h/item' },
        { role: 'Prod', time: 28.5, unit: 'h/item' },
        { role: 'QC', time: 5.5, unit: 'h/item' },
        { role: 'Logistics', time: 3.2, unit: 'h/item' },
      ]
    }
  },
  cycle: {
    zh: {
      rate: 45,
      breakdown: [
        { role: '设计岗', time: 45.0, unit: 'h/项' },
        { role: '生产岗', time: 110.0, unit: 'h/项' },
        { role: '质检岗', time: 22.0, unit: 'h/项' },
        { role: '物流岗', time: 15.0, unit: 'h/项' },
      ]
    },
    en: {
      rate: 45,
      breakdown: [
        { role: 'Design', time: 45.0, unit: 'h/item' },
        { role: 'Prod', time: 110.0, unit: 'h/item' },
        { role: 'QC', time: 22.0, unit: 'h/item' },
        { role: 'Logistics', time: 15.0, unit: 'h/item' },
      ]
    }
  }
};

const WORKLOAD_DETAILS_DB: Record<'zh'|'en', WorkloadDetailRecord[]> = {
  zh: [
    { id: '1001', employeeName: '张伟', role: '设计岗', projectName: '脊柱侧弯矫正器-A02', taskType: '3D建模', hoursSpent: 3.5, date: '2023-10-23', status: '已完成' },
    { id: '1002', employeeName: '李娜', role: '生产岗', projectName: '膝关节固定器-K99', taskType: '打印监控', hoursSpent: 5.0, date: '2023-10-23', status: '进行中' },
    { id: '1003', employeeName: '王强', role: '质检岗', projectName: '颈椎康复枕-C11', taskType: '应力测试', hoursSpent: 1.2, date: '2023-10-24', status: '已完成' },
    { id: '1004', employeeName: '刘洋', role: '物流岗', projectName: '订单#9921', taskType: '打包发货', hoursSpent: 0.8, date: '2023-10-24', status: '已完成' },
    { id: '1005', employeeName: '陈敏', role: '设计岗', projectName: '髋关节植入物-H05', taskType: '拓扑优化', hoursSpent: 4.0, date: '2023-10-22', status: '进行中' },
    { id: '1006', employeeName: '赵雷', role: '生产岗', projectName: '术前骨骼模型-B22', taskType: '后处理', hoursSpent: 2.5, date: '2023-10-22', status: '已完成' },
    { id: '1007', employeeName: '周杰', role: '质检岗', projectName: '脊柱侧弯矫正器-A02', taskType: '尺寸测量', hoursSpent: 0.5, date: '2023-10-24', status: '已完成' },
    { id: '1008', employeeName: '孙丽', role: '设计岗', projectName: '3D打印鞋垫-F08', taskType: '点云处理', hoursSpent: 1.5, date: '2023-10-23', status: '已完成' },
  ],
  en: [
    { id: '1001', employeeName: 'Zhang Wei', role: 'Design', projectName: 'Spine Orthosis-A02', taskType: '3D Modeling', hoursSpent: 3.5, date: '2023-10-23', status: 'Done' },
    { id: '1002', employeeName: 'Li Na', role: 'Production', projectName: 'Knee Fixator-K99', taskType: 'Print Mon', hoursSpent: 5.0, date: '2023-10-23', status: 'In Progress' },
    { id: '1003', employeeName: 'Wang Qiang', role: 'QC', projectName: 'Cervical Pillow-C11', taskType: 'Stress Test', hoursSpent: 1.2, date: '2023-10-24', status: 'Done' },
    { id: '1004', employeeName: 'Liu Yang', role: 'Logistics', projectName: 'Order #9921', taskType: 'Packing', hoursSpent: 0.8, date: '2023-10-24', status: 'Done' },
    { id: '1005', employeeName: 'Chen Min', role: 'Design', projectName: 'Hip Implant-H05', taskType: 'Topology Opt', hoursSpent: 4.0, date: '2023-10-22', status: 'In Progress' },
    { id: '1006', employeeName: 'Zhao Lei', role: 'Production', projectName: 'Bone Model-B22', taskType: 'Post-Proc', hoursSpent: 2.5, date: '2023-10-22', status: 'Done' },
    { id: '1007', employeeName: 'Zhou Jie', role: 'QC', projectName: 'Spine Orthosis-A02', taskType: 'Measure', hoursSpent: 0.5, date: '2023-10-24', status: 'Done' },
    { id: '1008', employeeName: 'Sun Li', role: 'Design', projectName: '3D Insole-F08', taskType: 'Point Cloud', hoursSpent: 1.5, date: '2023-10-23', status: 'Done' },
  ]
};

// API Implementation

export const fetchDashboardData = async (lang: 'zh' | 'en' = 'zh'): Promise<DashboardMetrics> => {
  const fallback = lang === 'en' ? DEMO_DATA_EN : DEMO_DATA_ZH;
  return fetchWithFallback('/dashboard/overview', fallback, { lang });
};

export const fetchWorkloadData = async (period: 'week' | 'month' | 'cycle', lang: 'zh' | 'en'): Promise<WorkloadData> => {
  const fallback = WORKLOAD_DB[period][lang];
  return fetchWithFallback(`/workload/stats`, fallback, { period, lang });
};

export const fetchWorkloadDetails = async (lang: 'zh' | 'en'): Promise<WorkloadDetailRecord[]> => {
  const fallback = WORKLOAD_DETAILS_DB[lang];
  return fetchWithFallback('/workload/details', fallback, { lang });
};