-- PostgreSQL template: vendor import from CSV to staging and upsert to production

CREATE TABLE IF NOT EXISTS stg_vendor (
  VendorCode TEXT,
  VendorName TEXT,
  VendorType TEXT,
  TaxID TEXT,
  Address TEXT,
  ContactName TEXT,
  PhoneEmail TEXT,
  PaymentTerm TEXT,
  CreditLimit TEXT,
  Currency TEXT,
  TaxType TEXT,
  WithholdingTax TEXT,
  Status TEXT
);

TRUNCATE TABLE stg_vendor;

-- Use psql client command (run outside SQL editor)
-- \copy stg_vendor FROM 'sample-data/master-data/vendor_master.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');

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
  NULLIF(TRIM(CreditLimit), '')::NUMERIC(18,2) AS credit_limit,
  UPPER(TRIM(Currency)) AS currency_code,
  UPPER(TRIM(TaxType)) AS tax_code,
  NULLIF(UPPER(TRIM(WithholdingTax)), '-') AS wht_code,
  CASE WHEN Status = 'Active' THEN 1 ELSE 0 END AS status_flag,
  NOW() AS created_at,
  NOW() AS updated_at
FROM stg_vendor
ON CONFLICT (vendor_code)
DO UPDATE SET
  vendor_name = EXCLUDED.vendor_name,
  vendor_type = EXCLUDED.vendor_type,
  tax_id = EXCLUDED.tax_id,
  address_line = EXCLUDED.address_line,
  contact_name = EXCLUDED.contact_name,
  contact_raw = EXCLUDED.contact_raw,
  payment_term_code = EXCLUDED.payment_term_code,
  credit_limit = EXCLUDED.credit_limit,
  currency_code = EXCLUDED.currency_code,
  tax_code = EXCLUDED.tax_code,
  wht_code = EXCLUDED.wht_code,
  status_flag = EXCLUDED.status_flag,
  updated_at = NOW();

SELECT COUNT(*) AS stg_vendor_rows FROM stg_vendor;
SELECT COUNT(*) AS ap_vendor_rows FROM ap_vendor;
