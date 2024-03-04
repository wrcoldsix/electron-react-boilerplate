import { useState } from "react"
import './auto_create_content.scss'

const AutoCreatContent = ()=>{
  const [promptStr,setPromptStr] = useState('')
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

  // 生成
  const generate = ()=>{
    const allTitleArr = title.split('%$')
    let allMaterialList:string[] = []
    if (materialList.split(';').length+1!==allTitleArr.length){
      allTitleArr.forEach(item=>{
        allMaterialList.push(materialList+';')
      })
    }else{
      allMaterialList = materialList.split(';')
    }

    let titleStr = ''
    const finallyTitleArr = title.split('%$').map(item=>{
      titleStr += item
      allMaterialList.forEach((cont,index)=>{
        const materialStr = cont.replaceAll('，',',')
        const materialStrArr = materialStr.split(',')
        for(let i=index;i<materialStrArr.length;i++){
          titleStr += materialStrArr[i]
        console.log('titleStr1',titleStr);
          break;
        }
      })

      return titleStr
    })
  }

  return (
    <div className="main-box">
      <div className="cont-box">
        <div className="cont-title">完整提示词:</div>&nbsp;&nbsp;
        <textarea
          cols={30}
          rows={10}
          value={promptStr}
          onChange={handlePromptChange}
        ></textarea>
      </div>
      <div className="cont-box">
        <div className="cont-title">标题输入:</div>&nbsp;&nbsp;
        <textarea
          cols={30}
          rows={10}
          value={title}
          onChange={handleTitleChange}
        ></textarea>
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
          <button onClick={generate}>最终生成</button>
          </>
        )
      }
    </div>
  )
}

export default AutoCreatContent
