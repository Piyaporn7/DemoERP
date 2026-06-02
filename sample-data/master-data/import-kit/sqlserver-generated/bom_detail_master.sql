/* =====================================================================
   AUTO-GENERATED TEMPLATE: bom_detail_master.csv
   Staging Table   : dbo.stg_bom_detail
   Production Table: dbo.mfg_bom_detail
   Upsert Key      : b_om_c_od_e, i_te_m_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_bom_detail', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_bom_detail (
    [BOMCode] NVARCHAR(4000) NULL,
    [Item] NVARCHAR(4000) NULL,
    [Quantity] NVARCHAR(4000) NULL,
    [Unit] NVARCHAR(4000) NULL,
    [ScrapPercent] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_bom_detail;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_bom_detail
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\bom_detail_master.csv'
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

MERGE dbo.mfg_bom_detail AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([BOMCode])), '') AS [b_om_co_de],
    NULLIF(LTRIM(RTRIM([Item])), '') AS [i_te_m],
    NULLIF(LTRIM(RTRIM([Quantity])), '') AS [q_ua_nt_it_y],
    NULLIF(LTRIM(RTRIM([Unit])), '') AS [u_ni_t],
    NULLIF(LTRIM(RTRIM([ScrapPercent])), '') AS [s_cr_ap_pe_rc_en_t]
  FROM dbo.stg_bom_detail
) AS src
ON tgt.[b_om_c_od_e] = src.[b_om_c_od_e]
    AND tgt.[i_te_m_c_od_e] = src.[i_te_m_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[b_om_co_de] = src.[b_om_co_de],
    tgt.[i_te_m] = src.[i_te_m],
    tgt.[q_ua_nt_it_y] = src.[q_ua_nt_it_y],
    tgt.[u_ni_t] = src.[u_ni_t],
    tgt.[s_cr_ap_pe_rc_en_t] = src.[s_cr_ap_pe_rc_en_t]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [b_om_co_de], [i_te_m], [q_ua_nt_it_y], [u_ni_t], [s_cr_ap_pe_rc_en_t]
  )
  VALUES (
    src.[b_om_co_de], src.[i_te_m], src.[q_ua_nt_it_y], src.[u_ni_t], src.[s_cr_ap_pe_rc_en_t]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_bom_detail;
SELECT COUNT(*) AS target_rows FROM dbo.mfg_bom_detail;
GO
