# Pearson Garage — Mazda6 Build Lab

Interactive build configurator for Amar Pearson's 2016 Mazda6 GS sedan.

## V0.1

- **Photo Twin**: load the user's real side, 3/4 and rear photos and test modifications on the real-car canvas.
- **3D Lab**: real WebGL/Three.js configurator engine with a procedural geometry proxy.
- Controls for wheels, stance, aero, brakes, badging, tint and graphics.
- Default Pearson build: 20×8.5 ET42, red calipers, wing + diffuser, PEARSON stealth badge, no graphics.
- Build pipeline for ordered/planned/prototype/installed parts.
- Build state persists locally and can export to JSON.

## 3D accuracy

The current 3D body is deliberately labeled a **geometry proxy**. It is not presented as an exact Mazda6 mesh. The correct next step is to replace it with a properly licensed 2016 Mazda6 GLB/GLTF and then add exact part meshes for the selected wheels, wing, diffuser and badges.

Do not redistribute commercial 3D source assets unless their license permits it.

## Local development

```bash
npm run dev
```

## Build

```bash
npm run build
```

No dependencies are required for the build. Three.js is loaded as an ESM module from jsDelivr at runtime only when 3D Lab is opened.

## Cloudflare Pages

- Framework preset: **None**
- Build command: `npm run build`
- Build output directory: `dist`
- Node: 20+

## Next priorities

1. Acquire/license an accurate 2016 Mazda6 3D model.
2. Convert/optimize it to GLB and separate nodes/materials for body, glass, wheels and trim.
3. Build exact wheel, wing and diffuser assets from supplier dimensions/CAD.
4. Add wheel-fitment math: tire diameter, poke/inset, speedometer delta and clearance warnings.
5. Add saved named builds and a real cost ledger.
6. Add Cloudflare persistence only if multi-device syncing becomes useful.
