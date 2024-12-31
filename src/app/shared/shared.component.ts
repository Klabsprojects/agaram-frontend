import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrl: './shared.component.css'
})
export class SharedComponent implements OnInit {

  private componentName: string='';

  constructor(private route: ActivatedRoute) {}
  

  ngOnInit(): void {
    this.componentName = this.route.snapshot.data['componentName'];
    // console.log(this.componentName);
  }

  exportChange(data: any) {
    const value = data.target.value;
    const table = document.getElementById('table-to-export');

    if (!table) {
        console.error("Table element not found.");
        return;
    }

    function hideColumn(columnName: string): number {
        if (table) {
            const ths = table.querySelectorAll('th');
            const tds = table.querySelectorAll('td');

            let columnIndex = -1;
            ths.forEach((th, index) => {
                if (th.textContent && th.textContent.trim() === columnName) {
                    columnIndex = index;
                }
            });

            if (columnIndex >= 0) {
                ths[columnIndex].style.display = 'none';
                tds.forEach(td => {
                    if (td.cellIndex === columnIndex) {
                        td.style.display = 'none';
                    }
                });
            }

            return columnIndex;
        }
        return -1;
    }

    function restoreColumn(columnIndex: number) {
        if (columnIndex >= 0 && table) {
            const ths = table.querySelectorAll('th');
            const tds = table.querySelectorAll('td');
            ths[columnIndex].style.display = '';
            tds.forEach(td => {
                if (td.cellIndex === columnIndex) {
                    td.style.display = '';
                }
            });
        }
    }

    function getFormattedDateTime(): string {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    }

    if (value === "PDF") {
        const actionColumnIndex = hideColumn("Action");

        const margin = 10;
        table.style.borderCollapse = 'separate';
        table.style.borderSpacing = '0';
        table.querySelectorAll('td, th').forEach((cell: any) => {
            cell.style.padding = '10px';
        });

        html2canvas(table, {
            backgroundColor: 'white',
        }).then(canvas => {
            const imgWidth = 208 - 2 * margin;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const doc = new jsPDF('p', 'mm', 'a4');
            const positionX = margin;
            const positionY = margin;

            doc.addImage(canvas.toDataURL('image/png'), 'PNG', positionX, positionY, imgWidth, imgHeight);

            const formattedDateTime = getFormattedDateTime();
            const filename = `${this.componentName}-${formattedDateTime}.pdf`;
            doc.save(filename);

            restoreColumn(actionColumnIndex);
            table.querySelectorAll('td, th').forEach((cell: any) => {
                cell.style.padding = '';
            });
        });
    } else if (value === "Excel") {
        const actionColumnIndex = hideColumn("Action");

        const ws = XLSX.utils.table_to_sheet(table);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        if (actionColumnIndex >= 0) {
            const columnLetter = XLSX.utils.encode_col(actionColumnIndex);
            delete ws[columnLetter + '1'];
            Object.keys(ws).forEach(cellAddress => {
                if (cellAddress.startsWith(columnLetter)) {
                    delete ws[cellAddress];
                }
            });
        }

        const formattedDateTime = getFormattedDateTime();
        const filename = `${this.componentName}-${formattedDateTime}.xlsx`;
        XLSX.writeFile(wb, filename);

        restoreColumn(actionColumnIndex);
    } else if (value === "Word") {
        const actionColumnIndex = hideColumn("Action");

        const htmlContent = table.outerHTML;
        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);

        const formattedDateTime = getFormattedDateTime();
        const filename = `${this.componentName}-${formattedDateTime}.doc`;

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        restoreColumn(actionColumnIndex);
    }
}

}
