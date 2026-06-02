/* =====================================================================
   AUTO-GENERATED TEMPLATE: warehouse_master.csv
   Staging Table   : dbo.stg_warehouse
   Production Table: dbo.inv_warehouse
   Upsert Key      : w_ar_eh_ou_se_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_warehouse', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_warehouse (
    [WarehouseCode] NVARCHAR(4000) NULL,
    [WarehouseName] NVARCHAR(4000) NULL,
    [WarehouseType] NVARCHAR(4000) NULL,
    [Address] NVARCHAR(4000) NULL,
    [ResponsiblePerson] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_warehouse;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_warehouse
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\warehouse_master.csv'
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

MERGE dbo.inv_warehouse AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([WarehouseCode])), '') AS [w_ar_eh_ou_se_co_de],
    NULLIF(LTRIM(RTRIM([WarehouseName])), '') AS [w_ar_eh_ou_se_na_me],
    NULLIF(LTRIM(RTRIM([WarehouseType])), '') AS [w_ar_eh_ou_se_ty_pe],
    NULLIF(LTRIM(RTRIM([Address])), '') AS [a_dd_re_ss],
    NULLIF(LTRIM(RTRIM([ResponsiblePerson])), '') AS [r_es_po_ns_ib_le_pe_rs_on],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_warehouse
) AS src
ON tgt.[w_ar_eh_ou_se_c_od_e] = src.[w_ar_eh_ou_se_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[w_ar_eh_ou_se_co_de] = src.[w_ar_eh_ou_se_co_de],
    tgt.[w_ar_eh_ou_se_na_me] = src.[w_ar_eh_ou_se_na_me],
    tgt.[w_ar_eh_ou_se_ty_pe] = src.[w_ar_eh_ou_se_ty_pe],
    tgt.[a_dd_re_ss] = src.[a_dd_re_ss],
    tgt.[r_es_po_ns_ib_le_pe_rs_on] = src.[r_es_po_ns_ib_le_pe_rs_on],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [w_ar_eh_ou_se_co_de], [w_ar_eh_ou_se_na_me], [w_ar_eh_ou_se_ty_pe], [a_dd_re_ss], [r_es_po_ns_ib_le_pe_rs_on], [s_ta_tu_s]
  )
  VALUES (
    src.[w_ar_eh_ou_se_co_de], src.[w_ar_eh_ou_se_na_me], src.[w_ar_eh_ou_se_ty_pe], src.[a_dd_re_ss], src.[r_es_po_ns_ib_le_pe_rs_on], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_warehouse;
SELECT COUNT(*) AS target_rows FROM dbo.inv_warehouse;
GO
