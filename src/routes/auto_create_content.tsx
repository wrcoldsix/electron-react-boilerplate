import { useState } from "react"
import './auto_create_content.scss'
import ExportExcel from "../utils/createExcel";

const AutoCreatContent = ()=>{
  const radioList = [
    {label:'生成方式1',value:'0'},
    {label:'生成方式2',value:'1'},
  ]
  const [radioVal,setradioVal] = useState('')
  const [promptStr,setPromptStr] = useState('你是地理专家，请用【】为标题，写一篇1500字的文章。')
  const [title,setTitle] = useState('%$跟%$哪个更有发展潜力？这篇文章告诉你答案！')
  const [displayMaterial,setDisplayMaterial] = useState(false)
  const [materialList,setMaterialList] = useState('苏州，上海，山东;嘉定，潍坊')  // ;分隔

  // 处理完整提示词change事件,使用 %$;' 约定字符分隔
  const handlePromptChange = (e:any)=>{
    const val = e.target.value||""
    setPromptStr(val)
  }

  // 处理完整提示词change事件,使用 %$ 约定字符分隔
  const handleTitleChange = (e:any)=>{
    const val = e.target.value||""
    setTitle(val)
  }

  // 处理素材提供点击事件
  const handleMaterialClick = ()=>{
    setDisplayMaterial(true)
  }

  // 处理素材内容change事件
  const handleMaterialChange = (e:any)=>{
    const val = e.target.value ||""
    setMaterialList(val)
  }

  // 递归整理

  // 排列组合
  const combine = (data:string[])=>{
    const finallyData:Array<string[]> = []
    const firstDataArr = data[0].replaceAll('，',',').split(',')
    firstDataArr.forEach(item=>{
      let strArr:any[] = []
      data.forEach((cont,ind)=>{
        if (ind>0){
          let index = 0
          const materialStr = cont.replaceAll('，',',')
          const materialStrArr = materialStr.split(',')
          for(let i = index;i<materialStrArr.length;i++){
            strArr = []
            index=i
            if (strArr.length===data.length) {
              break;
            }
            strArr.push(item)
            strArr.push(materialStrArr[index])
            finallyData.push(strArr)
          }
        }
      })
    })

    return finallyData
  }

  // 生成
  const generate = ()=>{
    const allTitleArr = title.split('%$')
    let allMaterialList:string[] = []
    // 如果有4个变量的，这种特殊处理，后两个跟前两个是一致的
    if (materialList.split(';').length+1!==allTitleArr.length){
      allTitleArr.forEach(item=>{
        allMaterialList.push(materialList+';')
      })
    }else{
      allMaterialList = materialList.split(';')
    }

    const materialCombineData = combine(allMaterialList)
    const finallyTitleArr = materialCombineData.map(item=>{
      let titleStr = title
      item.forEach(cont=>{
        titleStr = titleStr.replace('%$',cont)
      })

      return titleStr
    })

    const finallyPromptArr = finallyTitleArr.map(item=>{
      let prompt = promptStr
      return   prompt.replace('【】',item)
    })

    ExportExcel([[...finallyPromptArr]])
  }

  return (
    <div className="main">
      <div className="main-box">
        <div className="cont-box">
          <div className="cont-title">完整提示词:</div>&nbsp;&nbsp;
          <textarea
            cols={50}
            rows={10}
            value={promptStr}
            onChange={handlePromptChange}
          ></textarea>
        </div>
      </div>
      <div className="main-box">
        {
          radioList.map(item=>{
            return (
              <span key={item.value}>
                <label>{item.label}</label>
                <input type="radio" name="test" id=""  value={item.value}/>
              </span>
            )
          })
        }
      </div>
      <div className="main-box">
        <div className="cont-box">
          <div className="cont-title">标题输入:</div>&nbsp;&nbsp;
          <textarea
            cols={30}
            rows={10}
            value={title}
            onChange={handleTitleChange}
          ></textarea>
        </div>
      </div>
        <button onClick={handleMaterialClick}>素材提供</button>
        {
          displayMaterial && (
            <>
              <div className="cont-box">
                <div className="cont-title">素材内容:</div>&nbsp;&nbsp;
                <textarea
                  cols={30}
                  rows={10}
                  value={materialList}
                  onChange={handleMaterialChange}
                ></textarea>
              </div>
              {/* 暂时使用按钮，生成内容，最后提供导出 */}
              <button onClick={generate}>最终生成文件</button>
            </>
          )
        }
    </div>
  )
}

export default AutoCreatContent
