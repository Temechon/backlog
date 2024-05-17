import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'autocomplete',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss'
})
export class AutocompleteComponent<T extends { name: string }> implements OnChanges {

  @Input() items: T[] = [];
  @Output() selectItem = new EventEmitter<T>();

  searchTerm: string = '';
  filteredItems: T[] = [];

  ngOnInit() {
    this.items.sort((a, b) => a.name.localeCompare(b.name));
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['items'] && changes['items'].currentValue) {
      this.items.sort((a, b) => a.name.localeCompare(b.name));
      // this.filteredItems = [...this.items];
      // console.log(this.items);
    }
  }

  onSearchTermChange() {
    if (this.searchTerm === '') {
      this.filteredItems = [];
    } else {
      this.filteredItems = this.items.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onItemSelect(item: T) {
    console.log("item selected", item.name);

    this.selectItem.emit(item);
    this.searchTerm = "";
    this.filteredItems = [];
  }

  onFocus() {
    this.filteredItems = [...this.items];
  }

  onBlur() {
    // set timeout required to fire click event
    setTimeout(() => {
      this.filteredItems = [];
    }, 100);
  }

}
