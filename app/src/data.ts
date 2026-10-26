import type { MoodId } from './lib/theme';

export const PRESETS: { name: string; hex: string }[] = [
  { name: 'Indigo', hex: '#4F46E5' },
  { name: 'Terre cuite', hex: '#C2410C' },
  { name: 'Émeraude', hex: '#059669' },
  { name: 'Framboise', hex: '#DB2777' },
  { name: 'Océan', hex: '#0369A1' },
  { name: 'Moutarde', hex: '#CA8A04' },
  { name: 'Violet', hex: '#7C3AED' },
  { name: 'Ardoise', hex: '#475569' },
];

export const INSPIRATIONS: { name: string; hex: string; mood: MoodId }[] = [
  { name: 'Café du matin', hex: '#8B5E3C', mood: 'calme' },
  { name: 'Néon nocturne', hex: '#D946EF', mood: 'vif' },
  { name: 'Boutique de luxe', hex: '#3F3A36', mood: 'luxe' },
  { name: 'Startup SaaS', hex: '#2563EB', mood: 'tech' },
  { name: 'Jardin botanique', hex: '#4D7C0F', mood: 'naturel' },
  { name: 'Bord de mer', hex: '#0E7490', mood: 'calme' },
];

export type SourceId = 'color' | 'mood' | 'logo';
export const SOURCES: { id: SourceId; label: string }[] = [
  { id: 'color', label: 'Couleur' },
  { id: 'mood', label: 'Ambiance' },
  { id: 'logo', label: 'Logo' },
];

export type PreviewId = 'landing' | 'shop' | 'dash';
export const PREVIEWS: { id: PreviewId; label: string; url: string; caption: string }[] = [
  { id: 'landing', label: 'Landing page', url: 'ateliernord.fr', caption: 'Hero, navigation, cartes et boutons' },
  { id: 'shop', label: 'Boutique', url: 'maison-argile.fr/nouveautes', caption: 'Fiches produit, filtres et panier' },
  { id: 'dash', label: 'Dashboard', url: 'app.pilotage.fr/vue-ensemble', caption: 'Navigation, indicateurs, graphique et tableau' },
];

export const TASKS = [
  { label: 'Valider la maquette d’accueil', tag: 'Design', done: true },
  { label: 'Brancher le paiement', tag: 'Dev', done: true },
  { label: 'Rédiger la FAQ', tag: 'Contenu', done: false },
  { label: 'Tester sur mobile', tag: 'QA', done: false },
];

export const FEATURES = [
  { title: 'Tableaux partagés', text: 'Toute l’équipe voit l’avancement en temps réel.' },
  { title: 'Rappels intelligents', text: 'Les échéances arrivent au bon moment, pas avant.' },
  { title: 'Intégrations', text: 'Connecte ton agenda, ta messagerie et ton drive.' },
];

export const FILTERS = ['Tout', 'Céramique', 'Linge', 'Luminaires'];

export const NAV_ITEMS = ['Vue d’ensemble', 'Commandes', 'Clients', 'Produits', 'Réglages'];

export const KPIS = [
  { label: 'Chiffre d’affaires', value: '12 480 €', delta: '+12 % vs. septembre' },
  { label: 'Commandes', value: '342', delta: '+8 % vs. septembre' },
  { label: 'Taux de conversion', value: '3,8 %', delta: '+0,4 pt vs. septembre' },
];

export const BARS = [42, 55, 48, 63, 58, 70, 52, 66, 74, 61, 80, 92];

export const ORDERS = [
  { id: '#4821', client: 'Camille Laurent', status: 'Livrée', total: '86,00 €', done: true },
  { id: '#4820', client: 'Hugo Martin', status: 'En cours', total: '142,50 €', done: false },
  { id: '#4819', client: 'Inès Bernard', status: 'Livrée', total: '39,90 €', done: true },
];
