# Care Planner

Care Planner is a full-stack educational healthcare drafting app that generates structured medical and nursing support content from three intake modes:

- Condition Name Mode
- Image Analysis Mode
- Symptom Description Mode

Every result is explicitly framed as educational clinical-support drafting only. The app uses cautious language such as possible condition, suggested match, and likely condition, and every output must be reviewed by a licensed healthcare professional.

## Features

- React + Tailwind premium healthcare dashboard
- Protected login and sign-up flow with session persistence
- Condition-name generation flow preserved
- New image upload flow with preview, replace, remove, and drag-and-drop support
- New symptom analysis flow with duration, severity, history, allergies, vitals, and notes
- Express API routes for condition, symptom, and image analysis
- Modular backend services:
  `imageAnalysisService`, `symptomAnalysisService`, `planBuilder`, `safetyFormatter`
- Strong safety guardrails with disclaimers and emergency red-flag warnings
- Mock demo analysis for:
  dermatitis-like rash image, pneumonia-like symptoms, diabetes-related symptoms
- Medical, nursing, and patient-education report tabs
- Copy, print, JSON export, and PDF-friendly report layout

## Project Structure

```text
care-planner/
  client/   React + Tailwind frontend
  server/   Express backend and analysis/generation services
  docs/     sample outputs
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start both apps:

```bash
npm run dev
```

3. Open the frontend at `http://localhost:5173`.

The API runs at `http://localhost:4000`.

## Environment Variables

Server values go in `server/.env`:

```bash
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Client values can go in `client/.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

If `OPENAI_API_KEY` is not set, Care Planner uses the built-in safe mock services for image and symptom analysis.

## API Routes

- `POST /api/plans/generate`
  Existing condition-name mode
- `POST /api/plans/analyze-symptoms`
  Symptom Description Mode
- `POST /api/plans/analyze-image`
  Image Analysis Mode using base64 image upload payloads stored in memory for demo use
- `GET /api/plans/samples`
- `GET /api/plans/history`
- `GET /api/plans/favorites`

## Safety Notes

- The app does not provide a final diagnosis.
- Results are educational clinical-support drafts only.
- Images alone may be insufficient and symptom overlap is common.
- Emergency warnings are always included for severe red-flag symptoms.
- The app avoids patient-specific medication prescribing and dosages.

## Example Inputs

### Image Analysis Mode

Input:

- Image: forearm rash photo
- Context: `itchy red rash for 3 days after new lotion`

Example output summary:

- Possible condition: `Possible dermatitis or eczema-like rash`
- Confidence: `Medium`
- Key visual findings: patchy erythematous rash-like change, superficial irritation pattern
- Suggested next steps: review triggers, clinician exam if spreading or painful

### Symptom Description Mode

Input:

- Symptoms: `fever, cough, shortness of breath`
- Duration: `4 days`
- Vitals: `Temp 38.7 C, SpO2 91%`

Example output summary:

- Possible condition: `Possible pneumonia or lower respiratory infection`
- Confidence: `Medium`
- Differential considerations: bronchitis, viral infection, heart failure, pulmonary embolic disease
- Red flags: worsening dyspnea, cyanosis, confusion, chest pain

## Scripts

- `npm run dev` starts client and server together
- `npm run dev:client` starts only the React app
- `npm run dev:server` starts only the Express API
- `npm run build` builds the frontend
- `npm run start` starts the backend

## Authentication

- Unauthenticated users land on the login page first.
- Demo authentication uses browser local storage with a replaceable service abstraction in [authService.js](/c:/Users/ankit/OneDrive/Desktop/code/1st_Codex/client/src/services/authService.js).
- Sessions persist across refreshes until the user logs out.

Sample output snapshots are included in [docs/sample-output.md](/c:/Users/ankit/OneDrive/Desktop/code/1st_Codex/docs/sample-output.md).
