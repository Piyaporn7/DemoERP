/* =====================================================================
   AUTO-GENERATED TEMPLATE: machine_master.csv
   Staging Table   : dbo.stg_machine
   Production Table: dbo.mfg_machine
   Upsert Key      : m_ac_hi_ne_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_machine', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_machine (
    [MachineCode] NVARCHAR(4000) NULL,
    [MachineName] NVARCHAR(4000) NULL,
    [WorkCenter] NVARCHAR(4000) NULL,
    [Capacity] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_machine;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_machine
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\machine_master.csv'
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

MERGE dbo.mfg_machine AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([MachineCode])), '') AS [m_ac_hi_ne_co_de],
    NULLIF(LTRIM(RTRIM([MachineName])), '') AS [m_ac_hi_ne_na_me],
    NULLIF(LTRIM(RTRIM([WorkCenter])), '') AS [w_or_kc_en_te_r],
    NULLIF(LTRIM(RTRIM([Capacity])), '') AS [c_ap_ac_it_y],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_machine
) AS src
ON tgt.[m_ac_hi_ne_c_od_e] = src.[m_ac_hi_ne_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[m_ac_hi_ne_co_de] = src.[m_ac_hi_ne_co_de],
    tgt.[m_ac_hi_ne_na_me] = src.[m_ac_hi_ne_na_me],
    tgt.[w_or_kc_en_te_r] = src.[w_or_kc_en_te_r],
    tgt.[c_ap_ac_it_y] = src.[c_ap_ac_it_y],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [m_ac_hi_ne_co_de], [m_ac_hi_ne_na_me], [w_or_kc_en_te_r], [c_ap_ac_it_y], [s_ta_tu_s]
  )
  VALUES (
    src.[m_ac_hi_ne_co_de], src.[m_ac_hi_ne_na_me], src.[w_or_kc_en_te_r], src.[c_ap_ac_it_y], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_machine;
SELECT COUNT(*) AS target_rows FROM dbo.mfg_machine;
GO
