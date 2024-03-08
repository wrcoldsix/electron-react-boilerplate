import { useEffect, useRef, useState } from 'react';
import './auto_create_content.scss';
import { exportExcel, readExcel } from '@/utils/createExcel';

const AutoCreatContent = () => {
  const tabRef = useRef(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const singleFileRef = useRef<HTMLInputElement | null>(null);
  const exportLoading = useRef(false);
  const fileIsNull = useRef({
    method1: true,
    method2: true,
  });
  const radioList = [
    { label: '生成方式1:标题+变量', value: '0' },
    { label: '生成方式2:标题即变量', value: '1' },
  ];

  const [radioVal, setradioVal] = useState('0');
  const [finallTableData, setFinallTableData] = useState<string[]>([]);
  const [promptStr, setPromptStr] = useState(
    '你是地理专家，请用【】为标题，写一篇1500字的文章。',
  );
  const [title, setTitle] = useState(
    '网上说&%比&%更发展潜力，&%跟&%都生活过后，才发现两者的差距很大！',
  );
  const [materialList, setMaterialList] = useState('');
  const [singleMaterialList, setSingleMaterialList] = useState('');

  useEffect(() => {
    if (finallTableData.length) {
      exportLoading.current = false
      const exportTabledata = finallTableData.map((item) => [item]);

      exportExcel(exportTabledata);
    }
  }, [finallTableData]);

  // 处理完整提示词change事件,使用 &%;' 约定字符分隔
  const handlePromptChange = (e: any) => {
    const val = e.target.value || '';
    setPromptStr(val);
  };

  // 处理完整提示词change事件,使用 &% 约定字符分隔
  const handleTitleChange = (e: any) => {
    const val = e.target.value || '';
    setTitle(val);
  };

  // 处理素材提供点击事件
  const handleMaterialClick = () => {
    if (radioVal === '0') {
      fileRef.current && fileRef.current.click();
    } else {
      singleFileRef.current && singleFileRef.current.click();
    }
  };

  // 处理生成方式1文件上传
  const handleFileChange = async (events: any) => {
    const fileVal: File = events.target.files[0];
    let materialStr = '';
    const titleArr = title.split('&%');
    const paramsTitleArr = titleArr
      .slice(0, titleArr.length - 1)
      .map((item, index) => '参数' + (index + 1));
    fileIsNull.current.method1 = false;

    readExcel(fileVal).then((res) => {
      const paramsNum = Object.keys(res[0]).length;

      paramsTitleArr.forEach((cont, index) => {
        let material: string[] = [];
        res.forEach((item) => {
          item[cont] && material.push(item[cont]);
        });

        if (index !== paramsTitleArr.length - 1) {
          if (paramsNum === paramsTitleArr.length) {
            materialStr += material.join(',') + ';';
          } else if (index + 1 <= paramsTitleArr.length / 2) {
            materialStr += material.join(',') + ';';
          }
        } else {
          materialStr += material.join(',');
        }
      });

      if (materialStr.endsWith(',')) {
        materialStr = materialStr.slice(0, -1);
      }
      if (materialStr.endsWith(';')) {
        materialStr = materialStr.slice(0, -1);
      }

      setMaterialList(materialStr);
    });
  };

  // 处理生成方式2文件上传
  const handleSingleFileChange = async (events: any) => {
    const fileVal: File = events.target.files[0];
    fileIsNull.current.method2 = false;

    readExcel(fileVal).then((res) => {
      const materialList: string[] = res.map((item) => item['参数']);

      setSingleMaterialList(materialList.join(','));
    });
  };

  // 排列组合
  const combine = (data: string[]) => {
    const finallyData: Array<string[]> = data.map((item) => item.split(','));
    // 对每个数组进行去重
    const uniqueArrays = finallyData.map((array) => [...new Set(array)]);
    // 优化后的笛卡尔积计算
    let result = uniqueArrays[0].map((item) => [item]);
    for (let i = 1; i < uniqueArrays.length; i++) {
      result = result.flatMap((comb) =>
        uniqueArrays[i].map((item) => {
          // 如果当前元素与组合中的最后一个元素相同，则返回空数组
          if (item === comb[comb.length - 1]) return [];
          return comb.concat(item);
        }),
      );
    }
    // 过滤掉空数组（由于跳过了重复元素）
    return result.filter((comb) => comb.length > 0);
  };

  // 生成
  const generate = () => {
    exportLoading.current = true
    if (radioVal === '0') {
      if (!title || !promptStr) return alert('提示词或标题不可为空');
      if (!promptStr.includes('【】'))
        return alert('提示词格式不对，标题的位置请使用【】');
      if (!title.includes('&%'))
        return alert('标题格式不对，变量的位置请使用&%');
      if (fileIsNull.current.method1) return alert('方式1素材未上传');

      let allMaterialList: string[] = materialList.split(';');
      const materialCombineData = combine(allMaterialList);
      const titleLength = title.split('&%').length - 1;

      const finallyTitleArr = materialCombineData.map((item) => {
        let titleStr = title;
        item.forEach((cont) => {
          titleStr = titleStr.replace('&%', cont);
        });

        if (titleLength === 2 * materialCombineData[0].length) {
          item.forEach((cont) => {
            titleStr = titleStr.replace('&%', cont);
          });
        }

        return titleStr;
      });

      const finallyPromptArr = finallyTitleArr.map((item) => {
        let prompt = promptStr;

        return prompt.replace('【】', item);
      });

      setFinallTableData(finallyPromptArr);
    } else {
      if (!promptStr) return alert('提示词不可为空');
      if (!promptStr.includes('【】'))
        return alert('提示词格式不对，标题的位置请使用【】');
      if (fileIsNull.current.method2) return alert('方式2素材未上传');

      const finallyPromptArr = singleMaterialList.split(',').map((item) => {
        let prompt = promptStr;
        return prompt.replace('【】', item);
      });

      setFinallTableData(finallyPromptArr);
    }
  };

  // 重置所有信息
  const resetAllMes = () => {
    setTitle('');
    setPromptStr('');
    setMaterialList('');
    setFinallTableData([]);
    fileIsNull.current = {
      method1: true,
      method2: true,
    };
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  return (
    <div className="main">
      <div className="main-box">
        <div className="cont-box">
          <div className="cont-title">完整提示词:</div>&nbsp;&nbsp;
          <textarea
            cols={50}
            rows={10}
            value={promptStr}
            placeholder="标题的位置请使用【】标记"
            onChange={handlePromptChange}
          ></textarea>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={resetAllMes}>重置所有信息</button>
        </div>
      </div>
      <div className="main-box">
        {radioList.map((item) => {
          return (
            <span key={item.value}>
              <label>
                <input
                  type="radio"
                  value={item.value}
                  checked={radioVal === item.value}
                  onChange={() => setradioVal(item.value)}
                />
                {item.label}
              </label>
              &nbsp;&nbsp;
            </span>
          );
        })}
      </div>
      {radioVal === '0' && (
        <>
          <div className="main-box">
            <div className="cont-box">
              <div className="cont-title">标题输入:</div>&nbsp;&nbsp;
              <textarea
                cols={50}
                rows={10}
                value={title}
                onChange={handleTitleChange}
                placeholder="变量的位置请使用&%标记"
              ></textarea>
            </div>
          </div>
          <br />
          <div>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              className="fileUpload"
              onChange={handleFileChange}
            />
            <button onClick={handleMaterialClick}>上传素材</button>
          </div>
        </>
      )}
      {radioVal === '1' && (
        <>
          <br />
          <div>
            <input
              ref={singleFileRef}
              type="file"
              accept=".xlsx,.xls"
              className="fileUpload"
              onChange={handleSingleFileChange}
            />
            <button onClick={handleMaterialClick}>上传素材</button>
          </div>
        </>
      )}
      <br />
      {/* 暂时使用按钮，生成内容，最后提供导出 */}
      <button onClick={generate}>导出最终文件</button>
      {exportLoading.current ? '导出中' : '未导出'}
      <br />
      <br />

      {/* 预生成表格，使用表格的格式内容生成excel */}
      {/* <table ref={tabRef} style={{ display: 'none' }}>
        <tbody>
          {finallTableData.map((item) => {
            return (
              <tr key={item}>
                <td>{item}</td>
              </tr>
            );
          })}
        </tbody>
      </table> */}
    </div>
  );
};

export default AutoCreatContent;
