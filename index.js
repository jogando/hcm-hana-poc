var startEmployeeNum = 1000;
var endEmployeeNum = 2000;

var orgunits = [42543533,75683747,48954538,94857465,14857564,84756453,84756474];
var positions = [3453,1543,1123,55543,345,222,543,5746,4234];
var jobs = [12,55,44,22,345,52,112,674,76575];
var personnel_areas = ["AR00", "AR01", "DC00", "DC01"];
var personnel_subareas = ["3200", "1100", "4321", "9483"];
var company_codes = ["IDB1", "IIC1"];

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
        employee.pernr = startEmployeeNum + cnt;
        employee.start_date = dateRanges[j][0];
        employee.end_date = dateRanges[j][1];
        employee.orgunit = orgunits[Math.floor(Math.random() * orgunits.length) + 0];
        employee.job = jobs[Math.floor(Math.random() * jobs.length) + 0];
        employee.position = positions[Math.floor(Math.random() * positions.length) + 0];
        employee.personnel_area = personnel_areas[Math.floor(Math.random() * personnel_areas.length) + 0];
        employee.personnel_subarea = personnel_subareas[Math.floor(Math.random() * personnel_subareas.length) + 0];
        employee.company_code = company_codes[Math.floor(Math.random() * company_codes.length) + 0];

        st.setInteger(1,employee.pernr);
        st.setString(2,"");
        st.setDate(3,employee.start_date);
        st.setDate(4,employee.end_date);
        st.setString(5,employee.company_code);
        st.setString(6,employee.personnel_area);
        st.setString(7,employee.personnel_subarea);
        st.setInteger(8,employee.position);
        st.setInteger(9,employee.job);
        st.setInteger(10,employee.orgunit);
        st.addBatch();

        cnt++;
    }
    
}

st.setBatchSize(cnt);

for(i=0;i<BACTHSIZE;i++) {
   st.setInt(1,i);
   st.addBatch();
}
st.executeBatch();
st.close();
conn.commit();