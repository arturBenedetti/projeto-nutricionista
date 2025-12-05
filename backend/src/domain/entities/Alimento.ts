export class Alimento {
  constructor(
    public id: string,
    public nome: string,
    public categoriaId: string,
    public energiaKcal: number,
    public carboidratos: number,
    public proteinas: number,
    public gorduras: number,
    public fibras: number,
  ) {}
}
