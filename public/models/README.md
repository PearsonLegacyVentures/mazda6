# Mazda6 3D model asset

The configurator currently ships with a compact geometry version of the **2015 Mazda 6 sedan** model supplied by Amar in this project.

## Runtime assets

- `public/models/mazda6-compact.json` — compact, browser-decodable body geometry generated from the supplied GLB. This is the active built-in Mazda body.
- `public/models/mazda6.glb` — optional full GLB override. If this file is later added, the app will prefer it automatically.

The compact asset intentionally strips the original wheel meshes and image textures. The body silhouette and separate material groups are preserved, while paint, glass, chrome, lights, wheels, calipers and aero are rendered procedurally so the configurator can modify them.

## Source model attribution

Metadata embedded in the supplied GLB identifies:

- **Title:** mazda 6 sedan
- **Creator:** amogusstrikesback2
- **Creator page:** https://sketchfab.com/amogusstrikesback2
- **Source:** https://sketchfab.com/3d-models/mazda-6-sedan-5283be51d5594d1fb030e6538808cbe7
- **License:** Creative Commons Attribution 4.0 (CC BY 4.0)
- **License URL:** https://creativecommons.org/licenses/by/4.0/

The attribution above must remain with any public deployment or redistribution of the derived geometry.

## Vehicle accuracy

This is a **2015 Mazda 6** source model. Amar's car is a 2016 Mazda6 GS, so the geometry is being used as the closest available GJ-generation digital base rather than being represented as a millimeter-perfect scan of the actual car.

## Future asset upgrade

If a higher-detail or exact 2016 GLB is acquired later, place it at:

`public/models/mazda6.glb`

The 3D Lab will load that asset first and fall back to the compact 2015 geometry automatically.
