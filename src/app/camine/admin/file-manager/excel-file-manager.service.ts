import { Injectable } from "@angular/core";
import { FileManagerService } from "./file-manager.service";
import { saveAs } from 'file-saver';
import { WorkSheet, WorkBook, utils, write } from "xlsx";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelFileManagerService implements FileManagerService {
  public exportFile(data: any[][], fileName: string): void {

    let sheets: { [sheet: string]: WorkSheet } = {};
    const sheetNames: string[] = [];

    data.forEach((entity, index) => {
      const sheetName = 'sheet_' + index;

      sheetNames.push(sheetName);

      const worksheet: WorkSheet = utils.json_to_sheet(entity);

      sheets[sheetName] = worksheet;
    });

    const workbook: WorkBook = { Sheets: sheets, SheetNames: sheetNames };
    const excelBuffer: any = write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });

    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
