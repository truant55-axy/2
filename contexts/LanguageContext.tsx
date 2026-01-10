import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'zh' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    'app.title': '上海交通大学',
    'app.subtitle': '医疗器械智能制造云平台',
    'loading': '系统加载中...',
    'search.title': '数据查询',
    'search.subtitle': 'Data Search',
    'search.placeholder': '如：2025年 脊柱侧弯矫正器 产量...',
    'search.button': '搜索',
    'search.hotwords': '热词',
    'card.basicData': '基本数据',
    'card.platformData': '云平台数据汇总',
    'card.workload': '人员工作量统计',
    'card.map': '全国门诊中心分布',
    'card.totalOrders': '累计订单数',
    'card.basicInfo': '基本信息',
    'card.patientList': '患者列表',
    'unit.orders': '单',
    'unit.hours': 'h',
    'unit.perItem': '/项',
    'label.detail': '查看工时明细',
    'label.intro': '简介',
    'label.close': '关闭',
    'label.no_desc': '暂无该医院的详细介绍信息。',
    'patient.search': '搜索患者姓名或项目...',
    'map.mock': '模拟视图 (缺少 AMap Key)',
    'map.normal': '运行正常',
    'map.busy': '繁忙',
    'map.offline': '离线',
    'filter.week': '周',
    'filter.month': '月',
    'filter.cycle': '周期',
    'totalLoad': '总负荷',
    'status.completed': '已完成',
    'status.production': '生产中',
    'status.design': '设计中',
    'status.mailing': '邮寄中',
    'status.sampling': '采样中',
    'status.processing': '处理中',
    'lang.switch': 'English'
  },
  en: {
    'app.title': 'Shanghai Jiao Tong University',
    'app.subtitle': 'Medical Device Smart Cloud',
    'loading': 'System Loading...',
    'search.title': 'Data Query',
    'search.subtitle': 'Data Search',
    'search.placeholder': 'E.g., 2025 Scoliosis Orthosis Production...',
    'search.button': 'Search',
    'search.hotwords': 'Hot',
    'card.basicData': 'Basic Data',
    'card.platformData': 'Platform Data Summary',
    'card.workload': 'Workload Statistics',
    'card.map': 'National Clinic Distribution',
    'card.totalOrders': 'Total Orders',
    'card.basicInfo': 'Basic Info',
    'card.patientList': 'Patient List',
    'unit.orders': 'Orders',
    'unit.hours': 'h',
    'unit.perItem': '/item',
    'label.detail': 'View Details',
    'label.intro': 'Introduction',
    'label.close': 'Close',
    'label.no_desc': 'No details available.',
    'patient.search': 'Search patient or project...',
    'map.mock': 'Mock View (Missing Key)',
    'map.normal': 'Normal',
    'map.busy': 'Busy',
    'map.offline': 'Offline',
    'filter.week': 'Week',
    'filter.month': 'Month',
    'filter.cycle': 'Cycle',
    'totalLoad': 'Total Load',
    'status.completed': 'Completed',
    'status.production': 'Production',
    'status.design': 'Design',
    'status.mailing': 'Mailing',
    'status.sampling': 'Sampling',
    'status.processing': 'Processing',
    'lang.switch': '中文'
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};