export class Ingredient {
    name: string; // Nom de l'ingrédient (par exemple, "Tomate")
    isMeat: boolean; // Indique si l'ingrédient est de la viande
    isSideDish: boolean; // Indique si l'ingrédient peut être utilisé comme accompagnement

    constructor(name: string, isMeat: boolean = false, isSideDish: boolean = false) {
        this.name = name;
        this.isMeat = isMeat;
        this.isSideDish = isSideDish;
    }
}