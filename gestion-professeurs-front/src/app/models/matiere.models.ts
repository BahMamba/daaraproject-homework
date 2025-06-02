import { Niveau } from "./niveau.models";
import { Professor } from "./professor.models";

export interface Matiere {
  id: number;
  nom: string;
  description: string;
  professeur: Professor;
  professeur_nom: string;
  niveaux: Niveau[];
  niveaux_noms: string[];
}