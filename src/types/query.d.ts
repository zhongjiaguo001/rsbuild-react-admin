// 定义全局通用的查询类型
interface SearchQuery {
  page: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
}
