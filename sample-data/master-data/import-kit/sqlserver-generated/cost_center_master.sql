/* =====================================================================
   AUTO-GENERATED TEMPLATE: cost_center_master.csv
   Staging Table   : dbo.stg_cost_center
   Production Table: dbo.md_cost_center
   Upsert Key      : c_os_t_c_en_te_r_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_cost_center', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_cost_center (
    [CostCenterCode] NVARCHAR(4000) NULL,
    [CostCenterName] NVARCHAR(4000) NULL,
    [Department] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_cost_center;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_cost_center
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\cost_center_master.csv'
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

MERGE dbo.md_cost_center AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([CostCenterCode])), '') AS [c_os_tc_en_te_rc_od_e],
    NULLIF(LTRIM(RTRIM([CostCenterName])), '') AS [c_os_tc_en_te_rn_am_e],
    NULLIF(LTRIM(RTRIM([Department])), '') AS [d_ep_ar_tm_en_t],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_cost_center
) AS src
ON tgt.[c_os_t_c_en_te_r_c_od_e] = src.[c_os_t_c_en_te_r_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[c_os_tc_en_te_rc_od_e] = src.[c_os_tc_en_te_rc_od_e],
    tgt.[c_os_tc_en_te_rn_am_e] = src.[c_os_tc_en_te_rn_am_e],
    tgt.[d_ep_ar_tm_en_t] = src.[d_ep_ar_tm_en_t],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [c_os_tc_en_te_rc_od_e], [c_os_tc_en_te_rn_am_e], [d_ep_ar_tm_en_t], [s_ta_tu_s]
  )
  VALUES (
    src.[c_os_tc_en_te_rc_od_e], src.[c_os_tc_en_te_rn_am_e], src.[d_ep_ar_tm_en_t], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_cost_center;
SELECT COUNT(*) AS target_rows FROM dbo.md_cost_center;
GO
