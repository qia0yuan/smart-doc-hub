import { Component } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-doc-management',
    imports: [TableModule, ButtonModule],
    templateUrl: './doc-management.component.html',
    styleUrl: './doc-management.component.scss',
})
export class DocManagementComponent {
    products!: any[];
    selectedProducts!: any;

    ngOnInit() {
        this.products = [
            {
                id: '1000',
                name: 'August_statement_2021.pdf',
                description: 'Bank statement for the month of August 2021.',
                category: 'Banking',
                date: '08/01/2021',
            },
            {
                id: '1001',
                name: 'Sept_statement_2021.pdf',
                description: 'Bank statement for the month of Sept 2021.',
                category: 'Banking',
                date: '09/01/2021',
            },
            {
                id: '1002',
                name: 'Oct_statement.pdf',
                description: 'Bank statement for the month of Sept 2021.',
                category: 'Banking',
                date: '09/01/2021',
            },
        ];
    }
}
