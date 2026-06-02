/* =====================================================================
   AUTO-GENERATED TEMPLATE: work_center_master.csv
   Staging Table   : dbo.stg_work_center
   Production Table: dbo.mfg_work_center
   Upsert Key      : w_or_k_c_en_te_r_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_work_center', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_work_center (
    [WorkCenterCode] NVARCHAR(4000) NULL,
    [WorkCenterName] NVARCHAR(4000) NULL,
    [Department] NVARCHAR(4000) NULL,
    [Capacity] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_work_center;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_work_center
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\work_center_master.csv'
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

MERGE dbo.mfg_work_center AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([WorkCenterCode])), '') AS [w_or_kc_en_te_rc_od_e],
    NULLIF(LTRIM(RTRIM([WorkCenterName])), '') AS [w_or_kc_en_te_rn_am_e],
    NULLIF(LTRIM(RTRIM([Department])), '') AS [d_ep_ar_tm_en_t],
    NULLIF(LTRIM(RTRIM([Capacity])), '') AS [c_ap_ac_it_y],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_work_center
) AS src
ON tgt.[w_or_k_c_en_te_r_c_od_e] = src.[w_or_k_c_en_te_r_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[w_or_kc_en_te_rc_od_e] = src.[w_or_kc_en_te_rc_od_e],
    tgt.[w_or_kc_en_te_rn_am_e] = src.[w_or_kc_en_te_rn_am_e],
    tgt.[d_ep_ar_tm_en_t] = src.[d_ep_ar_tm_en_t],
    tgt.[c_ap_ac_it_y] = src.[c_ap_ac_it_y],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [w_or_kc_en_te_rc_od_e], [w_or_kc_en_te_rn_am_e], [d_ep_ar_tm_en_t], [c_ap_ac_it_y], [s_ta_tu_s]
  )
  VALUES (
    src.[w_or_kc_en_te_rc_od_e], src.[w_or_kc_en_te_rn_am_e], src.[d_ep_ar_tm_en_t], src.[c_ap_ac_it_y], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_work_center;
SELECT COUNT(*) AS target_rows FROM dbo.mfg_work_center;
GO
