# HealthCheck Monitor

> **Version :** 1.0  
> **Backend :** Spring Boot (Java 21)  
> **Frontend :** React  
> **Base de données :** SQLite  
> **API :** REST  
> **Authentification :** JWT  

---

# Table des matières

- [1. Présentation](#1-présentation)
- [2. Objectifs](#2-objectifs)
- [3. Architecture Technique](#3-architecture-technique)
- [4. Fonctionnalités](#4-fonctionnalités)
- [5. Base de données](#5-base-de-données)
- [6. API REST](#6-api-rest)
- [7. Exigences non fonctionnelles](#7-exigences-non-fonctionnelles)
- [8. Évolutions futures](#8-évolutions-futures)
- [9. Livrables](#9-livrables)
- [10. Critères d'acceptation](#10-critères-dacceptation)

---

# 1. Présentation

## Contexte

HealthCheck Monitor est une application web permettant de superviser des services HTTP/HTTPS (API REST, sites web, applications internes ou externes).

L'application effectue automatiquement des vérifications périodiques afin de :

- détecter les indisponibilités ;
- mesurer les temps de réponse ;
- générer des statistiques de disponibilité ;
- envoyer des notifications par email ;
- conserver un historique des incidents.

Le projet doit être léger, facilement déployable et autonome.

---

# 2. Objectifs

L'application devra permettre de :

- Superviser un nombre illimité de services
- Configurer les endpoints à surveiller
- Mesurer les temps de réponse
- Détecter automatiquement les pannes
- Envoyer des alertes par email
- Afficher un tableau de bord temps réel
- Générer des statistiques
- Consulter l'historique des incidents
- Administrer entièrement la plateforme via une interface web

---

# 3. Architecture Technique

## Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- Spring Scheduler
- JWT
- JavaMailSender
- Hibernate
- Lombok
- Bean Validation

## Frontend

- React
- React Router
- Redux Toolkit
- Axios
- Material UI
- Chart.js

## Base de données

SQLite

## Communication

REST API (JSON)

---

# 4. Fonctionnalités

---

## Module A — Authentification

### Fonctionnalités

- Connexion
- Déconnexion
- JWT
- Gestion des rôles

### Rôles

### Administrateur

Peut :

- gérer les services
- gérer les utilisateurs
- configurer SMTP
- consulter les statistiques
- consulter les logs

### Utilisateur

Peut :

- consulter le dashboard
- consulter les statistiques

---

## Module B — Gestion des Services

Permet de créer, modifier, supprimer et consulter les services surveillés.

### Informations générales

| Champ | Description |
|--------|-------------|
| Nom | Nom du service |
| Description | Description |
| URL | Endpoint |
| Méthode HTTP | GET / POST / HEAD |
| Headers | JSON |
| Body | Texte |
| Timeout | secondes |
| Fréquence | secondes |
| Service actif | Oui / Non |
| Mode maintenance | Oui / Non |

---

### Validation

Chaque service pourra définir :

- Codes HTTP acceptés
- Temps maximum
- Mot-clé obligatoire
- Validation JSON

Exemple

```json
{
    "status":"OK"
}
```

---

## Module C — Gestion des Alertes

Chaque service possède sa propre configuration.

### Paramètres

- Activer les alertes
- Destinataires
- Nombre maximal d'échecs
- Délai entre deux alertes

### Exemple

API Paiement

- finance@company.com
- admin@company.com

Site Web

- marketing@company.com

---

## Module D — Configuration SMTP

Configuration globale.

### Paramètres

- Host
- Port
- Username
- Password
- TLS
- SSL
- Email expéditeur

Fonction supplémentaire :

- Test de connexion SMTP

---

## Module E — Moteur de Vérification

Le scheduler vérifie automatiquement chaque service.

Pour chaque exécution :

1. Requête HTTP
2. Mesure du temps
3. Vérification du code HTTP
4. Validation du contenu
5. Mise à jour du statut
6. Historisation
7. Notification

---

### États

#### 🟢 UP

Le service répond correctement.

Conditions :

- Code HTTP valide
- Temps inférieur au timeout
- Contenu valide

---

#### 🔴 DOWN

Le service est indisponible.

Causes possibles :

- Timeout
- DNS
- SSL
- HTTP invalide
- Validation échouée

---

#### 🟠 DEGRADED

Le service répond mais dépasse le seuil de latence.

---

## Module F — Anti Faux Positifs

Afin d'éviter les alertes inutiles :

- nouvelle tentative automatique
- nombre d'échecs consécutifs configurable

Le service ne passe à **DOWN** qu'après plusieurs échecs.

---

## Module G — Dashboard

Vue générale.

Pour chaque service :

- Statut
- Nom
- URL
- Temps de réponse
- Dernier contrôle
- Disponibilité
- Temps depuis le dernier changement

Filtres :

- Tous
- UP
- DOWN
- Maintenance

---

## Module H — Statistiques

### Disponibilité

- 24 heures
- 7 jours
- 30 jours

### Graphique de latence

Évolution du temps de réponse.

### Historique

Liste chronologique des incidents.

Informations :

- début
- fin
- durée
- cause

---

## Module I — Notifications

Notification uniquement lors :

```
UP
 ↓
DOWN
```

ou

```
DOWN
 ↓
UP
```

Aucune notification si :

```
DOWN
 ↓
DOWN
```

### Contenu

- Nom
- URL
- Heure
- Statut
- Cause
- Temps de réponse
- Lien vers le Dashboard

---

## Module J — Historique

Chaque contrôle est enregistré.

Informations :

- Date
- Heure
- Temps de réponse
- Statut
- Code HTTP
- Message d'erreur

Nettoyage automatique après **30 jours**.

---

## Module K — Administration

Fonctionnalités :

- Gestion des utilisateurs
- Configuration SMTP
- Sauvegarde
- Import JSON
- Export JSON
- Consultation des logs

---

# 5. Base de données

## users

| Champ |
|--------|
| id |
| username |
| password |
| role |
| created_at |

---

## services

| Champ |
|--------|
| id |
| name |
| description |
| url |
| method |
| headers |
| body |
| expected_status_codes |
| timeout |
| check_frequency |
| latency_threshold |
| failure_threshold |
| keyword |
| alerts_enabled |
| maintenance |
| is_active |
| created_at |
| updated_at |

---

## alert_recipients

| Champ |
|--------|
| id |
| service_id |
| email |

---

## smtp_settings

| Champ |
|--------|
| id |
| host |
| port |
| username |
| password |
| tls |
| ssl |
| from_email |

---

## check_results

| Champ |
|--------|
| id |
| service_id |
| status |
| response_time |
| http_status |
| error_message |
| checked_at |

---

## incidents

| Champ |
|--------|
| id |
| service_id |
| started_at |
| ended_at |
| duration |
| reason |

---

## audit_logs

| Champ |
|--------|
| id |
| username |
| action |
| details |
| created_at |

---

# 6. API REST

## Authentification

```
POST   /api/auth/login
POST   /api/auth/logout
```

---

## Services

```
GET    /api/services
GET    /api/services/{id}
POST   /api/services
PUT    /api/services/{id}
DELETE /api/services/{id}
```

---

## Dashboard

```
GET /api/dashboard
GET /api/dashboard/statistics
```

---

## SMTP

```
GET  /api/settings/smtp
PUT  /api/settings/smtp
POST /api/settings/smtp/test
```

---

## Historique

```
GET /api/history
GET /api/incidents
```

---

## Utilisateurs

```
GET    /api/users
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

---

# 7. Exigences non fonctionnelles

- Interface responsive
- JWT
- BCrypt
- Validation frontend/backend
- Documentation Swagger
- Journalisation
- Architecture REST
- Principes SOLID
- Docker Ready
- Tests unitaires
- Tests d'intégration

---

# 8. Évolutions futures

- Slack
- Microsoft Teams
- Discord
- Telegram
- SMS
- Webhooks
- TCP Check
- ICMP Ping
- FTP/SFTP
- Vérification SSL
- WebSocket temps réel
- PostgreSQL
- MySQL
- Kubernetes

---

# 9. Livrables

- Backend Spring Boot
- Frontend React
- Base SQLite
- Documentation API
- Documentation utilisateur
- Script SQL
- Collection Postman
- Docker Compose
- Guide d'installation

---

# 10. Critères d'acceptation

Le projet sera validé lorsque :

- ✅ Les services sont surveillés automatiquement.
- ✅ Les changements d'état sont détectés.
- ✅ Les alertes email sont envoyées aux bons destinataires.
- ✅ Le Dashboard affiche les états en temps réel.
- ✅ Les statistiques sont disponibles.
- ✅ L'historique est consultable.
- ✅ Les paramètres SMTP sont configurables.
- ✅ L'application est sécurisée avec JWT.
- ✅ Les performances sont conformes.
- ✅ Le code est documenté et maintenable.

---

# Licence

Projet interne.
