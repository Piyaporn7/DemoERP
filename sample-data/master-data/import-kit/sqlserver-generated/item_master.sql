/* =====================================================================
   AUTO-GENERATED TEMPLATE: item_master.csv
   Staging Table   : dbo.stg_item
   Production Table: dbo.inv_item
   Upsert Key      : i_te_m_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_item', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_item (
    [ItemCode] NVARCHAR(4000) NULL,
    [ItemName] NVARCHAR(4000) NULL,
    [ItemType] NVARCHAR(4000) NULL,
    [ItemGroup] NVARCHAR(4000) NULL,
    [Unit] NVARCHAR(4000) NULL,
    [CostPrice] NVARCHAR(4000) NULL,
    [SellingPrice] NVARCHAR(4000) NULL,
    [MinStock] NVARCHAR(4000) NULL,
    [MaxStock] NVARCHAR(4000) NULL,
    [ReorderPoint] NVARCHAR(4000) NULL,
    [WarehouseDefault] NVARCHAR(4000) NULL,
    [ShelfLocation] NVARCHAR(4000) NULL,
    [BarcodeOrQRCode] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_item;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_item
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\item_master.csv'
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

MERGE dbo.inv_item AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([ItemCode])), '') AS [i_te_mc_od_e],
    NULLIF(LTRIM(RTRIM([ItemName])), '') AS [i_te_mn_am_e],
    NULLIF(LTRIM(RTRIM([ItemType])), '') AS [i_te_mt_yp_e],
    NULLIF(LTRIM(RTRIM([ItemGroup])), '') AS [i_te_mg_ro_up],
    NULLIF(LTRIM(RTRIM([Unit])), '') AS [u_ni_t],
    NULLIF(LTRIM(RTRIM([CostPrice])), '') AS [c_os_tp_ri_ce],
    NULLIF(LTRIM(RTRIM([SellingPrice])), '') AS [s_el_li_ng_pr_ic_e],
    NULLIF(LTRIM(RTRIM([MinStock])), '') AS [m_in_st_oc_k],
    NULLIF(LTRIM(RTRIM([MaxStock])), '') AS [m_ax_st_oc_k],
    NULLIF(LTRIM(RTRIM([ReorderPoint])), '') AS [r_eo_rd_er_po_in_t],
    NULLIF(LTRIM(RTRIM([WarehouseDefault])), '') AS [w_ar_eh_ou_se_de_fa_ul_t],
    NULLIF(LTRIM(RTRIM([ShelfLocation])), '') AS [s_he_lf_lo_ca_ti_on],
    NULLIF(LTRIM(RTRIM([BarcodeOrQRCode])), '') AS [b_ar_co_de_or_qr_co_de],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_item
) AS src
ON tgt.[i_te_m_c_od_e] = src.[i_te_m_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[i_te_mc_od_e] = src.[i_te_mc_od_e],
    tgt.[i_te_mn_am_e] = src.[i_te_mn_am_e],
    tgt.[i_te_mt_yp_e] = src.[i_te_mt_yp_e],
    tgt.[i_te_mg_ro_up] = src.[i_te_mg_ro_up],
    tgt.[u_ni_t] = src.[u_ni_t],
    tgt.[c_os_tp_ri_ce] = src.[c_os_tp_ri_ce],
    tgt.[s_el_li_ng_pr_ic_e] = src.[s_el_li_ng_pr_ic_e],
    tgt.[m_in_st_oc_k] = src.[m_in_st_oc_k],
    tgt.[m_ax_st_oc_k] = src.[m_ax_st_oc_k],
    tgt.[r_eo_rd_er_po_in_t] = src.[r_eo_rd_er_po_in_t],
    tgt.[w_ar_eh_ou_se_de_fa_ul_t] = src.[w_ar_eh_ou_se_de_fa_ul_t],
    tgt.[s_he_lf_lo_ca_ti_on] = src.[s_he_lf_lo_ca_ti_on],
    tgt.[b_ar_co_de_or_qr_co_de] = src.[b_ar_co_de_or_qr_co_de],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [i_te_mc_od_e], [i_te_mn_am_e], [i_te_mt_yp_e], [i_te_mg_ro_up], [u_ni_t], [c_os_tp_ri_ce], [s_el_li_ng_pr_ic_e], [m_in_st_oc_k], [m_ax_st_oc_k], [r_eo_rd_er_po_in_t], [w_ar_eh_ou_se_de_fa_ul_t], [s_he_lf_lo_ca_ti_on], [b_ar_co_de_or_qr_co_de], [s_ta_tu_s]
  )
  VALUES (
    src.[i_te_mc_od_e], src.[i_te_mn_am_e], src.[i_te_mt_yp_e], src.[i_te_mg_ro_up], src.[u_ni_t], src.[c_os_tp_ri_ce], src.[s_el_li_ng_pr_ic_e], src.[m_in_st_oc_k], src.[m_ax_st_oc_k], src.[r_eo_rd_er_po_in_t], src.[w_ar_eh_ou_se_de_fa_ul_t], src.[s_he_lf_lo_ca_ti_on], src.[b_ar_co_de_or_qr_co_de], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_item;
SELECT COUNT(*) AS target_rows FROM dbo.inv_item;
GO
