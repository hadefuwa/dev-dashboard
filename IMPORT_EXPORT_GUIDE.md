# Import/Export Guide for R&D Dashboard

## Overview
The dashboard now supports importing and exporting data in Excel-compatible CSV format, allowing you to manage your project data using Excel or any spreadsheet application.

## Exporting Data

### How to Export:
1. Click the **"Export to Excel"** button in the header
2. A CSV file will be downloaded automatically
3. The file is named: `rd-dashboard-projects-YYYY-MM-DD.csv`

### Excel Format:
The exported CSV includes these columns:
- **ID** - Unique project identifier
- **Name** - Project name
- **Description** - Project description
- **Project Type** - "large" or "small"
- **Status** - "active", "paused", or "completed"
- **Start Date** - Project start date (YYYY-MM-DD format)
- **End Date** - Project end date (YYYY-MM-DD format)
- **Progress (%)** - Completion percentage (0-100)
- **Team Members** - Team members separated by semicolons
- **Notes** - Project notes
- **Milestone 1-5 Name** - Up to 5 milestone names
- **Milestone 1-5 Due Date** - Due dates for each milestone
- **Milestone 1-5 Completed** - "Yes" or "No" for completion status

## Importing Data

### How to Import:
1. Click the **"Import from Excel"** button in the header
2. Select your CSV file (must be .csv format)
3. Review the import summary
4. Confirm to import the data

### File Requirements:
- **Format**: CSV files only (.csv)
- **Headers**: Must match the export format exactly
- **Encoding**: UTF-8 recommended
- **Delimiter**: Comma-separated values

### Data Validation:
The system validates imported data and will:
- ✅ Import valid projects
- ⚠️ Skip rows with errors (with details)
- 🔄 Generate new IDs for imported projects
- 📊 Update all dashboard statistics

## Editing in Excel

### Best Practices:
1. **Keep Headers**: Don't modify the first row (headers)
2. **Date Format**: Use YYYY-MM-DD format for dates
3. **Team Members**: Separate multiple names with semicolons (;)
4. **Progress**: Use numbers 0-100 for progress percentage
5. **Milestones**: Leave empty milestone columns blank
6. **Status Values**: Use exactly "active", "paused", or "completed"

### Example Team Members:
```
Jack; Ben; Maciej
```
```
Abdullah; Paul; Hamed
```

### Example Milestone Completion:
```
Yes    (for completed milestones)
No     (for pending milestones)
```

## Troubleshooting

### Common Issues:

**"Invalid header" error:**
- Ensure the first row contains the exact column headers
- Don't add or remove columns
- Check for extra spaces or typos

**"No valid projects found" error:**
- Verify at least one row has a project name
- Check that required fields are filled
- Ensure dates are in YYYY-MM-DD format

**Import fails silently:**
- Check browser console for detailed error messages
- Verify file is a valid CSV format
- Ensure file is not corrupted

### File Size Limits:
- Recommended: Under 1000 projects
- Maximum: Browser memory dependent
- Large files may cause slow loading

## Workflow Example

### Step 1: Export Current Data
```
1. Click "Export to Excel"
2. Save the CSV file
3. Open in Excel/Google Sheets
```

### Step 2: Edit in Excel
```
1. Update project progress
2. Add new projects
3. Modify team assignments
4. Update milestone dates
5. Save as CSV (keep same format)
```

### Step 3: Import Back
```
1. Click "Import from Excel"
2. Select your edited CSV file
3. Review import summary
4. Confirm to update dashboard
```

## Data Backup

**Important**: Always export your data before making major changes. The import function replaces all existing data.

### Backup Strategy:
1. Export before editing
2. Keep multiple backup versions
3. Test import on a copy first
4. Verify data after import

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your CSV format matches the export format
3. Try importing a small test file first
4. Contact support with specific error messages

---

**Note**: This feature is designed for data management and bulk updates. For individual project changes, use the dashboard's built-in forms.
