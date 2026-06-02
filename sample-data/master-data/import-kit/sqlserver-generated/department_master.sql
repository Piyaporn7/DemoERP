/* =====================================================================
   AUTO-GENERATED TEMPLATE: department_master.csv
   Staging Table   : dbo.stg_department
   Production Table: dbo.md_department
   Upsert Key      : d_ep_ar_tm_en_t_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_department', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_department (
    [DepartmentCode] NVARCHAR(4000) NULL,
    [DepartmentName] NVARCHAR(4000) NULL,
    [Description] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_department;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_department
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\department_master.csv'
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

MERGE dbo.md_department AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([DepartmentCode])), '') AS [d_ep_ar_tm_en_tc_od_e],
    NULLIF(LTRIM(RTRIM([DepartmentName])), '') AS [d_ep_ar_tm_en_tn_am_e],
    NULLIF(LTRIM(RTRIM([Description])), '') AS [d_es_cr_ip_ti_on],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_department
) AS src
ON tgt.[d_ep_ar_tm_en_t_c_od_e] = src.[d_ep_ar_tm_en_t_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[d_ep_ar_tm_en_tc_od_e] = src.[d_ep_ar_tm_en_tc_od_e],
    tgt.[d_ep_ar_tm_en_tn_am_e] = src.[d_ep_ar_tm_en_tn_am_e],
    tgt.[d_es_cr_ip_ti_on] = src.[d_es_cr_ip_ti_on],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [d_ep_ar_tm_en_tc_od_e], [d_ep_ar_tm_en_tn_am_e], [d_es_cr_ip_ti_on], [s_ta_tu_s]
  )
  VALUES (
    src.[d_ep_ar_tm_en_tc_od_e], src.[d_ep_ar_tm_en_tn_am_e], src.[d_es_cr_ip_ti_on], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_department;
SELECT COUNT(*) AS target_rows FROM dbo.md_department;
GO
