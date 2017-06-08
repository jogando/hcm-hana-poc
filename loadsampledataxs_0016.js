var conn = $.db.getConnection();
var st = conn.prepareStatement("insert into \"HCM_POC\".\"PA0016\" values(?,?,?,?,?,?,?,?,?)");

var startEmployeeNum = 1000;
var endEmployeeNum = 2000;

var contract_statuses = ["ACT", "INA"];
var contract_types = ["TT", "DT", "PC"];

var cnt = 1;
for(var i=startEmployeeNum;i<=endEmployeeNum;i++){
    var startDate = new Date("2016-01-01T00:00:00.000Z");

    var dateRanges = [];

    var dateSplits = Math.floor(Math.random() * 10) + 1;

    for(var j=0;j<dateSplits;j++){
        var item = [];

        //start date
        if(j==0){
            item.push(startDate);//first item is the start Date
        }else{
            var previousEndDate = dateRanges[j-1][1];
            var newDate = new Date();
            newDate.setTime(previousEndDate.getTime() + 1 * 86400000);//previous end date + 1 day
            item.push(newDate);
        }

        //end date
        var rndDays= Math.floor(Math.random() * 120) + 1;
        var endDate = new Date();
        endDate.setTime(item[0].getTime() + rndDays* 86400000);//start date + rnddays day

        item.push(endDate);

        dateRanges.push(item);
    }

    for(var j=0;j<dateRanges.length;j++){
        var rndDays= null;
        var employee = {};
        employee.pernr = startEmployeeNum + i;
        employee.start_date = dateRanges[j][0];
        employee.end_date = dateRanges[j][1];
        employee.contract_status = contract_statuses[Math.floor(Math.random() * contract_statuses.length) + 0];
        employee.contract_type = contract_types[Math.floor(Math.random() * contract_types.length) + 0];
        employee.contract_number = (Math.floor(Math.random() * 10) + 1)+"";

        employee.contract_startdate = new Date();
        rndDays= Math.floor(Math.random() * 10) + 1;
        employee.contract_startdate.setTime(employee.start_date.getTime() + rndDays* 86400000);

        employee.contract_enddate = new Date();
        rndDays= Math.floor(Math.random() * 10) + 1;
        employee.contract_enddate.setTime(employee.end_date.getTime() - rndDays* 86400000);

        st.setInteger(1,employee.pernr);
        st.setString(2,"");
        st.setDate(3,employee.start_date);
        st.setDate(4,employee.end_date);
        st.setString(5,employee.contract_type);
        st.setString(6,employee.contract_number);
        st.setDate(7,employee.contract_startdate);
        st.setDate(8,employee.contract_enddate);
        st.setString(9,employee.contract_status);
        
        st.addBatch();

        cnt++;
    }
    
}

st.setBatchSize(cnt);

st.executeBatch();
st.close();
conn.commit();