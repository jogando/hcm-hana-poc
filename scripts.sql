CREATE COLUMN TABLE PA0001 ( 
    PERNR INTEGER, 
    SUBTY varchar(4),
    BEGDA DATE, 
    ENDDA DATE, 
    BUKRS varchar(4),--Company Code
    WERKS varchar(4),--Personnel Area
    BTRTL varchar(4),--Personnel subarea
    PLANS integer,--Position
    STELL integer,--Job
    ORGEH integer,--Org Unit
    PRIMARY KEY (PERNR,SUBTY,BEGDA,ENDDA) 
); 
CREATE INDEX IDX_PA0001_PERNR ON PA0001 (PERNR);


CREATE COLUMN TABLE PA0008 ( 
    PERNR INTEGER, 
    SUBTY varchar(4),
    BEGDA DATE, 
    ENDDA DATE, 
    ANSAL DOUBLE,--Anual Salary
    WAERS varchar(5),--Currency code
    PRIMARY KEY (PERNR,SUBTY,BEGDA,ENDDA) 
);
CREATE INDEX IDX_PA0008_PERNR ON PA0008 (PERNR);

CREATE COLUMN TABLE PA0016 ( 
    PERNR INTEGER, 
    SUBTY varchar(4),
    BEGDA DATE, 
    ENDDA DATE, 
    CTTYP varchar(2),--Contract Type
    ZZCONTRACT_NO varchar(20),--contract number
    ZZBEGDA DATE, --contract begin date
    CTEDT DATE,--contract end date
    CTSTAT varchar(3),--contract status
    PRIMARY KEY (PERNR,SUBTY,BEGDA,ENDDA) 
);
CREATE INDEX IDX_PA0016_PERNR ON PA0016 (PERNR);

CREATE COLUMN TABLE PA0167 ( 
    PERNR INTEGER, 
    SUBTY varchar(4),
    BEGDA DATE, 
    ENDDA DATE, 
    PLTYP varchar(4),--plan type
    BPLAN varchar(4), --benefit plan
    BOPTI varchar(4), -- health plan option
    DEPCV varchar(4), --dependent coverage
    PRIMARY KEY (PERNR,SUBTY,BEGDA,ENDDA) 
);
CREATE INDEX IDX_PA0167_PERNR ON PA0167 (PERNR);



CREATE COLUMN TABLE EMPLOYEE_ATTR ( 
    PERNR INTEGER, 
    BEGDA DATE, 
    ENDDA DATE, 
    BUKRS varchar(4),--Company Code
    WERKS varchar(4),--Personnel Area
    BTRTL varchar(4),--Personnel subarea
    PLANS integer,--Position
    STELL integer,--Job
    ORGEH integer,--Org Unit
    ANSAL DOUBLE,--Anual Salary
    WAERS varchar(5),--Currency code
    PRIMARY KEY (PERNR,BEGDA,ENDDA) 
);

delete from "HCM_POC"."PA0001";
delete from "HCM_POC"."PA0008";
delete from "HCM_POC"."PA0016";
delete from "HCM_POC"."PA0167";

select count(*) from "HCM_POC"."PA0001";
select count(*) from "HCM_POC"."PA0008";
select count(*) from "HCM_POC"."PA0016";
select count(*) from "HCM_POC"."PA0167";