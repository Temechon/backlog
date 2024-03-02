import { Component, Input } from '@angular/core';
import { DialogRef } from './dialog.model';

@Component({
    template: '',
})

export abstract class DialogComponent {
    @Input() data: any;
    dialogRef: DialogRef<DialogComponent>;

    constructor() {

    }

    close(param?: any) {
        this.dialogRef.close(param)
    }
}