/* =====================================================================
   AUTO-GENERATED TEMPLATE: resource_master.csv
   Staging Table   : dbo.stg_resource
   Production Table: dbo.mfg_resource
   Upsert Key      : r_es_ou_rc_e_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_resource', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_resource (
    [ResourceCode] NVARCHAR(4000) NULL,
    [ResourceName] NVARCHAR(4000) NULL,
    [ResourceType] NVARCHAR(4000) NULL,
    [CostRate] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_resource;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_resource
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\resource_master.csv'
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

MERGE dbo.mfg_resource AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([ResourceCode])), '') AS [r_es_ou_rc_ec_od_e],
    NULLIF(LTRIM(RTRIM([ResourceName])), '') AS [r_es_ou_rc_en_am_e],
    NULLIF(LTRIM(RTRIM([ResourceType])), '') AS [r_es_ou_rc_et_yp_e],
    NULLIF(LTRIM(RTRIM([CostRate])), '') AS [c_os_tr_at_e],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_resource
) AS src
ON tgt.[r_es_ou_rc_e_c_od_e] = src.[r_es_ou_rc_e_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[r_es_ou_rc_ec_od_e] = src.[r_es_ou_rc_ec_od_e],
    tgt.[r_es_ou_rc_en_am_e] = src.[r_es_ou_rc_en_am_e],
    tgt.[r_es_ou_rc_et_yp_e] = src.[r_es_ou_rc_et_yp_e],
    tgt.[c_os_tr_at_e] = src.[c_os_tr_at_e],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [r_es_ou_rc_ec_od_e], [r_es_ou_rc_en_am_e], [r_es_ou_rc_et_yp_e], [c_os_tr_at_e], [s_ta_tu_s]
  )
  VALUES (
    src.[r_es_ou_rc_ec_od_e], src.[r_es_ou_rc_en_am_e], src.[r_es_ou_rc_et_yp_e], src.[c_os_tr_at_e], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_resource;
SELECT COUNT(*) AS target_rows FROM dbo.mfg_resource;
GO
