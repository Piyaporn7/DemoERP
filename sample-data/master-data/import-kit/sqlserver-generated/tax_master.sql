/* =====================================================================
   AUTO-GENERATED TEMPLATE: tax_master.csv
   Staging Table   : dbo.stg_tax
   Production Table: dbo.md_tax
   Upsert Key      : t_ax_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_tax', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_tax (
    [TaxCode] NVARCHAR(4000) NULL,
    [TaxName] NVARCHAR(4000) NULL,
    [TaxRate] NVARCHAR(4000) NULL,
    [TaxType] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_tax;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_tax
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\tax_master.csv'
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

MERGE dbo.md_tax AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([TaxCode])), '') AS [t_ax_co_de],
    NULLIF(LTRIM(RTRIM([TaxName])), '') AS [t_ax_na_me],
    NULLIF(LTRIM(RTRIM([TaxRate])), '') AS [t_ax_ra_te],
    NULLIF(LTRIM(RTRIM([TaxType])), '') AS [t_ax_ty_pe],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_tax
) AS src
ON tgt.[t_ax_c_od_e] = src.[t_ax_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[t_ax_co_de] = src.[t_ax_co_de],
    tgt.[t_ax_na_me] = src.[t_ax_na_me],
    tgt.[t_ax_ra_te] = src.[t_ax_ra_te],
    tgt.[t_ax_ty_pe] = src.[t_ax_ty_pe],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [t_ax_co_de], [t_ax_na_me], [t_ax_ra_te], [t_ax_ty_pe], [s_ta_tu_s]
  )
  VALUES (
    src.[t_ax_co_de], src.[t_ax_na_me], src.[t_ax_ra_te], src.[t_ax_ty_pe], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_tax;
SELECT COUNT(*) AS target_rows FROM dbo.md_tax;
GO
