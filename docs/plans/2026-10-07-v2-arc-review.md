# Existing v2 library review against Arc

User authorized reviewing every existing v2 component against the Arc UI reference, improving existing components only, and producing a single before/after HTML page. Interpret "RQI" as Arc UI from the continuing reference context.

Preserve all 58 installable components, their public APIs, MyOperator primary colors and corner radii, neutral text hierarchy and v1 compatibility. Review three families in parallel: forms; navigation/overlays; display. Recently rebuilt action primitives receive a fresh reference review but need no arbitrary extra motion.

Freeze source/story snapshots before the new pass. The comparison runtime loads the frozen stories in isolated iframes beside current canonical stories. Provide searchable/filterable cards, truthful per-component notes and reference links, common story selection, synchronized common Controls, and reset. Existing examples remain independent to allow realistic pointer/keyboard tests. Generate one /v2-review.html page with all components and include retained/no-direct-counterpart results. Do not manufacture changes where the reference calls for static content.

Run family-focused functional verification, shared type/lint/CSS/CLI gates, frozen-snapshot integrity, and review-page protocol tests. Build docs and canonical Storybook, preserve generated public snapshot files, and restart localhost. Browser policy blocked localhost earlier: do not work around that restriction; report that local visual sign-off remains outstanding. All work stays local; no commits, pushes, publishing or product/Figma sync.
