/* =====================================================================
   AUTO-GENERATED TEMPLATE: bom_header_master.csv
   Staging Table   : dbo.stg_bom_header
   Production Table: dbo.mfg_bom_header
   Upsert Key      : b_om_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_bom_header', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_bom_header (
    [BOMCode] NVARCHAR(4000) NULL,
    [ProductItem] NVARCHAR(4000) NULL,
    [Version] NVARCHAR(4000) NULL,
    [EffectiveDate] NVARCHAR(4000) NULL,
    [Description] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_bom_header;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_bom_header
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\bom_header_master.csv'
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

MERGE dbo.mfg_bom_header AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([BOMCode])), '') AS [b_om_co_de],
    NULLIF(LTRIM(RTRIM([ProductItem])), '') AS [p_ro_du_ct_it_em],
    NULLIF(LTRIM(RTRIM([Version])), '') AS [v_er_si_on],
    NULLIF(LTRIM(RTRIM([EffectiveDate])), '') AS [e_ff_ec_ti_ve_da_te],
    NULLIF(LTRIM(RTRIM([Description])), '') AS [d_es_cr_ip_ti_on],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_bom_header
) AS src
ON tgt.[b_om_c_od_e] = src.[b_om_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[b_om_co_de] = src.[b_om_co_de],
    tgt.[p_ro_du_ct_it_em] = src.[p_ro_du_ct_it_em],
    tgt.[v_er_si_on] = src.[v_er_si_on],
    tgt.[e_ff_ec_ti_ve_da_te] = src.[e_ff_ec_ti_ve_da_te],
    tgt.[d_es_cr_ip_ti_on] = src.[d_es_cr_ip_ti_on],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [b_om_co_de], [p_ro_du_ct_it_em], [v_er_si_on], [e_ff_ec_ti_ve_da_te], [d_es_cr_ip_ti_on], [s_ta_tu_s]
  )
  VALUES (
    src.[b_om_co_de], src.[p_ro_du_ct_it_em], src.[v_er_si_on], src.[e_ff_ec_ti_ve_da_te], src.[d_es_cr_ip_ti_on], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_bom_header;
SELECT COUNT(*) AS target_rows FROM dbo.mfg_bom_header;
GO
