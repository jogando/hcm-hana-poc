$.response.contentType = "application/json";
var conn = $.db.getConnection();
var runtime_start = new Date();

function buildTimeRanges(datePairs){
    var result = [];

    var arr = [];
    /*for(var i =0;i<datePairs.length;i++){
        if(arr.indexOf(datePairs[i][0])==-1){
            arr.push(datePairs[i][0]);
        }

        if(arr.indexOf(datePairs[i][1])==-1){
            arr.push(datePairs[i][1]);
        }
    }*/

    for(var i =0;i<datePairs.length;i++){
        //el .getTime() hay que usarlo por que los Dates son objetos,
        //entonces por mas que tengan el mismo valor, son distintos
        var found = false;
        //date_from
        for(var j = 0;j<arr.length;j++){
            if(arr[j].getTime() == datePairs[i][0].getTime()){
                found = true;
                break;
            }
        }

        if(!found){
            arr.push(datePairs[i][0]);
        }

        //date_to
        found = false;
        for(var j = 0;j<arr.length;j++){
            if(arr[j].getTime() == datePairs[i][1].getTime()){
                found = true;
                break;
            }
        }

        if(!found){
            arr.push(datePairs[i][1]);
        }
    }


    arr.sort(function(a,b){
        return Date.parse(a) - Date.parse(b);
    });

    for(var i=0;i<arr.length;i=i+2){
        result.push([arr[i], arr[i+1]]);
    }

    return result;
}

//runtime statistics
var fetch_runtime = 0;
var fetch_runtime_count = 0;
var merge_runtime = 0;
var merge_runtime_count = 0;

function fetchPerns(){
    var pstmt = conn.prepareStatement( "select distinct \"PERNR\" from \"HCM_POC\".\"PA0001\"");
    var rs = pstmt.executeQuery();

    var result = [];
    while (rs.next()) {
        result.push(rs.getInteger(1));
    }
    rs.close();
    pstmt.close();

    return result;
}

function fetchInfoType_0008(pernr){
    var pstmt = conn.prepareStatement( "select * from \"HCM_POC\".\"PA0008\" where \"PERNR\" ="+ pernr );
    var rs = pstmt.executeQuery();

    var result = [];
    while (rs.next()) {
        var item = {};
        item.pernr = rs.getInteger(1);
        item.date_from = rs.getDate(3);
        item.date_to = rs.getDate(4);
        item.annual_salary = rs.getDouble(5);
        item.currency = rs.getString(6);
        
        result.push(item);
    }
    rs.close();
    pstmt.close();

    return result;
}

function fetchInfoType_0001(pernr){
    var pstmt = conn.prepareStatement( "select * from \"HCM_POC\".\"PA0001\" where \"PERNR\" ="+ pernr );
    var rs = pstmt.executeQuery();

    var result = [];
    while (rs.next()) {
        var item = {};
        item.pernr = rs.getInteger(1);
        item.date_from = rs.getDate(3);
        item.date_to = rs.getDate(4);
        item.company_code = rs.getString(5);
        item.personnel_area = rs.getString(6);
        item.personnel_subarea = rs.getString(7);
        item.position = rs.getInteger(8);
        item.job = rs.getInteger(9);
        item.orgunit = rs.getInteger(10);
        
        result.push(item);
    }
    rs.close();
    pstmt.close();

    return result;
}

function fetchInfoType_0016(pernr){
    var pstmt = conn.prepareStatement( "select * from \"HCM_POC\".\"PA0016\" where \"PERNR\" ="+ pernr );
    var rs = pstmt.executeQuery();

    var result = [];
    while (rs.next()) {
        var item = {};
        item.pernr = rs.getInteger(1);
        item.date_from = rs.getDate(3);
        item.date_to = rs.getDate(4);

        
        item.contract_type = rs.getString(5);
        item.contract_number = rs.getString(6);
        item.contract_startdate = rs.getDate(7);
        item.contract_enddate = rs.getDate(8);
        item.contract_status = rs.getString(9);
        
        result.push(item);
    }
    rs.close();
    pstmt.close();

    return result;
}

function fetchInfoType_0167(pernr){
    var pstmt = conn.prepareStatement( "select * from \"HCM_POC\".\"PA0167\" where \"PERNR\" ="+ pernr );
    var rs = pstmt.executeQuery();

    var result = [];
    while (rs.next()) {
        var item = {};
        item.pernr = rs.getInteger(1);
        item.date_from = rs.getDate(3);
        item.date_to = rs.getDate(4);

        item.plan_type = rs.getString(5);
        item.benefit_plan = rs.getString(6);
        item.healthplan_option = rs.getString(7);
        item.dependent_coverage = rs.getString(8);
        
        result.push(item);
    }
    rs.close();
    pstmt.close();

    return result;
}

