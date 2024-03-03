import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'editable-text',
  standalone: true,
  imports: [
    CommonModule, FormsModule],
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss']
})
export class EditableTextComponent implements OnInit, OnDestroy {

  constructor() { }

  @Input()
  text: string;
  @Output()
  textChange: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  custom: string;
  @Input()
  readonly: boolean;


  @Input()
  placeholder: string = "";

  @Output() onFinished: EventEmitter<string> = new EventEmitter();
  @Output() enterPressed: EventEmitter<string> = new EventEmitter();

  saveSub = new Subject<void>();

  ngOnInit(): void {
    this.saveSub.pipe(debounceTime(500)).subscribe(() => {
      this.onFinished.emit(this.text);
    })
  }

  // Do stuff when the enter key is pressed
  onEnter($event: Event) {
    this.enterPressed.emit(this.text);
  }

  onChange($event: Event) {
    this.textChange.emit(this.text)
    this.saveSub.next();
  }

  ngOnDestroy() {
    this.saveSub.complete();
    this.saveSub.unsubscribe();
  }


}
