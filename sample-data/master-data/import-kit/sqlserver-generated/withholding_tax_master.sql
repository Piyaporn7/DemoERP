/* =====================================================================
   AUTO-GENERATED TEMPLATE: withholding_tax_master.csv
   Staging Table   : dbo.stg_wht
   Production Table: dbo.md_withholding_tax
   Upsert Key      : w_ht_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_wht', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_wht (
    [WHTCode] NVARCHAR(4000) NULL,
    [WHTName] NVARCHAR(4000) NULL,
    [TaxRate] NVARCHAR(4000) NULL,
    [TaxType] NVARCHAR(4000) NULL,
    [Description] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_wht;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_wht
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\withholding_tax_master.csv'
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

MERGE dbo.md_withholding_tax AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([WHTCode])), '') AS [w_ht_co_de],
    NULLIF(LTRIM(RTRIM([WHTName])), '') AS [w_ht_na_me],
    NULLIF(LTRIM(RTRIM([TaxRate])), '') AS [t_ax_ra_te],
    NULLIF(LTRIM(RTRIM([TaxType])), '') AS [t_ax_ty_pe],
    NULLIF(LTRIM(RTRIM([Description])), '') AS [d_es_cr_ip_ti_on],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_wht
) AS src
ON tgt.[w_ht_c_od_e] = src.[w_ht_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[w_ht_co_de] = src.[w_ht_co_de],
    tgt.[w_ht_na_me] = src.[w_ht_na_me],
    tgt.[t_ax_ra_te] = src.[t_ax_ra_te],
    tgt.[t_ax_ty_pe] = src.[t_ax_ty_pe],
    tgt.[d_es_cr_ip_ti_on] = src.[d_es_cr_ip_ti_on],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [w_ht_co_de], [w_ht_na_me], [t_ax_ra_te], [t_ax_ty_pe], [d_es_cr_ip_ti_on], [s_ta_tu_s]
  )
  VALUES (
    src.[w_ht_co_de], src.[w_ht_na_me], src.[t_ax_ra_te], src.[t_ax_ty_pe], src.[d_es_cr_ip_ti_on], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_wht;
SELECT COUNT(*) AS target_rows FROM dbo.md_withholding_tax;
GO
