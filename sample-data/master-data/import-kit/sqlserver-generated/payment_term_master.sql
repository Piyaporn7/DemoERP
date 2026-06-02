/* =====================================================================
   AUTO-GENERATED TEMPLATE: payment_term_master.csv
   Staging Table   : dbo.stg_payment_term
   Production Table: dbo.md_payment_term
   Upsert Key      : p_ay_me_nt_t_er_m_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_payment_term', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_payment_term (
    [PaymentTermCode] NVARCHAR(4000) NULL,
    [PaymentTermName] NVARCHAR(4000) NULL,
    [CreditDay] NVARCHAR(4000) NULL,
    [DueDateType] NVARCHAR(4000) NULL,
    [Description] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_payment_term;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_payment_term
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\payment_term_master.csv'
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

MERGE dbo.md_payment_term AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([PaymentTermCode])), '') AS [p_ay_me_nt_te_rm_co_de],
    NULLIF(LTRIM(RTRIM([PaymentTermName])), '') AS [p_ay_me_nt_te_rm_na_me],
    NULLIF(LTRIM(RTRIM([CreditDay])), '') AS [c_re_di_td_ay],
    NULLIF(LTRIM(RTRIM([DueDateType])), '') AS [d_ue_da_te_ty_pe],
    NULLIF(LTRIM(RTRIM([Description])), '') AS [d_es_cr_ip_ti_on],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_payment_term
) AS src
ON tgt.[p_ay_me_nt_t_er_m_c_od_e] = src.[p_ay_me_nt_t_er_m_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[p_ay_me_nt_te_rm_co_de] = src.[p_ay_me_nt_te_rm_co_de],
    tgt.[p_ay_me_nt_te_rm_na_me] = src.[p_ay_me_nt_te_rm_na_me],
    tgt.[c_re_di_td_ay] = src.[c_re_di_td_ay],
    tgt.[d_ue_da_te_ty_pe] = src.[d_ue_da_te_ty_pe],
    tgt.[d_es_cr_ip_ti_on] = src.[d_es_cr_ip_ti_on],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [p_ay_me_nt_te_rm_co_de], [p_ay_me_nt_te_rm_na_me], [c_re_di_td_ay], [d_ue_da_te_ty_pe], [d_es_cr_ip_ti_on], [s_ta_tu_s]
  )
  VALUES (
    src.[p_ay_me_nt_te_rm_co_de], src.[p_ay_me_nt_te_rm_na_me], src.[c_re_di_td_ay], src.[d_ue_da_te_ty_pe], src.[d_es_cr_ip_ti_on], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_payment_term;
SELECT COUNT(*) AS target_rows FROM dbo.md_payment_term;
GO
