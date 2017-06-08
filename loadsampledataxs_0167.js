var conn = $.db.getConnection();
var BACTHSIZE = 10000;
var st = conn.prepareStatement("insert into \"HCM_POC\".\"PA0167\" values(?,?,?,?,?,?,?,?)");

var startEmployeeNum = 1000;
var endEmployeeNum = 2000;

var plan_types = ["MEDC", "BLIF","IDBR", "RETL", "ADDD"];
var benefit_plans = ["MWAV", "NATN", "INTL","MEDI"];
var healthplan_options = ["INTL", "NATN"];
var dependent_coverages = ["SING", "1CHL","2CHL","3CHL"];

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
        employee.plan_type = plan_types[Math.floor(Math.random() * plan_types.length) + 0];
        employee.benefit_plan = benefit_plans[Math.floor(Math.random() * benefit_plans.length) + 0];
        employee.healthplan_option = healthplan_options[Math.floor(Math.random() * healthplan_options.length) + 0];
        employee.dependent_coverage = dependent_coverages[Math.floor(Math.random() * dependent_coverages.length) + 0];

        st.setInteger(1,employee.pernr);
        st.setString(2,"");
        st.setDate(3,employee.start_date);
        st.setDate(4,employee.end_date);
        st.setString(5,employee.plan_type);
        st.setString(6,employee.benefit_plan);
        st.setString(7,employee.healthplan_option);
        st.setString(8,employee.dependent_coverage);
        st.addBatch();

        cnt++;
    }
    
}

st.setBatchSize(cnt);

st.executeBatch();
st.close();
conn.commit();