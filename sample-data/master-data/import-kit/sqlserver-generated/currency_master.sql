/* =====================================================================
   AUTO-GENERATED TEMPLATE: currency_master.csv
   Staging Table   : dbo.stg_currency
   Production Table: dbo.md_currency
   Upsert Key      : c_ur_re_nc_y_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_currency', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_currency (
    [CurrencyCode] NVARCHAR(4000) NULL,
    [CurrencyName] NVARCHAR(4000) NULL,
    [ExchangeRate] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_currency;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_currency
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\currency_master.csv'
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

MERGE dbo.md_currency AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([CurrencyCode])), '') AS [c_ur_re_nc_yc_od_e],
    NULLIF(LTRIM(RTRIM([CurrencyName])), '') AS [c_ur_re_nc_yn_am_e],
    NULLIF(LTRIM(RTRIM([ExchangeRate])), '') AS [e_xc_ha_ng_er_at_e],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_currency
) AS src
ON tgt.[c_ur_re_nc_y_c_od_e] = src.[c_ur_re_nc_y_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[c_ur_re_nc_yc_od_e] = src.[c_ur_re_nc_yc_od_e],
    tgt.[c_ur_re_nc_yn_am_e] = src.[c_ur_re_nc_yn_am_e],
    tgt.[e_xc_ha_ng_er_at_e] = src.[e_xc_ha_ng_er_at_e],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [c_ur_re_nc_yc_od_e], [c_ur_re_nc_yn_am_e], [e_xc_ha_ng_er_at_e], [s_ta_tu_s]
  )
  VALUES (
    src.[c_ur_re_nc_yc_od_e], src.[c_ur_re_nc_yn_am_e], src.[e_xc_ha_ng_er_at_e], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_currency;
SELECT COUNT(*) AS target_rows FROM dbo.md_currency;
GO
