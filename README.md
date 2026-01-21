# 🧪 Test Technique – Planification de laboratoire (ALGO)

## 📌 Présentation du projet

Ce projet implémente un algorithme de planification pour un laboratoire médical, dans le cadre du **test technique – phase 3 (ALGO)**.

L’objectif est d’organiser le traitement d’échantillons médicaux en respectant :

* les priorités médicales (**STAT**, **URGENT**, **ROUTINE**),
* la disponibilité des techniciens,
* la compatibilité des équipements,
* et de produire un planning cohérent accompagné de **métriques de performance**.

Le projet est développé en **TypeScript avec Vite (Vanilla JS)**, sans framework, afin de se concentrer exclusivement sur la logique algorithmique.

---

## ▶️ Lancer le projet

### Prérequis

* Node.js ≥ 18
* Yarn

### Installation

```bash
yarn install
```

### Lancer le projet

```bash
yarn dev
```

### Lancer les tests

```bash
yarn test
```

---

## 🏗️ Structure du projet

```text
src/
├── main.ts              # Point d’entrée
├── planifyLab.ts        # Algorithme de planification
├── types.ts             # Typages métier
├── utils.ts             # Fonctions utilitaires (temps, créneaux)
test/
├── planifyLab.test.ts   # Tests unitaires
public/
index.html
```

---

## 🧠 Ce qui a été Implémenté

### 🟢 Version simple – Complète

Fonctionnalités implémentées :

* Tri des échantillons par **priorité**, puis par **heure d’arrivée**
* Allocation d’un **technicien compatible**
* Allocation d’un **équipement compatible**
* Gestion des conflits via des créneaux occupés (`techBusy`, `equipBusy`)
* Planification chronologique **sans chevauchement**
* Calcul des métriques :

  * `totalTime`
  * `efficiency`
  * `conflicts`

L’algorithme repose sur une approche **greedy (first-fit)**, suffisante pour le niveau attendu.

---

### 🟡 Version intermédiaire – Partielle

Des extensions intermédiaires ont été amorcées :

* Gestion de l’**efficacité des techniciens**
* Préparation de la logique de **parallélisme**
* Structure prête pour :

  * pauses déjeuner
  * nettoyage des équipements
  * métriques avancées

Pour cette partie, je n’ai pas pu produire l’algorithme complet. J’ai toutefois pris soin de structurer les fichiers JSON des échantillons, techniciens et équipements, de façon à ce qu’on puisse ensuite récupérer les données correspondantes pour chaque niveau d’exemple (progressif niveau 1 à 3) et tester les extensions intermédiaires. Dans le feu de l’action, j’ai oublié que des jeux de données contenant déjà des équipements nous avaient été fournis, que j’aurais pu utiliser pour créer un dossier avec les différents JSON et chercher directement les données dans ces fichiers.

---

## ⚠️ Imprévus et limitations rencontrées

### ❌ Données intermédiaires incomplètes
Dans ma logique avec les exemple progressif et sans les donnée fourni,
certains jeux de données intermédiaires fournis contiennent :

```json
"equipment": []
```

Or, selon les règles métier :

> Une analyse nécessite obligatoirement un équipement compatible.

➡️ **Aucun planning valide ne peut être généré** dans ce cas.
Le programme lève volontairement l’erreur :

```text
Ressource indisponible pour SXXX
```

Ce comportement est **intentionnel** et respecte les contraintes métier.

---

### ⚠️ Incohérence dans la spécification

Une incohérence a été identifiée entre les versions du sujet :

| Version               | Clé          |
| --------------------- | ------------ |
| Version simple        | `speciality` |
| Version intermédiaire | `specialty`  |

👉 Le projet utilise la clé **`specialty`** afin d’être compatible avec les exemples intermédiaires, malgré cette coquille dans l’énoncé.

---

## 🧪 Tests

* Tests unitaires sur la fonction `planifyLab`
* Cas nominaux
* Cas d’erreur (ressources manquantes)
* Vérification de la cohérence des métriques

