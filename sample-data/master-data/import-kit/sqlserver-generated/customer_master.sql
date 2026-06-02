/* =====================================================================
   AUTO-GENERATED TEMPLATE: customer_master.csv
   Staging Table   : dbo.stg_customer
   Production Table: dbo.ar_customer
   Upsert Key      : c_us_to_me_r_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_customer', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_customer (
    [CustomerCode] NVARCHAR(4000) NULL,
    [CustomerName] NVARCHAR(4000) NULL,
    [CustomerGroup] NVARCHAR(4000) NULL,
    [TaxID] NVARCHAR(4000) NULL,
    [Address] NVARCHAR(4000) NULL,
    [ContactName] NVARCHAR(4000) NULL,
    [PhoneEmail] NVARCHAR(4000) NULL,
    [PaymentTerm] NVARCHAR(4000) NULL,
    [CreditLimit] NVARCHAR(4000) NULL,
    [PriceList] NVARCHAR(4000) NULL,
    [Currency] NVARCHAR(4000) NULL,
    [TaxType] NVARCHAR(4000) NULL,
    [SalesPerson] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_customer;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_customer
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\customer_master.csv'
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

MERGE dbo.ar_customer AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([CustomerCode])), '') AS [c_us_to_me_rc_od_e],
    NULLIF(LTRIM(RTRIM([CustomerName])), '') AS [c_us_to_me_rn_am_e],
    NULLIF(LTRIM(RTRIM([CustomerGroup])), '') AS [c_us_to_me_rg_ro_up],
    NULLIF(LTRIM(RTRIM([TaxID])), '') AS [t_ax_id],
    NULLIF(LTRIM(RTRIM([Address])), '') AS [a_dd_re_ss],
    NULLIF(LTRIM(RTRIM([ContactName])), '') AS [c_on_ta_ct_na_me],
    NULLIF(LTRIM(RTRIM([PhoneEmail])), '') AS [p_ho_ne_em_ai_l],
    NULLIF(LTRIM(RTRIM([PaymentTerm])), '') AS [p_ay_me_nt_te_rm],
    NULLIF(LTRIM(RTRIM([CreditLimit])), '') AS [c_re_di_tl_im_it],
    NULLIF(LTRIM(RTRIM([PriceList])), '') AS [p_ri_ce_li_st],
    NULLIF(LTRIM(RTRIM([Currency])), '') AS [c_ur_re_nc_y],
    NULLIF(LTRIM(RTRIM([TaxType])), '') AS [t_ax_ty_pe],
    NULLIF(LTRIM(RTRIM([SalesPerson])), '') AS [s_al_es_pe_rs_on],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_customer
) AS src
ON tgt.[c_us_to_me_r_c_od_e] = src.[c_us_to_me_r_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[c_us_to_me_rc_od_e] = src.[c_us_to_me_rc_od_e],
    tgt.[c_us_to_me_rn_am_e] = src.[c_us_to_me_rn_am_e],
    tgt.[c_us_to_me_rg_ro_up] = src.[c_us_to_me_rg_ro_up],
    tgt.[t_ax_id] = src.[t_ax_id],
    tgt.[a_dd_re_ss] = src.[a_dd_re_ss],
    tgt.[c_on_ta_ct_na_me] = src.[c_on_ta_ct_na_me],
    tgt.[p_ho_ne_em_ai_l] = src.[p_ho_ne_em_ai_l],
    tgt.[p_ay_me_nt_te_rm] = src.[p_ay_me_nt_te_rm],
    tgt.[c_re_di_tl_im_it] = src.[c_re_di_tl_im_it],
    tgt.[p_ri_ce_li_st] = src.[p_ri_ce_li_st],
    tgt.[c_ur_re_nc_y] = src.[c_ur_re_nc_y],
    tgt.[t_ax_ty_pe] = src.[t_ax_ty_pe],
    tgt.[s_al_es_pe_rs_on] = src.[s_al_es_pe_rs_on],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [c_us_to_me_rc_od_e], [c_us_to_me_rn_am_e], [c_us_to_me_rg_ro_up], [t_ax_id], [a_dd_re_ss], [c_on_ta_ct_na_me], [p_ho_ne_em_ai_l], [p_ay_me_nt_te_rm], [c_re_di_tl_im_it], [p_ri_ce_li_st], [c_ur_re_nc_y], [t_ax_ty_pe], [s_al_es_pe_rs_on], [s_ta_tu_s]
  )
  VALUES (
    src.[c_us_to_me_rc_od_e], src.[c_us_to_me_rn_am_e], src.[c_us_to_me_rg_ro_up], src.[t_ax_id], src.[a_dd_re_ss], src.[c_on_ta_ct_na_me], src.[p_ho_ne_em_ai_l], src.[p_ay_me_nt_te_rm], src.[c_re_di_tl_im_it], src.[p_ri_ce_li_st], src.[c_ur_re_nc_y], src.[t_ax_ty_pe], src.[s_al_es_pe_rs_on], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_customer;
SELECT COUNT(*) AS target_rows FROM dbo.ar_customer;
GO
