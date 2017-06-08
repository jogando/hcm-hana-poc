var conn = $.db.getConnection();
var BACTHSIZE = 10000;
var st = conn.prepareStatement("insert into \"HCM_POC\".\"PA0008\" values(?,?,?,?,?,?)");

var startEmployeeNum = 1000;
var endEmployeeNum = 2000;

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
        var employee = {};
        employee.pernr = startEmployeeNum + i;
        employee.start_date = dateRanges[j][0];
        employee.end_date = dateRanges[j][1];
        employee.annual_salary = Math.floor(Math.random() * 240000) + 40000;

        st.setInteger(1,employee.pernr);
        st.setString(2,"");
        st.setDate(3,employee.start_date);
        st.setDate(4,employee.end_date);
        st.setDouble(5,employee.annual_salary);
        st.setString(6,"USD");
        st.addBatch();

        cnt++;
    }
    
}

st.setBatchSize(cnt);

st.executeBatch();
st.close();
conn.commit();