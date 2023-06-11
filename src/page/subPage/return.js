import { useState ,useContext, useEffect} from "react"
import { AccessContext } from "../../config/accessContext"
import axios from "axios"
import { OnRun } from '../../config/config'
import MiniLoader from "../../componet/Loader/miniLoader"
import NoData from "../../componet/Loader/NoData"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { exportPdf } from "../../config/exportPdf"
import { BsFiletypePdf , BsFiletypeCsv } from "react-icons/bs";

const Return = () =>{
    const [df, setDf] = useState(null)
    const [dic, setDic] = useState(null)
    const [input, setInput] = useState({target:22})
    const access = useContext(AccessContext)


    if(df!=null && dic!=null){
        var table = new Tabulator("#data-table", {
            data:df,
            layout:"fitColumns",
            responsiveLayout:true,
            columnHeaderSortMulti:true,
            pagination:"local",
            paginationSize:50,
            paginationSizeSelector:[10, 20, 50, 100, 200,500],
            movableColumns:true,
            layoutColumnsOnNewData:false,
            textDirection:"rtl",
            autoResize:false,
            dataTree:true,
            dataTreeStartExpanded:false,
            columns:[
                {title:"دوره(روز)", field:"period", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"بازده", field:"ptp", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",
                    formatter:function(cell, formatterParams){
                        var value = cell.getValue();
                        return("<p>"+ (value*1).toLocaleString()+"%</p>")
                    },
                },
                {title:"سالانه شده", field:"yearly", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",
                    formatter:function(cell, formatterParams){
                        var value = cell.getValue();
                        return("<div class='StocksTableChartContiner'><div class='StocksTableChartPos' style='width:"+((value/dic.yearly)*60).toString()+'%'+"'> </div><p>"+ (value*1).toLocaleString()+"%</p></div>")                            
                    },
                },
                {title:"اختلاف با هدف", field:"diff", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",
                    formatter:function(cell, formatterParams){
                        var value = cell.getValue();

                        if (value>0) {
                            return("<div class='StocksTableChartContiner'><div class='StocksTableChartPos' style='width:"+((value/dic.diff)*60).toString()+'%'+"'> </div><p>"+ (value*1).toLocaleString()+"%</p></div>")                            
                        }else{
                            return("<div class='StocksTableChartContiner'><div class='StocksTableChartNeg' style='width:"+((Math.abs(value)/dic.diff)*60).toString()+'%'+"'> </div><p>"+ (value*1).toLocaleString()+"%</p></div>")
                        }
                    },
                },
            ],
        })
    }



    const getDf = ()=>{
        axios({method:'POST',url:OnRun+'/getreturn',data:{access:access,input:input}
        }).then(response=>{
            if(response.data.replay){
                setDf(response.data.df)
                setDic(response.data.dic)
            }else{
                setDf(false)
            }
        })
}

useEffect(getDf,[])


    return(
        <div className="subPage tablePg">
            <div className="tls">
                <h2 className="titlePage">بازدهی</h2>
                <p onClick={exportPdf}><BsFiletypePdf/><span>خروجی PDF</span></p>
                <p onClick={()=>{table.download("csv", "data.csv")}}><BsFiletypeCsv/><span>خروجی CSV</span></p>
                <label>
                    <p>%</p>
                    <input max={100} min={0} value={input.target} onChange={(e)=>setInput({...input,target:e.target.value})} type="number" placeholder="نرخ هدف"></input>
                    <p>هدف</p>
                </label>
            </div>
            {df===null?<MiniLoader />:df===false?<NoData/>:null}
            <div id="data-table"></div>
        </div>
    )
}


export default Return