/* =====================================================================
   AUTO-GENERATED TEMPLATE: unit_master.csv
   Staging Table   : dbo.stg_unit
   Production Table: dbo.md_unit
   Upsert Key      : u_ni_t_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_unit', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_unit (
    [UnitCode] NVARCHAR(4000) NULL,
    [UnitName] NVARCHAR(4000) NULL,
    [UnitDescription] NVARCHAR(4000) NULL,
    [BaseUnit] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_unit;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_unit
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\unit_master.csv'
WITH (
  FIRSTROW = 2,
  FIELDTERMINATOR = ',',
  ROWTERMINATOR = '0x0A',
  CODEPAGE = '65001',
  TABLOCK,
  FORMAT = 'CSV'
);
GO
*/

MERGE dbo.md_unit AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([UnitCode])), '') AS [u_ni_tc_od_e],
    NULLIF(LTRIM(RTRIM([UnitName])), '') AS [u_ni_tn_am_e],
    NULLIF(LTRIM(RTRIM([UnitDescription])), '') AS [u_ni_td_es_cr_ip_ti_on],
    NULLIF(LTRIM(RTRIM([BaseUnit])), '') AS [b_as_eu_ni_t],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_unit
) AS src
ON tgt.[u_ni_t_c_od_e] = src.[u_ni_t_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[u_ni_tc_od_e] = src.[u_ni_tc_od_e],
    tgt.[u_ni_tn_am_e] = src.[u_ni_tn_am_e],
    tgt.[u_ni_td_es_cr_ip_ti_on] = src.[u_ni_td_es_cr_ip_ti_on],
    tgt.[b_as_eu_ni_t] = src.[b_as_eu_ni_t],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [u_ni_tc_od_e], [u_ni_tn_am_e], [u_ni_td_es_cr_ip_ti_on], [b_as_eu_ni_t], [s_ta_tu_s]
  )
  VALUES (
    src.[u_ni_tc_od_e], src.[u_ni_tn_am_e], src.[u_ni_td_es_cr_ip_ti_on], src.[b_as_eu_ni_t], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_unit;
SELECT COUNT(*) AS target_rows FROM dbo.md_unit;
GO
