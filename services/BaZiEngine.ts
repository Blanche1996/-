
import { GANZHI, DAY_MASTER_BASE, ORACLE_DB } from '../constants';
import { BaZiResult, BuddhaType } from '../types';

export class BaZiEngine {
  static getDayPillar(birthdate: string, category: BuddhaType): BaZiResult {
    const inputDate = new Date(birthdate);
    inputDate.setHours(0, 0, 0, 0);
    
    const epochDate = new Date('1900-01-31');
    epochDate.setHours(0, 0, 0, 0);

    const diffMs = inputDate.getTime() - epochDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    let offset = diffDays % 60;
    if (offset < 0) offset += 60;

    const dayPillar = GANZHI[offset];
    const dayMaster = dayPillar.charAt(0);
    
    // 获取基础描述
    const type = DAY_MASTER_BASE[dayMaster] || "未知命主";
    
    // 获取分类箴言库
    const categoryOracles = ORACLE_DB[dayMaster]?.[category] || ["凡所有相\n皆是虚妄"];
    
    // 随机选取一条
    const oracleIndex = Math.floor(Math.random() * categoryOracles.length);
    const oracle = categoryOracles[oracleIndex];

    const advice = "宜：主敬存诚"; // 固定页脚或可扩展

    return {
      dayPillar,
      dayMaster,
      type,
      oracle,
      advice
    };
  }
}
