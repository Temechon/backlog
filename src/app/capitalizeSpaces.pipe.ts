import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalizeSpaces',
    standalone: true
})
export class CapitalizeSpacesPipe implements PipeTransform {

    transform(value: string): string {
        if (!value) {
            return '';
        }

        // Ajouter un espace avant chaque lettre majuscule
        let newValue = value.replace(/([A-Z])/g, ' $1');

        // Supprimer l'espace initial s'il y en a un
        newValue = newValue.trim();

        // Transformer la première lettre en majuscule
        newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);

        return newValue;
    }

}