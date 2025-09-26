# Changements de Devise - FCFA

## Résumé des modifications

L'application Tuteur à Dom a été mise à jour pour utiliser le **Franc CFA (FCFA)** comme devise principale au lieu de l'euro.

## Fichiers modifiés

### Frontend (React/TypeScript)

#### Composants mis à jour :
- `tuteur-adom-ui/src/components/teachers/TeacherCard.tsx`
- `tuteur-adom-ui/src/components/teachers/TeachersList.tsx`
- `tuteur-adom-ui/src/components/courses/AddCourseForm.tsx`

#### Pages mises à jour :
- `tuteur-adom-ui/src/pages/TeacherProfilePage.tsx`
- `tuteur-adom-ui/src/pages/TeacherDashboardPage.tsx`

#### Nouveaux fichiers :
- `tuteur-adom-ui/src/utils/currency.ts` - Utilitaires pour la gestion des devises

### Backend (Java/Quarkus)

Aucune modification nécessaire dans le backend car :
- Les entités utilisent `BigDecimal` pour les montants
- Les données d'importation utilisent des valeurs numériques simples
- Le backend ne contient pas de références explicites aux devises

## Fonctionnalités ajoutées

### Utilitaires de devise (`currency.ts`)

```typescript
// Configuration centralisée
export const CURRENCY = {
  CODE: 'FCFA',
  SYMBOL: 'FCFA',
  NAME: 'Franc CFA',
  LOCALE: 'fr-FR'
};

// Formatage des montants
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('fr-FR')} ${CURRENCY.SYMBOL}`;
};

// Formatage des tarifs horaires
export const formatHourlyRate = (rate: number): string => {
  return `${formatCurrency(rate)}/h`;
};
```

## Changements spécifiques

### Affichage des prix
- **Avant** : `25 €/h`
- **Après** : `25 FCFA/h`

### Labels des formulaires
- **Avant** : "Tarif horaire (€)"
- **Après** : "Tarif horaire (FCFA)"

### Filtres de recherche
- **Avant** : "Tarif min (€/h)" / "Tarif max (€/h)"
- **Après** : "Tarif min (FCFA/h)" / "Tarif max (FCFA/h)"

## Avantages

1. **Centralisation** : Toute la logique de devise est centralisée dans `currency.ts`
2. **Flexibilité** : Facile de changer de devise en modifiant seulement la configuration
3. **Cohérence** : Formatage uniforme dans toute l'application
4. **Maintenabilité** : Code plus propre et plus facile à maintenir

## Notes importantes

- Les valeurs numériques dans la base de données restent inchangées
- Les données d'importation (`import.sql`) utilisent déjà des valeurs appropriées pour le FCFA
- Le backend continue de fonctionner normalement sans modification
- L'interface utilisateur affiche maintenant correctement les montants en FCFA

## Utilisation

Pour utiliser les utilitaires de devise dans de nouveaux composants :

```typescript
import { formatHourlyRate, formatCurrency, CURRENCY } from '../utils/currency';

// Affichage d'un tarif horaire
<span>{formatHourlyRate(25000)}</span> // Affiche "25 000 FCFA/h"

// Affichage d'un montant simple
<span>{formatCurrency(15000)}</span> // Affiche "15 000 FCFA"
``` 