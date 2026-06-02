/* =====================================================================
   AUTO-GENERATED TEMPLATE: purchase_type_master.csv
   Staging Table   : dbo.stg_purchase_type
   Production Table: dbo.md_purchase_type
   Upsert Key      : p_ur_ch_as_e_t_yp_e_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_purchase_type', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_purchase_type (
    [PurchaseTypeCode] NVARCHAR(4000) NULL,
    [PurchaseTypeName] NVARCHAR(4000) NULL,
    [Description] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_purchase_type;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_purchase_type
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\purchase_type_master.csv'
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

MERGE dbo.md_purchase_type AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([PurchaseTypeCode])), '') AS [p_ur_ch_as_et_yp_ec_od_e],
    NULLIF(LTRIM(RTRIM([PurchaseTypeName])), '') AS [p_ur_ch_as_et_yp_en_am_e],
    NULLIF(LTRIM(RTRIM([Description])), '') AS [d_es_cr_ip_ti_on],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_purchase_type
) AS src
ON tgt.[p_ur_ch_as_e_t_yp_e_c_od_e] = src.[p_ur_ch_as_e_t_yp_e_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[p_ur_ch_as_et_yp_ec_od_e] = src.[p_ur_ch_as_et_yp_ec_od_e],
    tgt.[p_ur_ch_as_et_yp_en_am_e] = src.[p_ur_ch_as_et_yp_en_am_e],
    tgt.[d_es_cr_ip_ti_on] = src.[d_es_cr_ip_ti_on],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [p_ur_ch_as_et_yp_ec_od_e], [p_ur_ch_as_et_yp_en_am_e], [d_es_cr_ip_ti_on], [s_ta_tu_s]
  )
  VALUES (
    src.[p_ur_ch_as_et_yp_ec_od_e], src.[p_ur_ch_as_et_yp_en_am_e], src.[d_es_cr_ip_ti_on], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_purchase_type;
SELECT COUNT(*) AS target_rows FROM dbo.md_purchase_type;
GO
