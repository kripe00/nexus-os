# NexusOS — Veikart og Forbedringsplan (Roadmap)

Dette dokumentet samler de viktigste forbedringsområdene for **NexusOS**, strukturert i fire konkrete faser som vi kan plukke opp og gjennomføre steg for steg.

---

## Fase 1: Dynamisk IntraWeb, Tidslinje og «OSINT-støy»

**Mål:** Gjøre IntraWeb og Chirper til en levende verden som utvikler seg i takt med historien, og hvor spilleren faktisk må lete blant realistisk støy.

### Konkrete oppgaver

- [ ] **Kapittelstyrt tidslinje i Chirper og Nyhetsfeed (`src/apps/IntraWebApp.tsx`):**
  - Filtrer innlegg og nyhetssaker basert på `currentMissionIndex` / `completedMissionIds`.
  - Legg til reaktive innlegg etter fullførte oppdrag (f.eks. pressemeldinger om datainnbrudd hos Velox AI etter Op 02, eller strømnett-ustabilitet etter Op 08).
- [ ] **Realistisk «hverdagsstøy» (Red Herrings):**
  - Legg til irrelevante Chirper-poster, ansattprofiler på Velox/Aethelgard og vanlige e-poster i innboksene som _ikke_ er ledetråder.
- [ ] **Manuell tekst-utheving / søk på Hardcore:**
  - Tillat at spilleren også kan kopiere/notere informasjon direkte eller bruke søkefeltet mer aktivt fremfor kun å klikke på nøkkelord.

---

## Fase 2: Mindre Automasjon i Clue Board og PassWeaver

**Mål:** Gi spilleren en ekte følelse av å knekke koder og koble bevis selv — spesielt på `Operative` og `Zero-Ghost (Hardcore)`.

### Konkrete oppgaver

- [ ] **Vanskelighetsgrad-styrt Clue Board (`src/components/ClueBoardSidebar.tsx`):**
  - **Analyst (Story):** Nåværende oppførsel (klikk på et bevis sender det rett til riktig app og målperson).
  - **Operative / Zero-Ghost:** Ikke avslør automatisk hvilken målperson et funnet hint tilhører, og krev at spilleren selv velger mål-epost og kombinerer riktige brikker i PassWeaver.
- [ ] **Mer engasjerende PassWeaver (`src/apps/PassWeaverApp.tsx`):**
  - Innfør passord-regler/mønstre (f.eks. `[Substantiv] + [Årstall]` vs. `[Enhet] + [PIN]`) som spilleren må utlede fra kontekst (f.eks. IT-policy i en e-post eller hint i loggfiler).
  - Begrens antall forsøk før midlertidig rate-limit på Hardcore, slik at man ikke bare kan prøve alle kombinasjoner blindt.

---

## Fase 3: Dypere Terminal- og Server-infiltrasjon

**Mål:** Gjøre hver server-breach i `src/apps/SmartTerminalApp.tsx` unik og spennende under aktiv trace.

### Konkrete oppgaver

- [ ] **Hierarkisk filsystem på servere (`src/data/worldData.ts`):**
  - Støtte for mapper (`cd`, `ls -la`, `pwd`, `find`) slik at bevisfiler ikke alltid ligger rett på rot-nivå.
- [ ] **Aktive prosesser og mottiltak under Trace:**
  - Kommandoer som `ps` og `kill <pid>` på målserveren for å stanse fiendtlige vakt-prosesser (som ellers øker trace-hastigheten).
- [ ] **Låste arkiver og to-trinns gåter på serveren:**
  - Enkelte filer på en server kan kreve en dekrypteringsnøkkel eller passordfrase som finnes i en `.conf`- eller `.log`-fil i en annen mappe på samme server.

---

## Fase 4: Modulær Kodearkitektur og Ytelse

**Mål:** Gjøre kodebasen raskere å jobbe i, støtte full Vite Fast Refresh (HMR), og forhindre state-bugs mellom systemer.

### Konkrete oppgaver

- [ ] **Splitte opp `src/context/GameContext.tsx`:**
  - `WindowContext.tsx`: Vindusposisjoner, minimering, fokus, z-index og skalering.
  - `SettingsContext.tsx`: Lydvolum, CRT-modus, vanskelighetsgrad og profil-slots.
  - `CampaignContext.tsx`: Oppdragsprogresjon, `chatHistory`, ledetråder og terminal/server-tilstand.
  - Flytte `useGame`-hooken til en egen fil (`src/hooks/useGame.ts`) slik at Vite Fast Refresh fungerer uten full side-reload.
- [ ] **Komponentoppdeling av `src/apps/IntraWebApp.tsx`:**
  - Trekke ut hver nettside (`ChirperPage.tsx`, `WebmailPage.tsx`, `VeloxPage.tsx`, `AethelgardPage.tsx`, `ScadaPage.tsx`, `DarkForumPage.tsx`) i `src/apps/intraweb/`.
- [ ] **Code-splitting i Vite (`React.lazy`):**
  - Lazy-loade tunge apper og lydsynthesizer slik at produksjonsbundlen (`dist/`) kommer godt under 500 kB per chunk.
