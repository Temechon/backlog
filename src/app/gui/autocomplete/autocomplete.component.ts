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
  @Input() placeholder: string = ""

  @Output() selectItem = new EventEmitter<T>();
  @Output() newItem = new EventEmitter<string>();

  searchTerm: string = '';
  filteredItems: T[] = [];
  showAddOption: boolean = false;

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
      this.showAddOption = this.filteredItems.length === 0;
    }
  }

  onItemSelect(item: T) {
    console.log("item selected", item.name);

    this.selectItem.emit(item);
    this.searchTerm = "";
    this.filteredItems = [];
    this.showAddOption = false;
  }

  addNewItem() {

    const term = this.searchTerm.charAt(0).toUpperCase() + this.searchTerm.slice(1).toLowerCase();
    this.newItem.emit(term);
    this.searchTerm = "";
    this.filteredItems = [];
    this.showAddOption = false;
  }

  onFocus() {
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.showAddOption = true

  }

  onBlur() {
    // set timeout required to fire click event
    setTimeout(() => {
      this.filteredItems = [];
      this.showAddOption = false;
    }, 100);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // If filtereditem contains only one choice, returns it
      if (this.filteredItems.length === 1) {
        return this.onItemSelect(this.filteredItems[0]);
      }
      const matchingItem = this.items.find(item => item.name.toLowerCase() === this.searchTerm.toLowerCase());
      if (!matchingItem) {
        this.addNewItem();
        this.filteredItems = [];
      }
    }
  }

}
