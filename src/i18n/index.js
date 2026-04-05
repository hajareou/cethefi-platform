import { computed, ref } from 'vue'

const STORAGE_KEY = 'cethefi-locale'

const messages = {
  en: {
    common: {
      add: 'Add',
      admin: 'Admin',
      approve: 'Approve',
      author: 'Author',
      cancel: 'Cancel',
      close: 'Close',
      connectWithGithub: 'Connect with GitHub',
      continueAsGuest: 'Continue as a guest',
      dashboard: 'Dashboard',
      delete: 'Delete',
      document: 'Document',
      draft: 'Draft',
      email: 'Email',
      english: 'English',
      french: 'French',
      github: 'GitHub',
      githubRepository: 'GitHub Repository',
      importFromGithub: 'Import from GitHub',
      language: 'Language',
      login: 'Login',
      logout: 'Log out',
      menu: 'Menu',
      modify: 'Modify',
      name: 'Name',
      newDocument: 'New Document',
      published: 'Published',
      publish: 'Publish',
      reject: 'Reject',
      reviewed: 'Reviewed',
      save: 'Save',
      search: 'Search...',
      status: 'Status',
      submit: 'Submit',
      submittedForReview: 'Submitted for review',
      totalDocuments: 'Total Documents',
      unpublish: 'Unpublish',
      userManagement: 'User Management',
      year: 'Year',
    },
    layout: {
      cethefiWebsite: 'Cethefi Website',
      modifyProfile: 'Modify profile',
      nameCannotBeEmpty: 'Name cannot be empty',
      profileUpdated: 'Profile updated',
    },
    login: {
      guestModeRestricted: 'Guest mode lets you explore the interface. Modifying and publishing may be restricted.',
      subtitle: 'Manage and modify theatrical plays from the 18th century',
      title: 'Welcome to CETHEFI',
      backendNotConfigured: 'VITE_AUTH_API_BASE_URL is not configured',
      backendUnavailable: 'Auth backend is not reachable',
      githubLoginFailed: 'Unable to start GitHub login',
      guestLoginFailed: 'Guest login failed',
    },
    dashboard: {
      approveDocument: 'Document approved',
      authorUnknown: 'Unknown',
      deleteConfirm: 'Are you sure you want to delete "{title}"?',
      deleteConfirmTitle: 'Confirm deletion',
      deleted: 'Document deleted',
      filePathMissing: 'No file path available for this document',
      invalidDocumentPath: 'Invalid document path',
      lastModified: 'Last Modified',
      loadFailed: 'Failed to load document',
      loginToModify: 'Login to modify',
      manageSubtitle: 'Manage and modify theatrical plays from the 18th century',
      noFilePath: 'No file path available for this document',
      publishedMessage: 'Document published',
      rejectedMessage: 'Rejected. Sent back to draft',
      statusUnknown: 'Unknown',
      submittedMessage: 'Submitted for review',
      tableTitle: 'TEI Documents',
      title: 'Document Title',
      unpublishedMessage: 'Document unpublished',
      guestModifyHint: 'You are in guest mode. Login to modify.',
    },
    users: {
      addUser: 'Add User',
      added: 'User added',
      authorizedUsers: 'Authorized Users',
      canModify: 'Can modify',
      canPublish: 'Can publish',
      canValidate: 'Can validate',
      deleteConfirm: 'Would you like to remove {name}?',
      editUser: 'Modify user',
      emailOrGithubExists: 'A user with this email or GitHub username already exists',
      githubUsername: 'GitHub username',
      loadFailed: 'Failed to load users',
      manageSubtitle: 'Manage access and permissions via GitHub accounts',
      nameOrIdentityRequired: 'Name and at least one identity field are required',
      noChanges: 'No changes to save',
      permissionsUpdated: 'Permissions updated',
      saveFailed: 'Failed to save users',
      searchPlaceholder: 'Search name or email...',
      user: 'User',
      userNotFound: 'User not found',
      userRemoved: 'User removed',
      userUpdated: 'User updated',
      confirm: 'Confirm',
    },
    auth: {
      callbackError: 'Unable to complete sign-in. Please verify that the backend is running.',
      signingIn: 'Signing in...',
    },
    notFound: {
      message: 'Oops. Nothing here...',
      goHome: 'Go Home',
    },
  },
  fr: {
    common: {
      add: 'Ajouter',
      admin: 'Admin',
      approve: 'Approuver',
      author: 'Auteur',
      cancel: 'Annuler',
      close: 'Fermer',
      connectWithGithub: 'Se connecter avec GitHub',
      continueAsGuest: 'Continuer en invité',
      dashboard: 'Tableau de bord',
      delete: 'Supprimer',
      document: 'Document',
      draft: 'Brouillon',
      email: 'E-mail',
      english: 'Anglais',
      french: 'Français',
      github: 'GitHub',
      githubRepository: 'Dépôt GitHub',
      importFromGithub: 'Importer depuis GitHub',
      language: 'Langue',
      login: 'Connexion',
      logout: 'Se déconnecter',
      menu: 'Menu',
      modify: 'Modifier',
      name: 'Nom',
      newDocument: 'Nouveau document',
      published: 'Publié',
      publish: 'Publier',
      reject: 'Rejeter',
      reviewed: 'Révisé',
      save: 'Enregistrer',
      search: 'Rechercher...',
      status: 'Statut',
      submit: 'Soumettre',
      submittedForReview: 'Soumis pour révision',
      totalDocuments: 'Total des documents',
      unpublish: 'Dépublier',
      userManagement: 'Gestion des utilisateurs',
      year: 'Année',
    },
    layout: {
      cethefiWebsite: 'Site web de Cethefi',
      modifyProfile: 'Modifier le profil',
      nameCannotBeEmpty: 'Le nom ne peut pas être vide',
      profileUpdated: 'Profil mis à jour',
    },
    login: {
      guestModeRestricted: "Le mode invité permet d'explorer l'interface. La modification et la publication peuvent être limitées.",
      subtitle: 'Gérer et modifier des pièces de théâtre du XVIIIe siècle',
      title: 'Bienvenue sur CETHEFI',
      backendNotConfigured: "VITE_AUTH_API_BASE_URL n'est pas configuré",
      backendUnavailable: "Le backend d'authentification est inaccessible",
      githubLoginFailed: "Impossible de démarrer la connexion GitHub",
      guestLoginFailed: "La connexion invité a échoué",
    },
    dashboard: {
      approveDocument: 'Document approuvé',
      authorUnknown: 'Inconnu',
      deleteConfirm: 'Voulez-vous vraiment supprimer "{title}" ?',
      deleteConfirmTitle: 'Confirmer la suppression',
      deleted: 'Document supprimé',
      filePathMissing: "Aucun chemin de fichier n'est disponible pour ce document",
      invalidDocumentPath: 'Chemin de document invalide',
      lastModified: 'Dernière modification',
      loadFailed: 'Échec du chargement du document',
      loginToModify: 'Se connecter pour modifier',
      manageSubtitle: 'Gérer et modifier des pièces de théâtre du XVIIIe siècle',
      noFilePath: "Aucun chemin de fichier n'est disponible pour ce document",
      publishedMessage: 'Document publié',
      rejectedMessage: 'Rejeté. Renvoyé au brouillon',
      statusUnknown: 'Inconnu',
      submittedMessage: 'Soumis pour révision',
      tableTitle: 'Documents TEI',
      title: 'Titre du document',
      unpublishedMessage: 'Document dépublié',
      guestModifyHint: 'Vous êtes en mode invité. Connectez-vous pour modifier.',
    },
    users: {
      addUser: 'Ajouter un utilisateur',
      added: 'Utilisateur ajouté',
      authorizedUsers: 'Utilisateurs autorisés',
      canModify: 'Peut modifier',
      canPublish: 'Peut publier',
      canValidate: 'Peut valider',
      deleteConfirm: 'Voulez-vous supprimer {name} ?',
      editUser: "Modifier l'utilisateur",
      emailOrGithubExists: 'Un utilisateur avec cet e-mail ou ce nom GitHub existe déjà',
      githubUsername: "Nom d'utilisateur GitHub",
      loadFailed: 'Échec du chargement des utilisateurs',
      manageSubtitle: "Gérer les accès et les permissions via les comptes GitHub",
      nameOrIdentityRequired: "Le nom et au moins un champ d'identité sont requis",
      noChanges: 'Aucune modification à enregistrer',
      permissionsUpdated: 'Permissions mises à jour',
      saveFailed: "Échec de l'enregistrement des utilisateurs",
      searchPlaceholder: 'Rechercher par nom ou e-mail...',
      user: 'Utilisateur',
      userNotFound: 'Utilisateur introuvable',
      userRemoved: 'Utilisateur supprimé',
      userUpdated: 'Utilisateur mis à jour',
      confirm: 'Confirmer',
    },
    auth: {
      callbackError: "Impossible de finaliser la connexion. Vérifiez que le backend est démarré.",
      signingIn: 'Connexion en cours...',
    },
    notFound: {
      message: "Oups. Il n'y a rien ici...",
      goHome: "Retour à l'accueil",
    },
  },
}

const getInitialLocale = () => {
  if (typeof window === 'undefined') return 'en'

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'fr' || stored === 'en') return stored

  const browserLocale = window.navigator.language?.toLowerCase() ?? 'en'
  return browserLocale.startsWith('fr') ? 'fr' : 'en'
}

const locale = ref(getInitialLocale())

const applyLocale = (value) => {
  locale.value = value
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, value)
    document.documentElement.lang = value
  }
}

if (typeof window !== 'undefined') {
  document.documentElement.lang = locale.value
}

const resolveMessage = (value, params = {}) =>
  Object.entries(params).reduce(
    (message, [key, replacement]) => message.replaceAll(`{${key}}`, String(replacement)),
    value,
  )

export const useLocale = () => {
  const t = (key, params = {}) => {
    const segments = key.split('.')
    let value = messages[locale.value]

    for (const segment of segments) {
      value = value?.[segment]
    }

    if (typeof value !== 'string') return key
    return resolveMessage(value, params)
  }

  return {
    locale: computed(() => locale.value),
    setLocale: applyLocale,
    t,
  }
}
