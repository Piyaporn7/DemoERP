/* =====================================================================
   AUTO-GENERATED TEMPLATE: customer_group_master.csv
   Staging Table   : dbo.stg_customer_group
   Production Table: dbo.md_customer_group
   Upsert Key      : c_us_to_me_r_g_ro_up_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_customer_group', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_customer_group (
    [CustomerGroupCode] NVARCHAR(4000) NULL,
    [CustomerGroupName] NVARCHAR(4000) NULL,
    [Description] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_customer_group;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_customer_group
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\customer_group_master.csv'
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

MERGE dbo.md_customer_group AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([CustomerGroupCode])), '') AS [c_us_to_me_rg_ro_up_co_de],
    NULLIF(LTRIM(RTRIM([CustomerGroupName])), '') AS [c_us_to_me_rg_ro_up_na_me],
    NULLIF(LTRIM(RTRIM([Description])), '') AS [d_es_cr_ip_ti_on],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_customer_group
) AS src
ON tgt.[c_us_to_me_r_g_ro_up_c_od_e] = src.[c_us_to_me_r_g_ro_up_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[c_us_to_me_rg_ro_up_co_de] = src.[c_us_to_me_rg_ro_up_co_de],
    tgt.[c_us_to_me_rg_ro_up_na_me] = src.[c_us_to_me_rg_ro_up_na_me],
    tgt.[d_es_cr_ip_ti_on] = src.[d_es_cr_ip_ti_on],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [c_us_to_me_rg_ro_up_co_de], [c_us_to_me_rg_ro_up_na_me], [d_es_cr_ip_ti_on], [s_ta_tu_s]
  )
  VALUES (
    src.[c_us_to_me_rg_ro_up_co_de], src.[c_us_to_me_rg_ro_up_na_me], src.[d_es_cr_ip_ti_on], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_customer_group;
SELECT COUNT(*) AS target_rows FROM dbo.md_customer_group;
GO