var result = {};
result.merged = [];
//get all the employees
var pernrs = fetchPerns();

for(var pernrIndex = 0;pernrIndex<pernrs.length;pernrIndex++){
    //fetch from database

    var fetch_runtime_start = new Date();
    var pa0001s = fetchInfoType_0001(pernrs[pernrIndex]);
    var pa0008s = fetchInfoType_0008(pernrs[pernrIndex]);
    var pa0016s = fetchInfoType_0016(pernrs[pernrIndex]);
    var pa0167s = fetchInfoType_0167(pernrs[pernrIndex]);
    var fetch_runtime_end = new Date();
    fetch_runtime = fetch_runtime + (fetch_runtime_end - fetch_runtime_start);
    fetch_runtime_count++;

    //build time ranges
    var time_ranges = [];
    for(var i =0;i<pa0001s.length;i++){
        time_ranges.push([pa0001s[i].date_from,pa0001s[i].date_to]);
    }

    for(var i =0;i<pa0008s.length;i++){
        time_ranges.push([pa0008s[i].date_from,pa0008s[i].date_to]);
    }

    for(var i =0;i<pa0016s.length;i++){
        time_ranges.push([pa0016s[i].date_from,pa0016s[i].date_to]);
    }

    for(var i =0;i<pa0167s.length;i++){
        time_ranges.push([pa0167s[i].date_from,pa0167s[i].date_to]);
    }

    var complete_timeranges = buildTimeRanges(time_ranges);

    var merge_runtime_start = new Date();
    for(var i=0;i<complete_timeranges.length;i++){
        var item = {};
        item.pernr = pernrs[pernrIndex];
        item.date_from = complete_timeranges[i][0];
        item.date_to = complete_timeranges[i][1];

        for(var j=0;j<pa0001s.length;j++){
            if(pa0001s[j].date_from<=item.date_from && pa0001s[j].date_to>=item.date_to){
                item.company_code = pa0001s[j].company_code;
                item.personnel_area = pa0001s[j].personnel_area;
                item.personnel_subarea = pa0001s[j].personnel_subarea;
                item.position = pa0001s[j].position;
                item.job = pa0001s[j].job;
                item.orgunit = pa0001s[j].orgunit;
                break;
            }
        }

        for(var j=0;j<pa0008s.length;j++){
            if(pa0008s[j].date_from<=item.date_from && pa0008s[j].date_to>=item.date_to){
                item.annual_salary = pa0008s[j].annual_salary;
                item.currency = pa0008s[j].currency;
                break;
            }
        }

        for(var j=0;j<pa0016s.length;j++){
            if(pa0016s[j].date_from<=item.date_from && pa0016s[j].date_to>=item.date_to){
                item.contract_status = pa0016s[j].contract_status;
                item.contract_type = pa0016s[j].contract_type;
                item.contract_number = pa0016s[j].contract_number;
                item.contract_startdate = pa0016s[j].contract_startdate;
                item.contract_enddate = pa0016s[j].contract_enddate;
                break;
            }
        }

        for(var j=0;j<pa0167s.length;j++){
            if(pa0167s[j].date_from<=item.date_from && pa0167s[j].date_to>=item.date_to){
                item.plan_type = pa0167s[j].plan_type;
                item.benefit_plan = pa0167s[j].benefit_plan;
                item.healthplan_option = pa0167s[j].healthplan_option;
                item.dependent_coverage = pa0167s[j].dependent_coverage;
                break;
            }
        }

        //result.merged.push(item);
    }
    var merge_runtime_end = new Date();
    merge_runtime = merge_runtime + (merge_runtime_end - merge_runtime_start);
    merge_runtime_count++;

}

conn.close();

var runtime_end = new Date();
result.statistics = {
    merge:{},
    fetch:{}
};

result.statistics.total_runtime = runtime_end - runtime_start;

result.statistics.fetch.total_runtime = fetch_runtime;
result.statistics.fetch.avg_runtime = fetch_runtime/fetch_runtime_count;

result.statistics.merge.total_runtime = merge_runtime;
result.statistics.merge.avg_runtime = merge_runtime/merge_runtime_count;
$.response.setBody(JSON.stringify(result));
