-- MySQL template: vendor import from CSV to staging and upsert to production

CREATE TABLE IF NOT EXISTS stg_vendor (
  VendorCode VARCHAR(50),
  VendorName VARCHAR(255),
  VendorType VARCHAR(100),
  TaxID VARCHAR(50),
  Address VARCHAR(500),
  ContactName VARCHAR(255),
  PhoneEmail VARCHAR(255),
  PaymentTerm VARCHAR(50),
  CreditLimit VARCHAR(50),
  Currency VARCHAR(20),
  TaxType VARCHAR(50),
  WithholdingTax VARCHAR(50),
  Status VARCHAR(20)
);

TRUNCATE TABLE stg_vendor;

-- Enable local infile if needed
-- SET GLOBAL local_infile = 1;

-- Adjust file path and permission to server location
-- LOAD DATA LOCAL INFILE 'C:/MyProject/Github/DemoERP-source/sample-data/master-data/vendor_master.csv'
-- INTO TABLE stg_vendor
-- FIELDS TERMINATED BY ','
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 LINES;

INSERT INTO ap_vendor (
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
SELECT
  UPPER(TRIM(VendorCode)) AS vendor_code,
  TRIM(VendorName) AS vendor_name,
  TRIM(VendorType) AS vendor_type,
  REPLACE(TRIM(TaxID), '-', '') AS tax_id,
  TRIM(Address) AS address_line,
  TRIM(ContactName) AS contact_name,
  TRIM(PhoneEmail) AS contact_raw,
  UPPER(TRIM(PaymentTerm)) AS payment_term_code,
  CAST(NULLIF(TRIM(CreditLimit), '') AS DECIMAL(18,2)) AS credit_limit,
  UPPER(TRIM(Currency)) AS currency_code,
  UPPER(TRIM(TaxType)) AS tax_code,
  NULLIF(UPPER(TRIM(WithholdingTax)), '-') AS wht_code,
  CASE WHEN Status = 'Active' THEN 1 ELSE 0 END AS status_flag,
  UTC_TIMESTAMP() AS created_at,
  UTC_TIMESTAMP() AS updated_at
FROM stg_vendor
ON DUPLICATE KEY UPDATE
  vendor_name = VALUES(vendor_name),
  vendor_type = VALUES(vendor_type),
  tax_id = VALUES(tax_id),
  address_line = VALUES(address_line),
  contact_name = VALUES(contact_name),
  contact_raw = VALUES(contact_raw),
  payment_term_code = VALUES(payment_term_code),
  credit_limit = VALUES(credit_limit),
  currency_code = VALUES(currency_code),
  tax_code = VALUES(tax_code),
  wht_code = VALUES(wht_code),
  status_flag = VALUES(status_flag),
  updated_at = UTC_TIMESTAMP();

SELECT COUNT(*) AS stg_vendor_rows FROM stg_vendor;
SELECT COUNT(*) AS ap_vendor_rows FROM ap_vendor;
