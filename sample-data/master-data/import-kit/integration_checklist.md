# Integration Checklist to Real Tables

1. Confirm target database engine: SQL Server, PostgreSQL, or MySQL.
2. Fill table mapping in table_mapping_template.csv with real table names.
3. Create staging tables with same columns as CSV headers (all text first).
4. Load CSV into staging tables.
5. Add transform rules for type conversion and code normalization.
6. Run upsert from staging to production tables using business keys.
7. Validate row count and duplicate keys.
8. Enable foreign key checks after parent tables load successfully.

## Recommended Load Order
1. unit_master.csv
2. currency_master.csv
3. tax_master.csv
4. withholding_tax_master.csv
5. payment_term_master.csv
6. vendor_group_master.csv
7. customer_group_master.csv
8. warehouse_master.csv
9. location_master.csv
10. department_master.csv
11. cost_center_master.csv
12. item_master.csv
13. price_list_master.csv
14. chart_of_account_master.csv
15. vendor_master.csv
16. customer_master.csv
17. work_center_master.csv
18. machine_master.csv
19. resource_master.csv
20. bom_header_master.csv
21. bom_detail_master.csv

## Validation SQL Template
Use this pattern per table after import:

SELECT COUNT(*) AS row_count FROM stg_vendor;
SELECT vendor_code, COUNT(*)
FROM ap_vendor
GROUP BY vendor_code
HAVING COUNT(*) > 1;
