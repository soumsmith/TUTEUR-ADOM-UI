// Configuration de la devise
export const CURRENCY = {
  CODE: 'FCFA',
  SYMBOL: 'FCFA',
  NAME: 'Franc CFA',
  LOCALE: 'fr-FR'
};

// Fonction pour formater un montant en FCFA
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('fr-FR')} ${CURRENCY.SYMBOL}`;
};

// Fonction pour formater un tarif horaire
export const formatHourlyRate = (rate: number): string => {
  return `${formatCurrency(rate)}/h`;
};

// Fonction pour parser un montant depuis une chaîne
export const parseCurrency = (value: string): number => {
  // Supprime tous les caractères non numériques sauf le point et la virgule
  const cleanValue = value.replace(/[^\d.,]/g, '');
  // Remplace la virgule par un point pour la conversion
  const normalizedValue = cleanValue.replace(',', '.');
  return parseFloat(normalizedValue) || 0;
};

// Fonction pour traduire les statuts d'enseignant en français
export const translateTeacherStatus = (status?: string): string => {
  if (!status) return 'Non défini';
  
  const statusTranslations = {
    'PENDING': 'En attente',
    'ACTIVE': 'Actif',
    'SUSPENDED': 'Suspendu'
  };
  
  return statusTranslations[status.toUpperCase() as keyof typeof statusTranslations] || status;
}; 