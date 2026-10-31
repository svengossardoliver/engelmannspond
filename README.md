# Engelmann's Pond

A photosynthesis lab for IB Diploma Biology, and the first app in **Strothoff Biology Laboratories**. Students count oxygen bubbles from a sprig of *Elodea* under an LED lamp, design an investigation, collect many repeated counts, and process them in Strothoff Graphical Laboratories (SGL) with error bars, a t-test or a one-way ANOVA.

Created by Christopher B. Slough, Head of Science, Strothoff International School.
© 2026 Christopher B. Slough.

---

## The bench

- **LED lamp:** nine colours (405, 450, 500, 530, 590, 630, 660 and 730 nm, plus 4000 K white), a brightness dial, and a rail from 5 to 60 cm. Each colour gives a different photon flux at the same setting, as real LEDs do.
- **Meters:** a PAR (quantum) meter in µmol m⁻² s⁻¹, blind beyond 700 nm, and a lux meter weighted to the human eye.
- **One tube or three:** *1 TUBE / 3 TUBES* in the header. Three tubes stand in a row across the beam, 2.5 cm apart, each with its own sprig, solution and optical gate. Only the middle position is on the lamp's axis; *ROTATE* moves every tube one place. A top view shows the positions, and tapping a tube selects it for the meters, sprig controls and manual counter.
- **Solution and sprigs:** NaHCO₃ from 0 to 3 % w/v, nine sprigs that differ from each other, *Recut stem* and *Fresh solution*.
- **Water bath:** heater and thermostat, 10–45 °C, with a ± 0.1 °C thermometer.
- **Bubble counter:** automatic optical gates (30 s to 5 min windows; with three tubes, all three are counted at once) and a manual tally with stopwatch (space bar = TAP), one tube at a time.
- **Lab clock:** ×1, ×10 and ×30, and the room lights.

Any of wavelength, light intensity, temperature or NaHCO₃ concentration can be the independent variable.

## Guides and Predict

- **Action spectrum** (the main IA practice): planning, equalising photon flux with the PAR meter, one careful count, the mean and SD of five counts, the full data set, SGL, ANOVA and evaluation.
- **Light intensity:** tests the inverse square law with the PAR meter, then builds the light-response curve.
- **Limiting factors:** CO₂ at low and high light, after Blackman.
- **Predict, then fire:** two set-ups differ in one factor; the student predicts, the lab counts both, and a worked solution with a t-test follows.

Worked solutions show the equation, the rearrangement, the substitution and the evaluation. Answers are saved in the browser and can be downloaded.

## Data and SGL

Every count is logged with its conditions, including the tube, its position and how long the sprig had settled. The results table can treat each count as a trial, or each sprig's mean as a trial (the default with three tubes, since sprigs are the independent replicates). The results table groups ticked counts by the chosen independent variable, warns when a control variable drifted, and sends the table to SGL with ± 1 SD error bars. SGL's **Statistics** panel then runs the ANOVA or t-test.

## Teacher set-up links

The help sheet builds a link that fixes settings for a class:

- `?tubes=1` or `?tubes=3`: the tube switch is locked.
- `?counter=manual`: the automatic counter is removed; students count by hand.
- `?trials=count` or `?trials=sprig`: the results table's trials setting is locked.

For example `https://<site>/?tubes=1&counter=manual`. Make the link from the live site, so it points there. The header shows the active settings.

---

## The model

The rate is net O₂ release, turned into bubbles.

- **Light:** a non-rectangular hyperbola (θ = 0.85), so light and the dark-reaction factors co-limit as Blackman described. Saturation near 400 µmol m⁻² s⁻¹ of effective light.
- **Wavelength:** photons absorbed × quantum yield per incident photon, relative to 660 nm. Elodea leaves are two cells thick, so they absorb green poorly (530 nm ≈ 0.43 of 660 nm).
- **Temperature:** Q₁₀ ≈ 2 to an optimum near 29 °C, then enzyme loss; respiration keeps rising. Above 38 °C the sprig is damaged permanently. Warm water releases dissolved gas even in the dark.
- **CO₂:** Michaelis–Menten in NaHCO₃ on top of the carbon in tap water; slight inhibition above 1.5 %. The sprig uses up the NaHCO₃.
- **Lamp:** an 8 cm LED array, so close up it is not a point source (I₁₀ / I₂₀ ≈ 3.6, not 4). A tube 2.5 cm off the axis gets about 3 % less light at 15 cm and about 22 % less at 5 cm. A close, bright lamp warms the water when the bath is off.

**Deliberate realism.** Sprigs differ (± 15 %); bubble size depends on the cut and varies bubble to bubble (± 20 %); the rate wanders minute to minute; after any change the sprig takes a few minutes to settle; the optical counter merges bubbles closer than 0.3 s; the PAR and lux meters carry small calibration errors; room lights add 4 µmol m⁻² s⁻¹.

The tests (`tests.html`) check the model against these properties and the statistics against SciPy.

---

## Deployment

The app is a single self-contained file, `index.html`. Put it in a GitHub repository connected to Netlify (no build command; publish directory = repository root). The **Open in SGL** link targets `https://sisgraphicallaboratory.netlify.app/`.

**Tests:** open `tests.html` in a browser, or run `node ci.mjs` (needs Playwright). GitHub Actions runs them on every push (`.github/workflows/tests.yml`).

**Browsers:** current Chrome, Edge, Firefox and Safari, on a computer or a tablet in landscape. Phones are not supported.
