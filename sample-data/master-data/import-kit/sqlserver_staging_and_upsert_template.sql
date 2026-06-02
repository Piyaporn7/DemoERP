/*
  SQL Server template: load vendor_master.csv into staging and upsert to production.
  Adjust schema/table/column names based on your real system.
*/

/* 1) Staging table */
IF OBJECT_ID('dbo.stg_vendor', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.stg_vendor (
    VendorCode NVARCHAR(50),
    VendorName NVARCHAR(255),
    VendorType NVARCHAR(100),
    TaxID NVARCHAR(50),
    Address NVARCHAR(500),
    ContactName NVARCHAR(255),
    PhoneEmail NVARCHAR(255),
    PaymentTerm NVARCHAR(50),
    CreditLimit NVARCHAR(50),
    Currency NVARCHAR(20),
    TaxType NVARCHAR(50),
    WithholdingTax NVARCHAR(50),
    Status NVARCHAR(20)
  );
END;
GO

/* 2) Optional clear staging before reload */
TRUNCATE TABLE dbo.stg_vendor;
GO

/* 3) Bulk load CSV (update path to your local file)
BULK INSERT dbo.stg_vendor
FROM 'C:\\MyProject\\Github\\DemoERP-source\\sample-data\\master-data\\vendor_master.csv'
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

/* 4) Upsert into production table (example: dbo.ap_vendor) */
MERGE dbo.ap_vendor AS tgt
USING (
  SELECT
    UPPER(LTRIM(RTRIM(VendorCode))) AS vendor_code,
    LTRIM(RTRIM(VendorName)) AS vendor_name,
    LTRIM(RTRIM(VendorType)) AS vendor_type,
    REPLACE(LTRIM(RTRIM(TaxID)), '-', '') AS tax_id,
    LTRIM(RTRIM(Address)) AS address_line,
    LTRIM(RTRIM(ContactName)) AS contact_name,
    LTRIM(RTRIM(PhoneEmail)) AS contact_raw,
    UPPER(LTRIM(RTRIM(PaymentTerm))) AS payment_term_code,
    TRY_CAST(CreditLimit AS DECIMAL(18,2)) AS credit_limit,
    UPPER(LTRIM(RTRIM(Currency))) AS currency_code,
    UPPER(LTRIM(RTRIM(TaxType))) AS tax_code,
    NULLIF(UPPER(LTRIM(RTRIM(WithholdingTax))), '-') AS wht_code,
    CASE WHEN Status = 'Active' THEN 1 ELSE 0 END AS status_flag
  FROM dbo.stg_vendor
) AS src
ON tgt.vendor_code = src.vendor_code
WHEN MATCHED THEN
  UPDATE SET
    tgt.vendor_name = src.vendor_name,
    tgt.vendor_type = src.vendor_type,
    tgt.tax_id = src.tax_id,
    tgt.address_line = src.address_line,
    tgt.contact_name = src.contact_name,
    tgt.contact_raw = src.contact_raw,
    tgt.payment_term_code = src.payment_term_code,
    tgt.credit_limit = src.credit_limit,
    tgt.currency_code = src.currency_code,
    tgt.tax_code = src.tax_code,
    tgt.wht_code = src.wht_code,
    tgt.status_flag = src.status_flag,
    tgt.updated_at = SYSUTCDATETIME()
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    vendor_code,
    vendor_name,
    vendor_type,
    tax_id,
    address_line,
    contact_name,
    contact_raw,
    payment_term_code,
    credit_limit,
    currency_code,
    tax_code,
    wht_code,
    status_flag,
    created_at,
    updated_at
  )
  VALUES (
    src.vendor_code,
    src.vendor_name,
    src.vendor_type,
    src.tax_id,
    src.address_line,
    src.contact_name,
    src.contact_raw,
    src.payment_term_code,
    src.credit_limit,
    src.currency_code,
    src.tax_code,
    src.wht_code,
    src.status_flag,
    SYSUTCDATETIME(),
    SYSUTCDATETIME()
  );
GO

/* 5) Post-check */
SELECT COUNT(*) AS stg_vendor_rows FROM dbo.stg_vendor;
SELECT COUNT(*) AS ap_vendor_rows FROM dbo.ap_vendor;
SELECT vendor_code, COUNT(*) AS dup_count
FROM dbo.ap_vendor
GROUP BY vendor_code
HAVING COUNT(*) > 1;
GO
