/* =====================================================================
   AUTO-GENERATED TEMPLATE: price_list_master.csv
   Staging Table   : dbo.stg_price_list
   Production Table: dbo.so_price_list
   Upsert Key      : p_ri_ce_l_is_t_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_price_list', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_price_list (
    [PriceListCode] NVARCHAR(4000) NULL,
    [PriceListName] NVARCHAR(4000) NULL,
    [Currency] NVARCHAR(4000) NULL,
    [EffectiveDate] NVARCHAR(4000) NULL,
    [Description] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_price_list;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_price_list
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\price_list_master.csv'
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

MERGE dbo.so_price_list AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([PriceListCode])), '') AS [p_ri_ce_li_st_co_de],
    NULLIF(LTRIM(RTRIM([PriceListName])), '') AS [p_ri_ce_li_st_na_me],
    NULLIF(LTRIM(RTRIM([Currency])), '') AS [c_ur_re_nc_y],
    NULLIF(LTRIM(RTRIM([EffectiveDate])), '') AS [e_ff_ec_ti_ve_da_te],
    NULLIF(LTRIM(RTRIM([Description])), '') AS [d_es_cr_ip_ti_on],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_price_list
) AS src
ON tgt.[p_ri_ce_l_is_t_c_od_e] = src.[p_ri_ce_l_is_t_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[p_ri_ce_li_st_co_de] = src.[p_ri_ce_li_st_co_de],
    tgt.[p_ri_ce_li_st_na_me] = src.[p_ri_ce_li_st_na_me],
    tgt.[c_ur_re_nc_y] = src.[c_ur_re_nc_y],
    tgt.[e_ff_ec_ti_ve_da_te] = src.[e_ff_ec_ti_ve_da_te],
    tgt.[d_es_cr_ip_ti_on] = src.[d_es_cr_ip_ti_on],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [p_ri_ce_li_st_co_de], [p_ri_ce_li_st_na_me], [c_ur_re_nc_y], [e_ff_ec_ti_ve_da_te], [d_es_cr_ip_ti_on], [s_ta_tu_s]
  )
  VALUES (
    src.[p_ri_ce_li_st_co_de], src.[p_ri_ce_li_st_na_me], src.[c_ur_re_nc_y], src.[e_ff_ec_ti_ve_da_te], src.[d_es_cr_ip_ti_on], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_price_list;
SELECT COUNT(*) AS target_rows FROM dbo.so_price_list;
GO
