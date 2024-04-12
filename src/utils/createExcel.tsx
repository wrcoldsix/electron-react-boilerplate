import * as XLSX from 'xlsx';
import { ColumnsType } from 'antd/es/table/interface';

/**
 * @data 表格数据 data = [{}] 默认为[[]] 数据结构 二维数组
 * @ExcelTitle 表格标题 默认 [ '模板Excel' ]
 * @ExcelHeader 表头信息 默认 []
 * @sheetName sheet（表）名称 默认 ‘学生信息’
 * @ExcelName 文件名称 默认 ‘学生信息模板’
 */
export const exportExcel = (
  tabRef: React.MutableRefObject<null>,
  data: any[] = [[]],
  ExcelTitle = [],
  ExcelHeader = [],
  sheetName = '所有提示词',
  ExcelName = '所有提示词',
) => {
  // (1)将数据源转成我们需要的二维数组
  const body = data;

  // (2)定义表头
  const header = [ExcelTitle, ExcelHeader];

  // (3)将定义好的表头添加到 body 中
  body.unshift(...header);

  // (4)创建虚拟的 workbook
  const workbook = XLSX.utils.book_new();

  // (5)将二维数组转成 sheet
  const sheet = XLSX.utils.aoa_to_sheet(body);

  // (6)设置单元格合并 { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, 即为一个规则，s:开始位置, e:结束位置, r:行, c:列
  // 可根据实际情况调整，此处偷懒，没有想很复杂表格
  const merges = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: ExcelHeader.length - 1 } },
  ];

  // (7)将merges添加到sheet中，设置合并单元格
  sheet['!merges'] = merges;

  // (8)设置行列宽高并添加到sheet中
  const cols = [
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
  ];
  const rows = [{ hpx: 50 }];
  sheet['!cols'] = cols;
  sheet['!rows'] = rows;

  // (9)向workbook中添加 sheet
  const wb = XLSX.utils.table_to_book(tabRef.current);
  //   XLSX.utils.book_append_sheet(wb, sheet, sheetName);
  // (10)导出Excel
  XLSX.writeFile(wb, ExcelName + '.xlsx');
};

// 导出对象数组
export const exportExcelJson = ({
  data,
  columns,
  sheetName = '工资计算',
  excelName = '工资计算',
}: {
  data: any[];
  columns: ColumnsType<any>;
  sheetName?: string;
  excelName?: string;
}) => {
  const header: any = {};
  columns.forEach((item) => {
    header[(item as any).dataIndex] = item.title;
  });

  const finalData = [header, ...data];
  console.log('finalData', finalData);

  const worksheet = XLSX.utils.json_to_sheet(finalData, {
    header: Object.keys(header),
    skipHeader: true,
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 生成Excel文件并下载
  XLSX.writeFile(workbook, excelName + '.xlsx');
};

// 读取excel文件内容
export const readExcel = async (file: File): Promise<any[]> => {
  const data = await file.arrayBuffer();
  /* parse and load first worksheet */
  const wb = XLSX.read(data);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const tableData: any[] = XLSX.utils.sheet_to_json(ws);

  return tableData;
};
