import { useState ,useContext, useEffect} from "react"
import { AccessContext } from "../../../../config/accessContext"
import axios from "axios"
import { OnRun } from '../../../../config/config'
import MiniLoader from "../../../../componet/Loader/miniLoader"
import NoData from "../../../../componet/Loader/NoData"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { exportPdf } from "../../../../config/exportPdf"
import { BsFiletypePdf , BsFiletypeCsv } from "react-icons/bs";

const Compare = () =>{
    const [df, setDf] = useState(null)
    const [dic, setDic] = useState(null)
    const access = useContext(AccessContext)


    const Ranking = (array,value)=>{
        const Rank = array.sort(function(a, b){return a - b}).reverse()
        const indx = Rank.indexOf(value)+1
        return indx
    }
    
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
                {title:"صندوق", field:"symbol", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
                {title:"%هفتگی", field:"ret_ytm_7", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",
                    formatter:function(cell, formatterParams){
                        var value = cell.getValue();
                        return("<div class='StocksTableChartContiner'><div class='StocksTableChartPos' style='width:"+((value/dic.ret_ytm_7)*60).toString()+'%'+"'><span>"+Ranking(df.map(i=>i['ret_ytm_7']),value)+"</span></div><p>"+ (value*1).toLocaleString()+"%</p></div>")
                    },
                },
                {title:"%دوهفته", field:"ret_ytm_14", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",
                    formatter:function(cell, formatterParams){
                        var value = cell.getValue();
                        return("<div class='StocksTableChartContiner'><div class='StocksTableChartPos' style='width:"+((value/dic.ret_ytm_14)*60).toString()+'%'+"'><span>"+Ranking(df.map(i=>i['ret_ytm_14']),value)+"</span></div><p>"+ (value*1).toLocaleString()+"%</p></div>")
                    },
                },
                {title:"%یکماهه", field:"ret_ytm_30", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",
                    formatter:function(cell, formatterParams){
                        var value = cell.getValue();
                        return("<div class='StocksTableChartContiner'><div class='StocksTableChartPos' style='width:"+((value/dic.ret_ytm_30)*60).toString()+'%'+"'><span>"+Ranking(df.map(i=>i['ret_ytm_30']),value)+"</span></div><p>"+ (value*1).toLocaleString()+"%</p></div>")

                    },
                },
                {title:"%سه ماهه", field:"ret_ytm_90", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",
                    formatter:function(cell, formatterParams){
                        var value = cell.getValue();
                        return("<div class='StocksTableChartContiner'><div class='StocksTableChartPos' style='width:"+((value/dic.ret_ytm_90)*60).toString()+'%'+"'><span>"+Ranking(df.map(i=>i['ret_ytm_90']),value)+"</span></div><p>"+ (value*1).toLocaleString()+"%</p></div>")

                    },
                },
                {title:"%شش ماهه", field:"ret_ytm_180", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",
                    formatter:function(cell, formatterParams){
                        var value = cell.getValue();
                        return("<div class='StocksTableChartContiner'><div class='StocksTableChartPos' style='width:"+((value/dic.ret_ytm_180)*60).toString()+'%'+"'><span>"+Ranking(df.map(i=>i['ret_ytm_180']),value)+"</span></div><p>"+ (value*1).toLocaleString()+"%</p></div>")

                    },
                },
                {title:"%یکساله", field:"ret_ytm_365", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",
                    formatter:function(cell, formatterParams){
                        var value = cell.getValue();
                        return("<div class='StocksTableChartContiner'><div class='StocksTableChartPos' style='width:"+((value/dic.ret_ytm_365)*60).toString()+'%'+"'><span>"+Ranking(df.map(i=>i['ret_ytm_365']),value)+"</span></div><p>"+ (value*1).toLocaleString()+"%</p></div>")

                    },
                },
                {title:"%دوساله", field:"ret_ytm_730", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input",
                    formatter:function(cell, formatterParams){
                        var value = cell.getValue();
                        return("<div class='StocksTableChartContiner'><div class='StocksTableChartPos' style='width:"+((value/dic.ret_ytm_730)*60).toString()+'%'+"'><span>"+Ranking(df.map(i=>i['ret_ytm_730']),value)+"</span></div><p>"+ (value*1).toLocaleString()+"%</p></div>")

                    },
                },
                {title:"بروزرسانی", field:"update", hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,headerFilter:"input"},
            ],
        })
    }



    const getDf = ()=>{
        axios({method:'POST',url:OnRun+'/getcompare',data:{access:access}
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
                <h2 className="titlePage">بازدهی مرکب</h2>
                <p onClick={exportPdf}><BsFiletypePdf/><span>خروجی PDF</span></p>
                <p onClick={()=>{table.download("csv", "data.csv")}}><BsFiletypeCsv/><span>خروجی CSV</span></p>
            </div>
            {df===null?<MiniLoader />:df===false?<NoData/>:null}
            <div id="data-table"></div>
        </div>
    )
}


export default Compare