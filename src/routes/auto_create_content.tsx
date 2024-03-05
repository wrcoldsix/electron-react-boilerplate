import { useEffect, useRef, useState } from 'react';
import './auto_create_content.scss';
import { exportExcel, readExcel } from '../utils/createExcel';

const AutoCreatContent = () => {
  const tabRef = useRef(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const fileIsNull = useRef(true);
  const radioList = [
    { label: '生成方式1', value: '0' },
    { label: '生成方式2', value: '1' },
  ];

  const [radioVal, setradioVal] = useState('');
  const [finallTableData, setFinallTableData] = useState<string[]>([]);
  const [promptStr, setPromptStr] = useState(
    '你是地理专家，请用【】为标题，写一篇1500字的文章。',
  );
  const [title, setTitle] = useState(
    '&%跟&%哪个更有发展潜力？这篇文章告诉你答案！',
  );
  const [materialList, setMaterialList] = useState('');

  useEffect(() => {
    if (finallTableData.length) {
      exportExcel(tabRef, [[...finallTableData]]);
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
    fileRef.current && fileRef.current.click();
  };

  // 处理文件上传
  const handleFileChange = async (events) => {
    const fileVal: File = events.target.files[0];
    let materialStr = '';
    const titleArr = title.split('&%');
    const paramsTitleArr = titleArr
      .slice(0, titleArr.length - 1)
      .map((item, index) => '参数' + (index + 1));
    fileIsNull.current = false;

    readExcel(fileVal).then((res) => {
      paramsTitleArr.forEach((cont, index) => {
        let material: string[] = [];
        res.forEach((item) => {
          material.push(item[cont]);
        });

        if (index !== paramsTitleArr.length - 1) {
          materialStr += material.join(',') + ';';
        } else {
          materialStr += material.join(',');
        }
      });

      setMaterialList(materialStr);
    });
  };


  // 排列组合
  const combine = (data: string[]) => {
    const finallyData: Array<string[]> = [];
    const firstDataArr = data[0].split(',');
    
    firstDataArr.forEach((item) => {
      let strArr: any[] = [];
      data.forEach((cont, ind) => {
        if (ind > 0) {
          let index = 0;
          const materialStrArr = cont.split(',');

          for (let i = index; i < materialStrArr.length; i++) {
            if (item === materialStrArr[i]){
              continue;
            }
            // 不可重复
            strArr = [];
            index = i;
            if (strArr.length === data.length) {
              break;
            }
            
            strArr.push(item);
            strArr.push(materialStrArr[index]);
            finallyData.push(strArr);
          }
        }
      });
    });

    return finallyData;
  };

  // 生成
  const generate = () => {
    if (!title || !promptStr) return alert('提示词或标题不可为空');
    if (!promptStr.includes('【】')) return alert('提示词格式不对，标题的位置请使用【】');
    if (!title.includes('&%')) return alert('标题格式不对，变量的位置请使用&%');
    if (fileIsNull.current) return alert('素材未上传');

    const allTitleArr = title.split('&%');
    let allMaterialList: string[] = [];
    // 如果有4个变量的，这种特殊处理，后两个跟前两个是一致的,尚未完成

    if (materialList.split(';').length + 1 !== allTitleArr.length) {
      allTitleArr.forEach((item) => {
        allMaterialList.push(materialList + ';');
      });
    } else {
      allMaterialList = materialList.split(';');
    }

    const materialCombineData = combine(allMaterialList);
    const finallyTitleArr = materialCombineData.map((item) => {
      let titleStr = title;
      item.forEach((cont) => {
        titleStr = titleStr.replace('&%', cont);
      });

      return titleStr;
    });

    const finallyPromptArr = finallyTitleArr.map((item) => {
      let prompt = promptStr;
      return prompt.replace('【】', item);
    });

    setFinallTableData(finallyPromptArr);
  };

  // 重置所有信息
  const resetAllMes = () => {
    setTitle('');
    setPromptStr('');
    setMaterialList('');
    setFinallTableData([]);
    fileIsNull.current = true
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
              <label>{item.label}</label>
              <input type="radio" name="test" id="" value={item.value} />
            </span>
          );
        })}
      </div>
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

      <br />
      {/* 暂时使用按钮，生成内容，最后提供导出 */}
      <button onClick={generate}>导出最终文件</button>
      <br />
      <br />

      {/* 预生成表格，使用表格的格式内容生成excel */}
      <table ref={tabRef} style={{ display: 'none' }}>
        <tbody>
          {finallTableData.map((item) => {
            return (
              <tr key={item}>
                <td>{item}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AutoCreatContent;
