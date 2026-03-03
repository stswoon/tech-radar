import {type Worksheet, type CellValue } from 'exceljs';

export function sheetToJson<T>(worksheet: Worksheet): T[] {
    const headers: string[] = [];
    worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber] = String(cell.value);
    });

    const data: T[] = [];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) { //skip headers
            const rowData: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
            let hasData = false;
            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber];
                if (header) {
                    let val: CellValue = cell.value;
                    // Handle rich text and formulas
                    if (val && typeof val === 'object') {
                        if ('richText' in val && val.richText) {
                            val = val.richText.map(t => t.text).join('');
                        } else if ('text' in val && val.text) {
                            val = val.text;
                        } else if ('result' in val && val.result !== undefined) {
                            val = val.result;
                        }
                    }
                    rowData[header] = val;
                    hasData = true;
                }
            });
            if (hasData) {
                data.push(rowData as T);
            }
        }
    });
    return data;
}