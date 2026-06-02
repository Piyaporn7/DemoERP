param(
    [string]$BaseDir = "c:\MyProject\Github\DemoERP-source\sample-data\master-data",
    [string]$MappingFile = "c:\MyProject\Github\DemoERP-source\sample-data\master-data\import-kit\table_mapping_template.csv",
    [string]$OutputDir = "c:\MyProject\Github\DemoERP-source\sample-data\master-data\import-kit\sqlserver-generated"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Convert-ToSnakeCase {
    param([string]$InputText)

    if ([string]::IsNullOrWhiteSpace($InputText)) {
        return $InputText
    }

    $s = $InputText -replace '([a-z0-9])([A-Z])', '$1_$2'
    $s = $s -replace '[^A-Za-z0-9]+', '_'
    $s = $s -replace '_+', '_'
    $s = $s.Trim('_')
    return $s.ToLowerInvariant()
}

function Get-CsvHeaders {
    param([string]$CsvPath)

    $firstLine = Get-Content -Path $CsvPath -TotalCount 1 -Encoding UTF8
    if ([string]::IsNullOrWhiteSpace($firstLine)) {
        throw "CSV header not found: $CsvPath"
    }

    return $firstLine.Split(',') | ForEach-Object { $_.Trim() }
}

if (-not (Test-Path $MappingFile)) {
    throw "Mapping file not found: $MappingFile"
}

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$rows = Import-Csv -Path $MappingFile -Encoding UTF8
if (-not $rows -or $rows.Count -eq 0) {
    throw "No mapping rows found in $MappingFile"
}

$manifest = New-Object System.Collections.Generic.List[string]
$manifest.Add("CsvFile,GeneratedSql,StagingTable,ProductionTable,UpsertKey")

foreach ($row in $rows) {
    $csvFile = $row.CsvFile
    $stagingTable = $row.StagingTable
    $productionTable = $row.ProductionTable
    $upsertKey = $row.UpsertKey

    if ([string]::IsNullOrWhiteSpace($csvFile) -or [string]::IsNullOrWhiteSpace($stagingTable) -or [string]::IsNullOrWhiteSpace($productionTable)) {
        Write-Warning "Skip invalid mapping row: $($row | ConvertTo-Json -Compress)"
        continue
    }

    $csvPath = Join-Path $BaseDir $csvFile
    if (-not (Test-Path $csvPath)) {
        Write-Warning "CSV not found, skip: $csvPath"
        continue
    }

    $headers = Get-CsvHeaders -CsvPath $csvPath
    $targetColumns = @($headers | ForEach-Object { Convert-ToSnakeCase $_ })

    $keyParts = @()
    if (-not [string]::IsNullOrWhiteSpace($upsertKey)) {
        $keyParts = @($upsertKey.Split('+') | ForEach-Object { Convert-ToSnakeCase($_.Trim()) })
    }
    if ($keyParts.Count -eq 0) {
        $keyParts = @($targetColumns[0])
    }

    $createCols = $headers | ForEach-Object { "    [{0}] NVARCHAR(4000) NULL" -f $_ }
    $selectCols = for ($i = 0; $i -lt $headers.Count; $i++) {
        "    NULLIF(LTRIM(RTRIM([{0}])), '') AS [{1}]" -f $headers[$i], $targetColumns[$i]
    }

    $onLines = $keyParts | ForEach-Object { "tgt.[{0}] = src.[{0}]" -f $_ }
    $onClause = [string]::Join("`r`n    AND ", $onLines)

    $updateCols = @()
    foreach ($col in $targetColumns) {
        if ($keyParts -notcontains $col) {
            $updateCols += "    tgt.[{0}] = src.[{0}]" -f $col
        }
    }

    $insertCols = $targetColumns | ForEach-Object { "[{0}]" -f $_ }
    $insertVals = $targetColumns | ForEach-Object { "src.[{0}]" -f $_ }

    $csvPathForSql = $csvPath.Replace("\", "\\")

    $sql = @"
/* =====================================================================
   AUTO-GENERATED TEMPLATE: $csvFile
   Staging Table   : dbo.$stagingTable
   Production Table: dbo.$productionTable
   Upsert Key      : $($keyParts -join ', ')

   NOTE:
   - Review and adjust data types/transform rules for real schema.
   - If your target columns differ, update SELECT aliases and MERGE clauses.
======================================================================== */

IF OBJECT_ID('dbo.$stagingTable', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.$stagingTable (
$($createCols -join ",`r`n")
  );
END;
GO

TRUNCATE TABLE dbo.$stagingTable;
GO

/* Uncomment and run after adjusting local path/permissions
BULK INSERT dbo.$stagingTable
FROM '$csvPathForSql'
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

MERGE dbo.$productionTable AS tgt
USING (
  SELECT
$($selectCols -join ",`r`n")
  FROM dbo.$stagingTable
) AS src
ON $onClause
WHEN MATCHED THEN
  UPDATE SET
$($updateCols -join ",`r`n")
WHEN NOT MATCHED BY TARGET THEN
  INSERT (
    $($insertCols -join ", ")
  )
  VALUES (
    $($insertVals -join ", ")
  );
GO

SELECT COUNT(*) AS staging_rows FROM dbo.$stagingTable;
SELECT COUNT(*) AS target_rows FROM dbo.$productionTable;
GO
"@

    $sqlName = [System.IO.Path]::GetFileNameWithoutExtension($csvFile) + ".sql"
    $sqlPath = Join-Path $OutputDir $sqlName
    Set-Content -Path $sqlPath -Value $sql -Encoding UTF8

    $manifest.Add("$csvFile,$sqlName,$stagingTable,$productionTable,$upsertKey")
}

$manifestPath = Join-Path $OutputDir "_manifest.csv"
Set-Content -Path $manifestPath -Value ($manifest -join "`r`n") -Encoding UTF8

Write-Output "Generated SQL scripts in: $OutputDir"
Write-Output "Manifest: $manifestPath"
