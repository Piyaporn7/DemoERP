/* =====================================================================
   AUTO-GENERATED TEMPLATE: vendor_master.csv
   Staging Table   : dbo.stg_vendor
   Production Table: dbo.ap_vendor
   Upsert Key      : v_en_do_r_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_vendor', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_vendor (
    [VendorCode] NVARCHAR(4000) NULL,
    [VendorName] NVARCHAR(4000) NULL,
    [VendorType] NVARCHAR(4000) NULL,
    [TaxID] NVARCHAR(4000) NULL,
    [Address] NVARCHAR(4000) NULL,
    [ContactName] NVARCHAR(4000) NULL,
    [PhoneEmail] NVARCHAR(4000) NULL,
    [PaymentTerm] NVARCHAR(4000) NULL,
    [CreditLimit] NVARCHAR(4000) NULL,
    [Currency] NVARCHAR(4000) NULL,
    [TaxType] NVARCHAR(4000) NULL,
    [WithholdingTax] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_vendor;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_vendor
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\vendor_master.csv'
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

MERGE dbo.ap_vendor AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([VendorCode])), '') AS [v_en_do_rc_od_e],
    NULLIF(LTRIM(RTRIM([VendorName])), '') AS [v_en_do_rn_am_e],
    NULLIF(LTRIM(RTRIM([VendorType])), '') AS [v_en_do_rt_yp_e],
    NULLIF(LTRIM(RTRIM([TaxID])), '') AS [t_ax_id],
    NULLIF(LTRIM(RTRIM([Address])), '') AS [a_dd_re_ss],
    NULLIF(LTRIM(RTRIM([ContactName])), '') AS [c_on_ta_ct_na_me],
    NULLIF(LTRIM(RTRIM([PhoneEmail])), '') AS [p_ho_ne_em_ai_l],
    NULLIF(LTRIM(RTRIM([PaymentTerm])), '') AS [p_ay_me_nt_te_rm],
    NULLIF(LTRIM(RTRIM([CreditLimit])), '') AS [c_re_di_tl_im_it],
    NULLIF(LTRIM(RTRIM([Currency])), '') AS [c_ur_re_nc_y],
    NULLIF(LTRIM(RTRIM([TaxType])), '') AS [t_ax_ty_pe],
    NULLIF(LTRIM(RTRIM([WithholdingTax])), '') AS [w_it_hh_ol_di_ng_ta_x],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_vendor
) AS src
ON tgt.[v_en_do_r_c_od_e] = src.[v_en_do_r_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[v_en_do_rc_od_e] = src.[v_en_do_rc_od_e],
    tgt.[v_en_do_rn_am_e] = src.[v_en_do_rn_am_e],
    tgt.[v_en_do_rt_yp_e] = src.[v_en_do_rt_yp_e],
    tgt.[t_ax_id] = src.[t_ax_id],
    tgt.[a_dd_re_ss] = src.[a_dd_re_ss],
    tgt.[c_on_ta_ct_na_me] = src.[c_on_ta_ct_na_me],
    tgt.[p_ho_ne_em_ai_l] = src.[p_ho_ne_em_ai_l],
    tgt.[p_ay_me_nt_te_rm] = src.[p_ay_me_nt_te_rm],
    tgt.[c_re_di_tl_im_it] = src.[c_re_di_tl_im_it],
    tgt.[c_ur_re_nc_y] = src.[c_ur_re_nc_y],
    tgt.[t_ax_ty_pe] = src.[t_ax_ty_pe],
    tgt.[w_it_hh_ol_di_ng_ta_x] = src.[w_it_hh_ol_di_ng_ta_x],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [v_en_do_rc_od_e], [v_en_do_rn_am_e], [v_en_do_rt_yp_e], [t_ax_id], [a_dd_re_ss], [c_on_ta_ct_na_me], [p_ho_ne_em_ai_l], [p_ay_me_nt_te_rm], [c_re_di_tl_im_it], [c_ur_re_nc_y], [t_ax_ty_pe], [w_it_hh_ol_di_ng_ta_x], [s_ta_tu_s]
  )
  VALUES (
    src.[v_en_do_rc_od_e], src.[v_en_do_rn_am_e], src.[v_en_do_rt_yp_e], src.[t_ax_id], src.[a_dd_re_ss], src.[c_on_ta_ct_na_me], src.[p_ho_ne_em_ai_l], src.[p_ay_me_nt_te_rm], src.[c_re_di_tl_im_it], src.[c_ur_re_nc_y], src.[t_ax_ty_pe], src.[w_it_hh_ol_di_ng_ta_x], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_vendor;
SELECT COUNT(*) AS target_rows FROM dbo.ap_vendor;
GO
