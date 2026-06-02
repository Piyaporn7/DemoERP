/* =====================================================================
   AUTO-GENERATED TEMPLATE: vendor_group_master.csv
   Staging Table   : dbo.stg_vendor_group
   Production Table: dbo.md_vendor_group
   Upsert Key      : v_en_do_r_g_ro_up_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_vendor_group', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_vendor_group (
    [VendorGroupCode] NVARCHAR(4000) NULL,
    [VendorGroupName] NVARCHAR(4000) NULL,
    [Description] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_vendor_group;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_vendor_group
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\vendor_group_master.csv'
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

MERGE dbo.md_vendor_group AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([VendorGroupCode])), '') AS [v_en_do_rg_ro_up_co_de],
    NULLIF(LTRIM(RTRIM([VendorGroupName])), '') AS [v_en_do_rg_ro_up_na_me],
    NULLIF(LTRIM(RTRIM([Description])), '') AS [d_es_cr_ip_ti_on],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_vendor_group
) AS src
ON tgt.[v_en_do_r_g_ro_up_c_od_e] = src.[v_en_do_r_g_ro_up_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[v_en_do_rg_ro_up_co_de] = src.[v_en_do_rg_ro_up_co_de],
    tgt.[v_en_do_rg_ro_up_na_me] = src.[v_en_do_rg_ro_up_na_me],
    tgt.[d_es_cr_ip_ti_on] = src.[d_es_cr_ip_ti_on],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [v_en_do_rg_ro_up_co_de], [v_en_do_rg_ro_up_na_me], [d_es_cr_ip_ti_on], [s_ta_tu_s]
  )
  VALUES (
    src.[v_en_do_rg_ro_up_co_de], src.[v_en_do_rg_ro_up_na_me], src.[d_es_cr_ip_ti_on], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_vendor_group;
SELECT COUNT(*) AS target_rows FROM dbo.md_vendor_group;
GO
