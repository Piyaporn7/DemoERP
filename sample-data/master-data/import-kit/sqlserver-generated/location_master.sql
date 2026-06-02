/* =====================================================================
   AUTO-GENERATED TEMPLATE: location_master.csv
   Staging Table   : dbo.stg_location
   Production Table: dbo.inv_location
   Upsert Key      : l_oc_at_io_n_c_od_e

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.stg_location', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_location (
    [LocationCode] NVARCHAR(4000) NULL,
    [LocationName] NVARCHAR(4000) NULL,
    [Warehouse] NVARCHAR(4000) NULL,
    [Zone] NVARCHAR(4000) NULL,
    [Shelf] NVARCHAR(4000) NULL,
    [Bin] NVARCHAR(4000) NULL,
    [Status] NVARCHAR(4000) NULL
  );
END;
GO

TRUNCATE TABLE dbo.stg_location;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.stg_location
FROM 'c:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\location_master.csv'
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

MERGE dbo.inv_location AS tgt
USING (
  SELECT
    NULLIF(LTRIM(RTRIM([LocationCode])), '') AS [l_oc_at_io_nc_od_e],
    NULLIF(LTRIM(RTRIM([LocationName])), '') AS [l_oc_at_io_nn_am_e],
    NULLIF(LTRIM(RTRIM([Warehouse])), '') AS [w_ar_eh_ou_se],
    NULLIF(LTRIM(RTRIM([Zone])), '') AS [z_on_e],
    NULLIF(LTRIM(RTRIM([Shelf])), '') AS [s_he_lf],
    NULLIF(LTRIM(RTRIM([Bin])), '') AS [b_in],
    NULLIF(LTRIM(RTRIM([Status])), '') AS [s_ta_tu_s]
  FROM dbo.stg_location
) AS src
ON tgt.[l_oc_at_io_n_c_od_e] = src.[l_oc_at_io_n_c_od_e]
WHEN MATCHED THEN
  UPDATE SET
    tgt.[l_oc_at_io_nc_od_e] = src.[l_oc_at_io_nc_od_e],
    tgt.[l_oc_at_io_nn_am_e] = src.[l_oc_at_io_nn_am_e],
    tgt.[w_ar_eh_ou_se] = src.[w_ar_eh_ou_se],
    tgt.[z_on_e] = src.[z_on_e],
    tgt.[s_he_lf] = src.[s_he_lf],
    tgt.[b_in] = src.[b_in],
    tgt.[s_ta_tu_s] = src.[s_ta_tu_s]
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    [l_oc_at_io_nc_od_e], [l_oc_at_io_nn_am_e], [w_ar_eh_ou_se], [z_on_e], [s_he_lf], [b_in], [s_ta_tu_s]
  )
  VALUES (
    src.[l_oc_at_io_nc_od_e], src.[l_oc_at_io_nn_am_e], src.[w_ar_eh_ou_se], src.[z_on_e], src.[s_he_lf], src.[b_in], src.[s_ta_tu_s]
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.stg_location;
SELECT COUNT(*) AS target_rows FROM dbo.inv_location;
GO
