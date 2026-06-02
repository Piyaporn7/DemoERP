/* =====================================================================
   AUTO-GENERATED TEMPLATE: chart_of_account_master.csv
   Staging Table   : dbo.stg_coa
   Production Table: dbo.gl_account
   Upsert Key      : a_cc_ou_nt_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_coa', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_coa (
    [AccountCode] NVARCHAR(4000) NULL,
    [AccountName] NVARCHAR(4000) NULL,
    [AccountType] NVARCHAR(4000) NULL,
    [ParentAccount] NVARCHAR(4000) NULL,
    [Level] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_coa;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_coa
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\chart_of_account_master.csv'
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

MERGE dbo.gl_account AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([AccountCode])), '') AS [a_cc_ou_nt_co_de],
    NULLIF(LTRIM(RTRIM([AccountName])), '') AS [a_cc_ou_nt_na_me],
    NULLIF(LTRIM(RTRIM([AccountType])), '') AS [a_cc_ou_nt_ty_pe],
    NULLIF(LTRIM(RTRIM([ParentAccount])), '') AS [p_ar_en_ta_cc_ou_nt],
    NULLIF(LTRIM(RTRIM([Level])), '') AS [l_ev_el],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_coa
) AS src
ON tgt.[a_cc_ou_nt_c_od_e] = src.[a_cc_ou_nt_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[a_cc_ou_nt_co_de] = src.[a_cc_ou_nt_co_de],
    tgt.[a_cc_ou_nt_na_me] = src.[a_cc_ou_nt_na_me],
    tgt.[a_cc_ou_nt_ty_pe] = src.[a_cc_ou_nt_ty_pe],
    tgt.[p_ar_en_ta_cc_ou_nt] = src.[p_ar_en_ta_cc_ou_nt],
    tgt.[l_ev_el] = src.[l_ev_el],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [a_cc_ou_nt_co_de], [a_cc_ou_nt_na_me], [a_cc_ou_nt_ty_pe], [p_ar_en_ta_cc_ou_nt], [l_ev_el], [s_ta_tu_s]
  )
  VALUES (
    src.[a_cc_ou_nt_co_de], src.[a_cc_ou_nt_na_me], src.[a_cc_ou_nt_ty_pe], src.[p_ar_en_ta_cc_ou_nt], src.[l_ev_el], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_coa;
SELECT COUNT(*) AS target_rows FROM dbo.gl_account;
GO
